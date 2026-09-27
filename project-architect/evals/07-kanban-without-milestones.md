# Eval 07 — Kanban without milestones

## Exact prompt

> Usa `$project-architect` para ordenar técnicamente este proyecto en `docs/delivery.md`. Trabajamos con Kanban y no queremos milestones ni sprints. Organiza lo aceptado y conserva las ideas posteriores sin convertirlas en compromisos.

## Fixture or available context

- Existing project with an accepted architecture and a small product team.
- Work includes one feasibility spike, a core end-to-end flow, two later capabilities, and an external integration dependency.
- Kanban board is the live execution source.
- `docs/delivery.md` exists and is the only authorized file.

## Expected mode

- Route: requested technical delivery planning.
- Mode: `MATERIALIZE` for `docs/delivery.md` only.

## Allowed actions

- Use Now/Next/Later, capability sequence, or concise next steps.
- Describe dependencies, risk reduction, learning, gates, and future capabilities.
- Link the Kanban board if a verified link is available.

## Required behaviors

- Use a representation compatible with Kanban and the explicit no-milestones preference.
- Sequence the spike and end-to-end flow by learning and dependency value.
- Separate committed direction from future ideas.
- Keep live status, assignments, and dates in Kanban.

## Prohibited behaviors

- Do not create milestones, sprints, a backlog mirror, percentages, owners, or dates.
- Do not create extra files or change architecture documentation.
- Do not present `FUTURE` capabilities as committed.
- Do not impose Scrum or another methodology.

## Files that may be modified

- `docs/delivery.md`

## Observable pass criteria

- The authorized file uses a milestone-free representation.
- Near work is more concrete than distant work and ordering has an explicit rationale.
- Future ideas are visibly noncommitted.
- No live Kanban state is duplicated.

