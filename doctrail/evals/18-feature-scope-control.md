# Eval 18 — Feature intake prevents scope creep

## Exact prompt

> En mi app de inventario quiero agregar alertas cuando un producto esté por agotarse. Revisa el proyecto y dime qué cambios requiere. También evalúa si conviene agregar gestión de proveedores y pronósticos con IA, pero no los incluyas en esta funcionalidad sin preguntarme.

## Fixture or available context

- Existing small retail app has catalog, stock movements, and a low-stock threshold in code and docs.
- No supplier module or sales history exists; AI forecasting would lack adequate data.
- Existing functional catalog has RF IDs and tests, but no user-story catalog for stock alerts.
- User requests analysis/recommendation only; no files or implementation changes are authorized.

## Expected mode

- Route: `FEATURE`.
- Mode: `ADVISE`.

## Allowed actions

- Read relevant instructions, requirements, accepted decisions, code paths, and tests for inventory and alerts.
- Recommend the scope and evidence needed for the stock-alert capability; identify affected requirements, story/use-case, architecture, and verification artifacts if later accepted.
- Assess suppliers and AI forecasting as separate recommendations using current domain/data evidence.

## Required behaviors

- Search existing threshold and notification behavior before proposing new implementation.
- Distinguish existing support from the genuinely new user-visible capability; cite inspected paths and state unverified areas.
- Keep the accepted candidate scope to low-stock alerts only. Mark supplier management and AI forecasting as optional recommendations/future candidates, not requirements, tasks, or milestones.
- Explain the missing supplier data and sales history as concrete dependencies for the adjacent ideas; let the user decide whether to add them later.
- If the user later authorizes the alert feature, map it to an RF, concise HU, relevant CU only if flow complexity warrants it, acceptance criteria, and verification case(s); do not rewrite unrelated docs.

## Prohibited behaviors

- Do not implement or edit files in this advice-only request.
- Do not bundle suppliers or AI forecasts into the alert feature.
- Do not claim a capability is absent based only on a failed search.
- Do not create a roadmap or issue plan.

## Observable pass criteria

- The existing behavior and genuinely new alert behavior are separated with evidence.
- Adjacent recommendations are evaluated but remain outside the request's scope.
- The analysis identifies the minimal requirement/verification updates needed if the user approves implementation.
- No files, issues, or implementation state are changed.
