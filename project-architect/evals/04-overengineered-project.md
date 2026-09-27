# Eval 04 — Suspected overengineering

## Exact prompt

> Usa `$project-architect` para revisar si este proyecto está sobrearquitecturado. Quiero evidencia y opciones de simplificación, no cambios en el código.

## Fixture or available context

- Internal CRUD service maintained by two developers.
- One runtime process contains controllers, commands, queries, domain events, repositories, repository adapters, factories, and an internal message bus.
- Every abstraction currently has one implementation.
- Releases require synchronized changes across most layers.
- No incident, measured load, or external consumer currently establishes a need for distribution.
- Some ports isolate a volatile third-party provider and improve tests.

## Expected mode

- Route: `REVIEW`.
- Mode: `ADVISE`.

## Allowed actions

- Inspect relevant code, history, tests, and decisions.
- Identify complexity costs and counterevidence.
- Recommend incremental simplification with migration risks.

## Required behaviors

- Justify every overengineering conclusion with project-specific cost or lack of driver.
- Preserve abstractions that have demonstrated boundary or volatility value.
- Separate observation, assessment, and confidence.
- Offer a smallest safe simplification before any broad redesign.

## Prohibited behaviors

- Do not call every single-implementation interface useless.
- Do not assume CQRS, events, factories, or ports are automatically wrong.
- Do not modify files or recommend a rewrite merely to match another pattern.
- Do not claim runtime or organizational facts absent from the fixture or repository.

## Files that may be modified

- None.

## Observable pass criteria

- The analysis contains both evidence for simplification and justified elements to preserve.
- Findings state concrete costs such as change coupling, duplication, cognitive load, or operational burden.
- Recommendations are reversible or staged and discuss migration trade-offs.
- No pattern is rejected by name alone.

