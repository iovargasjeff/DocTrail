# Eval 12 — Preserve future ideas

## Exact prompt

> Usa `$project-architect` para actualizar `docs/delivery.md` y `docs/future-capabilities.md`. Debemos entregar primero el flujo principal, pero quiero conservar todas mis ideas: algunas son obligatorias, otras solo recomendadas y otras quizá sean para mucho después. No elimines las que no recomiendes; explica los conflictos y ordénalas sin prometer que todas se harán.

## Fixture or available context

- Large project with an accepted architecture and existing delivery documents.
- Ideas include a required core workflow, recommended observability, optional collaboration, a possible marketplace, and two mutually incompatible data-ownership models.
- The volume already justifies a separate future-capabilities file.
- No dates, owners, live issue status, or authorization for other files is provided.

## Expected mode

- Route: requested delivery planning and idea preservation.
- Mode: `MATERIALIZE` for the two named files only.

## Allowed actions

- Sequence accepted work by dependency, risk, value, and learning.
- Classify ideas using durable states.
- Preserve nonrecommended ideas with rationale and reconsideration conditions.
- Link promoted or superseded ideas to related phases, capabilities, or decisions when those links exist.

## Required behaviors

- Separate `COMMITTED`, `RECOMMENDED`, `FUTURE`, `DECISION NEEDED`, and `NOT RECOMMENDED` ideas.
- Surface the incompatible data-ownership models as a decision rather than pretending both can be committed.
- Keep future capabilities visibly noncommitted.
- Preserve idea history when promoting or superseding.

## Prohibited behaviors

- Do not silently delete, commit, or fully design every idea.
- Do not use live states such as `IN PROGRESS`, add percentages, or invent dates and owners.
- Do not modify architecture, ADR, `AGENTS.md`, or implementation files.
- Do not create one file per idea.

## Files that may be modified

- `docs/delivery.md`
- `docs/future-capabilities.md`

## Observable pass criteria

- Both authorized files preserve the requested ideas and distinguish commitment from possibility.
- Conflicting ideas require an explicit decision and are not simultaneously scheduled as compatible.
- Accepted work has a defensible sequence; distant ideas remain higher level.
- Only the two named files change and no operational state is invented.

