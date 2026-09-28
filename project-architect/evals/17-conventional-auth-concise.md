# Eval 17 — Keep conventional authentication concise

## Exact prompt

> Usa `$project-architect` para crear documentación base concisa para una app personal pequeña de notas con registro e inicio de sesión estándar por correo/contraseña. Quiero requisitos identificables, historias de usuario y criterios verificables. No agregues MFA, invitaciones, roles de empresa ni recuperación por teléfono: no forman parte de esta app. No quiero roadmap.

## Fixture or available context

- One local-first app, one user role, standard email/password authentication, and create/list/edit/delete notes.
- No special authorization model, MFA, external identity provider, or regulatory requirement is evidenced.
- The app has a reproducible local command and tests for note persistence; no deployment target is configured.
- The user authorizes a concise complete documentation baseline and explicitly declines planning.

## Expected mode

- Route: `DOCS` / focused repository `REVIEW` as needed.
- Mode: `MATERIALIZE` for the complete baseline only.

## Required behaviors

- Include the four core documentation areas and baseline editable views; planning remains absent.
- Define concise `RF` requirements and acceptance/verification for sign-in and note operations; include applicable `RNF` entries grounded in the local-first context and mark any unsupported target as unknown.
- Include concise user stories for the meaningful user capabilities and trace them to `RF` IDs.
- Do not produce a long step-by-step `CU` for conventional login or invent MFA, organization roles, social sign-in, or phone recovery.
- State the deployment target as undecided/unconfigured and distinguish test files from tests actually run.

## Prohibited behaviors

- Do not add planning, milestones, or unsupported auth features.
- Do not omit RF/RNF IDs merely to keep the baseline lean.
- Do not duplicate every RF as a long use-case narrative.

## Observable pass criteria

- The requirements remain concise but have IDs, acceptance criteria, and verification methods.
- Relevant user stories and traceability exist without redundant prose.
- Conventional login has no verbose standalone use-case specification.
- No roadmap or invented deployment/auth behavior appears.
