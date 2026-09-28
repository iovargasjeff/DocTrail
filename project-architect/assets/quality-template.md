# Calidad, verificación y operación

<!-- Adapt into the quality/operations area. Keep applicable requirements and evidence; remove examples and unsupported targets before delivery. -->

## Requerimientos no funcionales

<!-- Keep the canonical RNF register in the functional requirements document if that is the chosen source of truth; link to it rather than duplicating rows here. -->

- Registro RNF canónico: ruta/enlace verificado al registro del área funcional.
- Atributos relevantes: [seguridad / privacidad / rendimiento / confiabilidad / recuperación / usabilidad / compatibilidad / operabilidad]
- Pendientes de medición o decisión: [RNF IDs y pregunta abierta, o “ninguno identificado” con alcance de revisión]

## Estrategia de verificación

| Nivel / método | Alcance | Requisitos cubiertos | Evidencia / comando |
|---|---|---|---|
| [unitario / integración / API / E2E / manual / operación] | [qué demuestra] | RF-001, RNF-001 | [ruta, comando o evidencia] |

<!-- Distinguish test design from results actually run. Do not claim a requirement is verified because a test is merely planned or exists. -->

## Casos de prueba relevantes

| ID | Requisitos | Preparación | Acción | Resultado esperado | Método |
|---|---|---|---|---|---|
| TC-001 | RF-001, RNF-001 | [estado/datos] | [acción] | [resultado observable] | AUTOMATIZADA / MANUAL |

<!-- Give critical or high-risk requirements explicit test cases. A manual check is valid when automation is disproportionate, but its expected result must still be unambiguous. -->

## Ejecución y operación

- **Ejecución local:** [comando verificado o TBD]
- **Despliegue/hosting actual:** [hecho observado o “no decidido/no configurado”]
- **Configuración y secretos:** [fuente segura y requisitos relevantes]
- **Datos, backup y recuperación:** [política verificada/objetivo/pendiente, según evidencia]
- **Observabilidad y soporte:** [señales y procedimientos importantes, si aplican]
- **Riesgos/gates operativos:** [referencias a IDs y controles o N/A con motivo]

## Evidencia y estado

| Comprobación | Resultado | Evidencia | Fecha o revisión, si disponible |
|---|---|---|---|
| [comando/caso TC] | NO EJECUTADA / PASÓ / FALLÓ / PARCIAL | [salida/ruta] | [solo si se conoce] |
