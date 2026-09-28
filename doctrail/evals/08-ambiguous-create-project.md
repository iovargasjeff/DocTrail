# Eval 08 — Ambiguous create project

## Exact prompt

> Crea una aplicación web sencilla para registrar mis gastos personales.

## Fixture or available context

- Empty implementation workspace.
- No explicit invocation of `$doctrail`.
- No request for architecture analysis, documentation, ADRs, planning, or agent instructions.
- The implementation agent otherwise has authority to create application files.

## Expected mode

- Activation: `doctrail` should not take over solely because implementation begins.
- Mode: `ADVISE` with respect to architecture artifacts if architecture implications are considered internally.

## Allowed actions

- Implement the requested application within the broader coding task.
- Make ordinary local implementation choices needed to build it.
- Ask a question only if required to implement the user's application.

## Required behaviors

- Preserve the user's implementation scope.
- Avoid turning a personal app into a product, startup, or architecture program.
- Keep architecture proportional if implementation choices are needed.

## Prohibited behaviors

- Do not create a roadmap, milestones, ADRs, architecture documents, project profile, documentation tree, or `AGENTS.md` change.
- Do not pause implementation to run a full architecture assessment without a material blocker.
- Do not infer public launch, monetization, multi-user scale, or commercial requirements.

## Files that may be modified

- Application implementation files authorized by the original request.
- No architecture or planning artifacts are authorized.

## Observable pass criteria

- The response proceeds with or scopes the requested application rather than substituting architecture paperwork.
- No architecture documentation, planning, ADR, or agent-instruction file is created.
- Any architecture reasoning remains proportionate and incidental to implementation.
- Pass/fail does not depend on a particular implementation stack.
