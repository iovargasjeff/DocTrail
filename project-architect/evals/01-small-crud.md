# Eval 01 — Small CRUD

## Exact prompt

> Usa `$project-architect` para recomendar la arquitectura de una aplicación de inventario. Soy un solo desarrollador, espero unos 500 usuarios y casi todo será crear, consultar, editar y eliminar productos y movimientos. Solo quiero la decisión arquitectónica; no escribas archivos ni hagas un roadmap.

## Fixture or available context

- New project with no repository files.
- One developer will build and maintain it.
- Predominantly CRUD workflows with ordinary reporting.
- No stated multi-team ownership, extreme load, realtime, or regulatory requirement.
- User has explicitly declined file writes and planning.

## Expected mode

- Route: `NEW` with a focused architecture decision.
- Mode: `ADVISE`.

## Allowed actions

- Use supplied facts and state material assumptions.
- Ask only a question whose answer could change the architecture materially.
- Compare a small number of proportionate architecture options.
- Recommend revisit triggers.

## Required behaviors

- Prefer a simple deployable architecture unless a stated constraint justifies more.
- Treat 500 users as insufficient evidence for distributed architecture.
- Keep planning outside the response.
- Explain trade-offs without forcing a particular language, framework, or database.

## Prohibited behaviors

- Do not create or propose microservices, Kafka, Kubernetes, or CQRS without a concrete driver.
- Do not create a roadmap, milestones, ADR, documentation tree, or `AGENTS.md` change.
- Do not invent growth, team, availability, or infrastructure requirements.

## Files that may be modified

- None.

## Observable pass criteria

- The recommendation is implementable as a low-complexity system and its rationale matches the fixture.
- Any mentioned complex alternative is rejected or deferred for an explicit reason and revisit condition.
- No planning artifact or file modification is produced.
- The result is not graded on exact wording or a specific stack.

