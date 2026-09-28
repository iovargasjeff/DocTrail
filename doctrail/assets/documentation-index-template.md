# Índice de documentación del proyecto

<!--
Use this as `docs/indice.md` for a complete project-documentation baseline.
Create concise, substantive area index pages for all four core areas in the same
materialization. Keep the planning section only when the user opts in. If a
repository already has a useful index, adapt it without maintaining two competing
indexes. Rename or remove an existing index only when the user authorizes that change.
Before delivery, remove comments and any optional section with no real content.
-->

## Cómo usar esta documentación

<!-- Indica audiencia, alcance y dónde se mantiene el estado vivo de ejecución. -->

## Áreas base

| Área | Contenido | Índice |
|---|---|---|
| Contexto | Propósito, usuarios, alcance, restricciones e incógnitas relevantes. | [00-contexto](00-contexto/indice.md) |
| Funcional | Inventario de capacidades, RF/RNF, reglas, historias, casos de uso relevantes, dominio y secuencia principal. | [01-funcional](01-funcional/indice.md) |
| Arquitectura | Límites actuales/objetivo, contexto C4, stack, datos e integraciones. | [02-arquitectura](02-arquitectura/indice.md) |
| Calidad y operación | Verificación trazada, ejecución y despliegue/hosting actual o aún no decidido; enlaza los RNF canónicos del área funcional. | [04-calidad-operacion](04-calidad-operacion/indice.md) |

## Planificación (opcional)

<!-- Incluye solo si el usuario quiere plan local o un índice al issue tracker/tablero. -->

<!-- [Plan o tracker](03-planificacion/indice.md) — indica qué sistema tiene la autoridad. -->

## Navegación y autoridad

- El código representa la implementación actual; pruebas/CI son evidencia solo de lo que cubren.
- Las decisiones arquitectónicas significativas se registran como ADR bajo `02-arquitectura/adr/` cuando existan.
- El estado de ejecución en vivo permanece en su sistema de seguimiento y no se duplica aquí.
