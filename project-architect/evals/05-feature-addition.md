# Eval 05 — Feature addition

## Exact prompt

> Usa `$project-architect` para decidir cómo agregar devoluciones y reembolsos a este sistema de pedidos. Analiza dónde encaja la capability y los cambios arquitectónicos necesarios. No escribas archivos todavía.

## Fixture or available context

- Existing modular monolith with `orders`, `payments`, and `inventory` modules.
- Accepted ADRs define module ownership and synchronous transaction boundaries.
- Payment refunds use an external provider and may complete asynchronously.
- Existing worker and outbox mechanisms are available.
- User asks for architectural integration, not a project roadmap.

## Expected mode

- Route: `FEATURE`.
- Mode: `ADVISE`.

## Allowed actions

- Inspect existing boundaries, decisions, contracts, and mechanisms.
- Recommend ownership, interactions, data changes, failure handling, and tests.
- Propose a focused rollout or decision gate only if risk justifies it.

## Required behaviors

- Before recommending placement, inspect the relevant existing feature paths, accepted decisions/specs, and tests when repository files are available; cite the evidence and keep the search scoped to refunds and adjacent order/payment flows.
- Distinguish implementation evidence from the fixture's documented context. If only the fixture is available, state that the current code was not verified.
- Keep the requested refund capability distinct from adjacent recommendations; do not add those recommendations to accepted scope or create artifacts for them in this advice-only scenario.
- Fit the capability into existing architecture before proposing a new subsystem.
- Reuse suitable worker or outbox mechanisms when evidence supports them.
- Address idempotency, provider failure, order/payment consistency, and audit needs.
- Identify any decision that would warrant an ADR without writing one.

## Prohibited behaviors

- Do not create a new microservice merely because refunds are asynchronous.
- Do not create a global roadmap, milestones, files, or implementation changes.
- Do not contradict accepted ADRs silently.
- Do not assume the external provider's current behavior without evidence.

## Files that may be modified

- None.

## Observable pass criteria

- The recommendation names an existing or justified new owner for the capability.
- Interactions and failure semantics are compatible with existing mechanisms.
- If a materialization were authorized later, identify the affected RF/RNF, story/use case where useful, and verification links without duplicating their canonical definitions.
- Any rollout guidance is feature-scoped and risk-driven.
- No global planning or repository modification occurs.

