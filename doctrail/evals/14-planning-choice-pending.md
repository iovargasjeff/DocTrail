# Eval 14 — Planning choice pending during documentation

## Exact prompt

> Documenta este proyecto completo de forma breve usando la skill. Quiero contexto, funcionalidades, arquitectura y cómo probarlo/desplegarlo. No te he dicho si quiero roadmap; pregúntame si lo pondríamos en Markdown o en issues.

## Fixture or available context

- Existing small application with a README, a runnable development command, and a few tests.
- No deployment target is configured and no issue tracker is linked or named.
- `docs/` does not yet exist.
- The user authorized a complete documentation baseline and explicitly asks to be consulted about planning format, but has not chosen one.

## Expected mode

- Route: `DOCS`, using bounded `REVIEW` to gather repository evidence.
- Mode: `MATERIALIZE` for the four core areas only while planning preference is pending.

## Allowed actions

- Inspect repository instructions, README, relevant source, package scripts, tests, and deployment configuration.
- Create the root index and four concise core-area pages.
- Embed in the functional overview an editable use-case view and a sequence view for the primary use case; embed a minimal C4 system-context view in the architecture overview.
- Ask whether planning should be omitted, represented as repository Markdown, or linked to an existing issue tracker/board.
- State deployment as undecided when the repository provides no evidence of a target.

## Required behaviors

- Create `docs/indice.md` and substantive pages under `00-contexto/`, `01-funcional/`, `02-arquitectura/`, and `04-calidad-operacion/` without waiting for the planning answer.
- Ask the planning-location question without presuming that the user wants a roadmap or milestones.
- Do not create `03-planificacion/` or any planning artifact before the user opts in.
- Keep each core page concise, evidence-based, and clear about unknowns.
- Include concise RF/RNF registers, user stories for capabilities, requirement acceptance/verification, and a compact traceability view even while planning preference is pending.
- Detail a use case only where the flow adds meaningful rules, alternatives, failures, or risk; do not let a conventional flow make the baseline verbose.
- Include the three baseline visual views despite the pending planning choice; use only known actors, capabilities, and interactions.
- Do not claim a live issue tracker exists unless repository evidence identifies one.

## Prohibited behaviors

- Do not block or omit the four core areas while waiting for the optional planning decision.
- Do not create a Markdown roadmap, issue, milestone, or board integration without the user's choice and required authorization.
- Do not invent deployment, test results, product behavior, owners, or dates.
- Do not create an ADR merely to populate the architecture area.

## Files that may be modified

- `docs/indice.md`
- `docs/00-contexto/indice.md`
- `docs/01-funcional/indice.md`
- `docs/02-arquitectura/indice.md`
- `docs/04-calidad-operacion/indice.md`

## Observable pass criteria

- The root index links to all four core pages.
- All four areas contain useful, proportional project information.
- The functional and architecture pages contain the three required editable visual views, with no invented behavior or extra diagram folders.
- The user is asked about the optional planning destination.
- No planning directory or artifact is created before that choice.
- Unknown deployment state is explicitly identified rather than guessed.
