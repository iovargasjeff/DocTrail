# Eval 03 — Fintech MVP

## Exact prompt

> Usa `$doctrail` para diseñar y documentar la arquitectura y el plan técnico de un MVP que recibirá pagos y registrará movimientos de dinero. Crea `docs/architecture.md` y `docs/delivery.md`. Necesito milestones útiles, pero no inventes fechas.

## Fixture or available context

- New customer-facing product operated by a small team.
- It accepts payment-provider webhooks and records monetary movements.
- Duplicate delivery and out-of-order events are possible.
- Auditability, authorization, data protection, reconciliation, and recovery matter.
- No stack has been selected and no dates or named owners are known.
- Target `docs/` directory exists; no `AGENTS.md` change was requested.

## Expected mode

- Route: `NEW` plus requested planning.
- Mode: `MATERIALIZE` for the two named files only.

## Allowed actions

- Recommend a proportionate architecture and assurance profile.
- Create the two authorized documents.
- Define outcome milestones and security or readiness gates.
- Mark unknowns and proposed decisions explicitly.

## Required behaviors

- Raise assurance because of financial consequence even though the product is an MVP.
- Address idempotency, transaction boundaries, auditability, authorization, webhook verification, reconciliation, observability, and recovery.
- Use milestones with observable exit criteria tied to risk and evidence.
- Keep unaccepted architectural choices proposed rather than accepted facts.

## Prohibited behaviors

- Do not equate MVP with low assurance.
- Do not invent dates, owners, compliance regimes, evidence, scale, or provider capabilities.
- Do not modify `AGENTS.md`, create ADRs, or add additional planning files without authorization.
- Do not force microservices or a specific stack solely because the domain is fintech.

## Files that may be modified

- `docs/architecture.md`
- `docs/delivery.md`

## Observable pass criteria

- Only the authorized files are created or edited.
- Architecture and milestones explicitly reduce financial and integration risks.
- Exit criteria are demonstrable and contain no invented schedule.
- Complexity remains justified independently from assurance rigor.

