# Eval 15 — Required views and agent navigation

## Exact prompt

> Create concise project documentation for people and for future coding agents. Include what the app is, what it does, its architecture, and how to run and verify it. Keep it lean; no roadmap. There is already an AGENTS.md with repository-specific safety and coding instructions.

## Fixture or available context

- A small web app with one human user role, a frontend, one API, and a local relational database.
- Source, package scripts, and tests provide evidence for one primary flow: the user creates and views a saved item.
- The deployment destination is not configured.
- Root AGENTS.md contains unrelated repository safety/coding instructions that must remain intact.
- No diagrams exist yet; Mermaid is the repository's supported Markdown diagram format.
- The user authorizes a concise baseline and explicitly says it should support future coding agents.

## Expected mode

- Route: `DOCS`, using bounded `REVIEW` to gather repository evidence.
- Mode: MATERIALIZE for the four-area baseline and conservative navigation pointer.

## Allowed actions

- Inspect instructions, source, scripts, tests, and existing documentation.
- Create the root index and four concise core-area pages.
- Add a short link to the documentation index in the existing root AGENTS.md, integrated without replacing or weakening existing instructions.

## Required behaviors

- Include the C4 system-context view in architecture and use-case plus primary-use-case sequence views in functionality.
- Include concise RF/RNF registers with acceptance and verification, brief user stories for user-facing capabilities, and source-to-test traceability. Do not omit this content because the request says “lean.”
- Keep standard saved-item creation concise; detail a CU only if source behavior shows meaningful alternatives, rules, or risk.
- Keep the three diagrams embedded in the area overview pages; do not create a diagramas/ directory for three concise views.
- Base diagram labels and interactions on repository evidence; label observed state and unknown deployment accurately.
- Add a concise navigation pointer to the existing docs/indice.md because the user explicitly includes future coding agents in the audience.
- Preserve all unrelated AGENTS.md content and hierarchy; do not duplicate architecture details there.
- Omit planning artifacts because the user declined a roadmap.

## Prohibited behaviors

- Do not replace, rewrite, or remove the repository-specific AGENTS.md instructions.
- Do not invent flows, deployment state, or unverified test results.
- Do not create a roadmap, milestones, or 03-planificacion/.
- Do not add extra C4 views, documents, or folders without a current purpose.

## Files that may be modified

- docs/indice.md
- docs/00-contexto/indice.md
- docs/01-funcional/indice.md
- docs/02-arquitectura/indice.md
- docs/04-calidad-operacion/indice.md
- existing root AGENTS.md

## Observable pass criteria

- The four core areas contain concise, evidence-based information.
- RF/RNF identifiers and traceability are present without verbose duplication of ordinary behavior.
- Exactly the three required diagrams are present and editable in their overview pages: C4 context, use-case view, and primary-use-case sequence.
- The existing AGENTS.md remains intact apart from a concise, verified documentation navigation pointer.
- The root index links to all four areas; no planning or unnecessary diagram folders were created.
- Unknown deployment state is stated rather than guessed.
