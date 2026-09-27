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
- Any rollout guidance is feature-scoped and risk-driven.
- No global planning or repository modification occurs.

