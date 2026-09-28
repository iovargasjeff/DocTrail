# Eval 13 — Small project documentation baseline

## Exact prompt

> Usa `$project-architect` para crear una documentación base breve para este pequeño proyecto de lista de compras personal. Quiero que alguien pueda volver en seis meses y entender para qué sirve, qué hace, cómo está construido y cómo ejecutarlo/verificarlo. No quiero roadmap, milestones ni planificación formal.

## Fixture or available context

- Existing local-only application with one user and a small codebase.
- The repository has a README and a runnable development command; no deployment target is configured.
- A few tests exist, but there is no formal test strategy or accepted ADR.
- The user explicitly declines planning artifacts.
- `docs/` does not yet exist; the user authorized a complete base documentation set.

## Expected mode

- Route: `DOCS`, using a focused `REVIEW` to gather current repository evidence.
- Mode: `MATERIALIZE` for the authorized documentation baseline only.

## Allowed actions

- Inspect the repository instructions, README, relevant code, package scripts, and existing tests.
- Create the root documentation index and four concise core-area pages.
- Embed in the functional overview an editable use-case view and a sequence view for the primary use case; embed a minimal C4 system-context view in the architecture overview.
- State that deployment is undecided/not configured when no evidence says otherwise.

## Required behaviors

- Create `docs/indice.md` and one substantive `indice.md` under `00-contexto/`, `01-funcional/`, `02-arquitectura/`, and `04-calidad-operacion/`.
- Keep each area proportional to the small project while covering purpose/scope, capabilities and requirement IDs, architecture/stack, and quality/verification/deployment status respectively.
- Include concise `RF` and `RNF` registers, with source/disposition, acceptance or quality target, and a verification method; record unknown targets instead of inventing them.
- Include concise user stories for the user-facing capabilities and map each source capability to requirements or an explicit disposition. Keep canonical behavior in one place and cross-link it.
- Use a detailed `CU` only if the flow has meaningful rules, alternatives, failures, or risk. A standard create/list flow can be represented by the required view and concise requirement/acceptance criteria instead of a long use-case narrative.
- Include a compact traceability view between requirements and verification. At least the primary/high-risk flow has a named test case or a clear manual verification case.
- Include all three baseline visual views even for this small app. Use the real local user and app boundary; show the selected primary flow without inventing participants or behavior.
- Base claims on inspected repository evidence; distinguish current behavior from unknowns or future ideas.
- Keep requirements, stories, diagrams, and test notes concise; do not repeat the same behavior in several artifacts.
- Omit `03-planificacion/` because the user declined planning.
- Do not create an ADR merely to fill `02-arquitectura/adr/`.

## Prohibited behaviors

- Do not add a roadmap, milestones, issue plan, `03-planificacion/`, or empty placeholder files.
- Do not invent cloud hosting, unverified test results, users, or product requirements.
- Do not create verbose specifications, exhaustive test catalogs, deployment runbooks, or risk registers without evidence that their depth is warranted; this does not permit omitting concise RF/RNF IDs, acceptance, verification, or source coverage.
- Do not move or rewrite source code.

## Files that may be modified

- `docs/indice.md`
- `docs/00-contexto/indice.md`
- `docs/01-funcional/indice.md`
- `docs/02-arquitectura/indice.md`
- `docs/04-calidad-operacion/indice.md`

## Observable pass criteria

- All four core areas exist and contain concise, evidence-based information.
- The functional and quality areas contain identifiable RF/RNF entries and concise acceptance/verification links without duplicating every ordinary interaction as a full use case.
- User-facing capabilities have brief HU entries and each source capability is either traced to requirement IDs or explicitly dispositioned.
- The traceability view connects requirements to verification; claims about tests match evidence actually inspected or run.
- The functional page contains an actor-to-use-case view and a primary-use-case sequence; the architecture page contains a minimal C4 context view. They are editable, truthful, and embedded in the overview pages rather than split into unnecessary files.
- The root index resolves to the four created pages.
- There is no planning folder or milestone content.
- Deployment is accurately described as unconfigured rather than guessed.
- No ADR or oversized document set is generated without need.
