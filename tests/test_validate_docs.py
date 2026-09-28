from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parents[1] / "doctrail" / "scripts"
sys.path.insert(0, str(SCRIPT_DIR))

import validate_docs  # noqa: E402


class ValidateDocsTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.docs = Path(self.temp_dir.name) / "docs"
        self.write("indice.md", "# Docs\n\n[Funcional](01-funcional/indice.md)\n")
        self.write("00-contexto/indice.md", "# Contexto\nPropósito del proyecto.\n")
        self.write(
            "01-funcional/indice.md",
            """# Funcional

## Actores y capacidades

| ID | Actor | Capacidad | Resultado | RF |
|---|---|---|---|---|
| CU-001 | Persona usuaria | Crear nota | Nota guardada | RF-001 |

## Historias de usuario

| ID | Historia | RF |
|---|---|---|
| HU-001 | Como usuaria quiero guardar una nota para consultarla después. | RF-001 |

```mermaid
flowchart LR
  person --> capability
```

```mermaid
sequenceDiagram
  actor Person
  Person->>App: Guarda nota
```

## Matriz de trazabilidad

| Fuente | RF/RNF | HU/CU | Diseño | TC |
|---|---|---|---|---|
| Petición de guardar nota | RF-001, RNF-001 | HU-001, CU-001 | App | TC-001 |
""",
        )
        self.write(
            "01-funcional/requerimientos.md",
            """# Requerimientos

| ID | Requerimiento | Fuente | Prioridad | Estado | Aceptación | Verificación |
|---|---|---|---|---|---|---|
| RF-001 | El sistema debe guardar y mostrar una nota. | Usuario | P0 | INCLUIDO | La nota reaparece al volver a abrir. | TC-001 |
| RNF-001 | El almacenamiento debe persistir localmente. | Usuario | P0 | INCLUIDO | La nota sobrevive al reinicio. | TC-001 |
""",
        )
        self.write(
            "02-arquitectura/indice.md",
            """# Arquitectura

## C4 contexto del sistema

```mermaid
C4Context
  Person(user, "Persona")
  System(app, "App")
  Rel(user, app, "Usa")
```
""",
        )
        self.write(
            "04-calidad-operacion/indice.md",
            """# Calidad y operación

## Casos de prueba

| ID | Requisitos | Preparación | Acción | Resultado | Método |
|---|---|---|---|---|---|
| TC-001 | RF-001, RNF-001 | App local | Guardar nota | Sigue disponible tras reinicio | Manual |
""",
        )

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def write(self, relative: str, content: str) -> Path:
        path = self.docs / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return path

    def test_accepts_concise_complete_baseline(self) -> None:
        self.assertEqual(validate_docs.validate(self.docs), [])

    def test_detects_duplicate_requirement_definition(self) -> None:
        with (self.docs / "01-funcional" / "requerimientos.md").open("a", encoding="utf-8") as stream:
            stream.write("\n| RF-001 | Duplicado | Usuario | P0 | INCLUIDO | Sí | TC-001 |\n")
        issues = validate_docs.validate(self.docs)
        self.assertTrue(any("multiple register definitions" in issue for issue in issues))

    def test_detects_undefined_cross_reference(self) -> None:
        with (self.docs / "01-funcional" / "indice.md").open("a", encoding="utf-8") as stream:
            stream.write("\nLa función futura usa RF-999.\n")
        issues = validate_docs.validate(self.docs)
        self.assertTrue(any("RF-999 is referenced but has no register definition" in issue for issue in issues))

    def test_detects_requirement_missing_from_traceability(self) -> None:
        path = self.docs / "01-funcional" / "indice.md"
        content = path.read_text(encoding="utf-8")
        content = content.replace("Petición de guardar nota | RF-001, RNF-001", "Petición de guardar nota | RNF-001")
        path.write_text(content, encoding="utf-8")
        issues = validate_docs.validate(self.docs)
        self.assertTrue(any("RF-001 is defined but absent from the traceability section" in issue for issue in issues))

    def test_detects_missing_nonfunctional_requirement(self) -> None:
        path = self.docs / "01-funcional" / "requerimientos.md"
        path.write_text(
            path.read_text(encoding="utf-8").replace(
                "| RNF-001 | El almacenamiento debe persistir localmente. | Usuario | P0 | INCLUIDO | La nota sobrevive al reinicio. | TC-001 |\n",
                "",
            ),
            encoding="utf-8",
        )
        issues = validate_docs.validate(self.docs)
        self.assertTrue(any("no registered non-functional requirement ID" in issue for issue in issues))

    def test_detects_broken_relative_link(self) -> None:
        with (self.docs / "indice.md").open("a", encoding="utf-8") as stream:
            stream.write("\n[Missing](missing.md)\n")
        issues = validate_docs.validate(self.docs)
        self.assertTrue(any("broken local link" in issue for issue in issues))

    def test_links_only_supports_custom_layout(self) -> None:
        custom = Path(self.temp_dir.name) / "custom"
        custom.mkdir()
        (custom / "start.md").write_text("# Inicio\n", encoding="utf-8")
        self.assertEqual(validate_docs.validate(custom, links_only=True), [])


if __name__ == "__main__":
    unittest.main()
