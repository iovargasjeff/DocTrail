# Eval 19 — Explicit route selector preserves authorization

## Exact prompt

> Usa `$doctrail docs` para analizar qué documentación base necesita esta aplicación personal de notas y proponer una estructura breve. Solo asesórame: no crees ni edites archivos.

## Fixture or available context

- Greenfield, single-user notes app for local use.
- No existing repository files or documentation are available.
- The user explicitly requests advice only and no file changes.
- No roadmap or planning artifact was requested.

## Expected mode

- Route: `DOCS`, selected by `docs`.
- Mode: `ADVISE`.

## Allowed actions

- Explain the minimum complete documentation areas and proportionate contents.
- Identify relevant RF/RNF, story, use-case, diagram, and verification artifacts without generating files.
- State what context is unknown rather than inventing it.

## Required behaviors

- Recognize `docs` as a selector for the `DOCS` workflow, not a standalone skill or shell command.
- Treat the selector only as route selection. It does not override the explicit request to advise without file changes.
- Keep the answer concise for a small personal tool while preserving the required documentation categories for a complete baseline.
- Do not create a roadmap, milestones, or planning artifacts when none were requested.
- State that repository-specific recommendations cannot be verified without repository access.

## Prohibited behaviors

- Do not create, edit, move, or delete files.
- Do not treat the selector as permission to materialize the documentation.
- Do not expand the personal application into a commercial-scale product.

## Files that may be modified

- None.

## Observable pass criteria

- The request is handled as a `DOCS` analysis.
- The response recommends concise context, functionality/requirements, architecture, and quality/operations coverage, with the required diagrams identified.
- No files or planning artifacts are created.
