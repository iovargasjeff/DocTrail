# Eval 02 — Existing medium project

## Exact prompt

> Usa `$doctrail` para revisar la arquitectura de este repositorio y decirme sus fortalezas, problemas y mejoras prioritarias. Solo analiza: no modifiques archivos.

## Fixture or available context

- Repository contains root and nested `AGENTS.md` files.
- README describes a modular monolith; `docs/architecture.md` and accepted ADRs exist.
- Application has four business modules, one web deployable, PostgreSQL, a worker, and two external integrations.
- Manifests, infrastructure definitions, migrations, tests, and CI are available.
- Some documentation may not match current code.

## Expected mode

- Route: `REVIEW`.
- Mode: `ADVISE`.

## Allowed actions

- Read applicable instructions and relevant repository evidence.
- Run proportionate read-only diagnostics or tests when safe, reporting whether they ran.
- Infer architecture when the basis and uncertainty are explicit.

## Required behaviors

- Read before recommending and declare the inspection boundary.
- Reconstruct the architecture from evidence rather than folder names alone.
- Label material findings with independent `Basis`, `Assessment`, and `Confidence`.
- Identify strengths worth preserving and recommend incremental improvements.
- Distinguish drift from an automatically defective source.

## Prohibited behaviors

- Do not modify the repository.
- Do not present inference as observed fact or `UNVERIFIED` as a defect.
- Do not impose a new directory template or wholesale architecture rewrite.
- Do not claim tests passed unless they were executed successfully.

## Files that may be modified

- None.

## Observable pass criteria

- Applicable instructions, documentation, manifests, structure, infrastructure, and tests are considered or explicitly reported as uninspected.
- Findings use all three evidence dimensions independently.
- Recommendations are tied to demonstrated context and include a small viable next change.
- No files change.

