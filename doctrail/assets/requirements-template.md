# Requerimientos y cobertura funcional

<!-- Adapt this content into the functional area. Keep one canonical definition per ID; remove examples and unused sections before delivery. A small project may keep this in its functional index. -->

## Alcance y fuentes

| Fuente | Capacidad / necesidad | Disposición | Requisitos relacionados | Nota |
|---|---|---|---|---|
| [archivo, entrevista o decisión] | [necesidad expresada] | ACCEPTED / RECOMMENDED-PROPOSED / DEFERRED-FUTURE / PENDING / REJECTED / OUT_OF_SCOPE | RF-001 | [motivo o dependencia] |

<!-- Every source capability must be mapped or explicitly classified. Do not treat a link to a topic page as proof that its requirements were captured. -->

## Requerimientos funcionales

| ID | Requerimiento observable | Fuente | Prioridad | Disposición | Criterios de aceptación | Verificación |
|---|---|---|---|---|---|---|
| RF-001 | El sistema debe [comportamiento verificable]. | [fuente] | P0 / P1 / P2 | ACCEPTED / RECOMMENDED-PROPOSED / DEFERRED-FUTURE / PENDING / REJECTED / OUT_OF_SCOPE | [resultado observable] | TC-001 / manual: [comprobación] |

<!-- If the repository has no priority convention, define the chosen scale once (for example P0 = needed for the first usable/safe outcome, P1 = accepted follow-up scope, P2 = optional evolution). Do not let priority silently imply user approval. -->

## Requerimientos no funcionales

| ID | Atributo | Escenario y respuesta esperada | Objetivo / estado | Fuente | Prioridad | Disposición | Verificación |
|---|---|---|---|---|---|---|---|
| RNF-001 | [seguridad, disponibilidad, rendimiento, etc.] | Bajo [condición], el sistema debe [respuesta]. | [medida aceptada o TBD con pregunta pendiente] | [fuente] | P0 / P1 / P2 | ACCEPTED / RECOMMENDED-PROPOSED / DEFERRED-FUTURE / PENDING / REJECTED / OUT_OF_SCOPE | [método / TC-001] |

<!-- Include only quality attributes that matter. Keep this register present in every complete baseline; make unknown targets explicit rather than inventing thresholds. -->

## Reglas de negocio

| ID | Regla / invariante | Fuente | Requisitos relacionados | Verificación relevante |
|---|---|---|---|---|
| RN-001 | [regla confirmada] | [fuente] | RF-001 | TC-001 |

<!-- If no domain rules have been identified, say so with the inspection/source boundary; do not invent rules to fill the table. -->

## Glosario y modelo de dominio

| Término / entidad | Significado y responsabilidad | Relación o regla importante | Fuente/estado |
|---|---|---|---|
| [término confirmado] | [definición breve] | [regla/relación o N/A] | [documentado/observado/pendiente] |

<!-- Include a small entity/relationship view only when it clarifies actual domain structure; do not diagram a simple list or mirror database tables without a reader need. -->

## Historias y casos de uso

- Historias de usuario: [índice funcional](indice.md#historias-de-usuario) — canonical `HU` entries.
- Casos de uso: [índice funcional](indice.md#actores-y-capacidades) — canonical `CU` catalog; link detailed flows only when they add meaningful behavior or risk context.

## Matriz de trazabilidad

| Fuente/capacidad | Disposición | RF/RNF/RN | HU/CU | Diseño/API/datos | TC/verificación | Plan (solo si existe) |
|---|---|---|---|---|---|---|
| [fuente] | INCLUIDO | RF-001, RNF-001 | HU-001, CU-001 | [vista/contrato] | TC-001 | [fase/tarea o N/A] |

<!-- Use N/A with a short reason. Every in-scope RF/RNF needs acceptance and verification; high-risk requirements should link to named test cases. -->
