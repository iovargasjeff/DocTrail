# Proportional documentation strategy

Use this reference when deciding what architecture knowledge should be durable, organizing multiple documents, separating global and feature documentation, resolving documentation drift, or integrating documentation rules into `AGENTS.md`.

For the mandatory requirement, story, use-case, and traceability content of a complete baseline, also read [requirements-engineering.md](requirements-engineering.md).

## Keep a stable minimum and scale its contents

Treat requests such as “document the project” or “create its documentation baseline” as complete documentation requests unless the user names a narrower artifact set or repository instructions require another structure. For a complete request, use this default base regardless of project size:

```text
docs/
  indice.md
  00-contexto/indice.md
  01-funcional/indice.md
  02-arquitectura/indice.md
  04-calidad-operacion/indice.md
  03-planificacion/indice.md  # optional; only when the user wants a plan or local tracker pointer
```

The four core areas are a stable navigation baseline, not a demand for a large document set. Each page must contain concise, evidence-based project information; do not generate empty folders, generic placeholders, or unsupported claims. The depth profile determines how much detail belongs inside or alongside these pages. A complete baseline always includes concise functional and non-functional requirement registers, even for a small project; lean depth does not mean architecture-only documentation.

For every complete software-documentation baseline, embed three editable visual views in the relevant core pages: a C4 system-context view in `02-arquitectura/indice.md`, a use-case view and a primary-use-case sequence diagram in `01-funcional/indice.md`. This is a minimum content contract, not a requirement to create extra diagram files or folders. Use repository-supported syntax, distinguish observed/current from accepted target or proposed views, and explain any genuinely inapplicable view instead of silently omitting it. Never invent unknown behavior to complete a diagram.

Use this baseline for complete documentation materialization, not for a focused request naming only one or two files, an analysis-only task, or a user who declined documentation. In an existing repository, keep the four areas as the default: map or link current material into them without duplicating it, and do not move or rename existing documents unless that reorganization is authorized. Follow a different structure only when the user or repository instructions explicitly require it; do not silently omit the baseline merely because existing documents are flat or inconsistently organized.

Create a document only when it has a present consumer and a durable job. Useful jobs include:

- orienting contributors to system context and boundaries;
- preserving accepted constraints or decisions;
- explaining a complex domain, integration, runtime flow, or deployment model;
- defining quality, security, recovery, or release expectations;
- sequencing durable delivery direction when planning was requested;
- making a risky change reviewable and maintainable.

In `ADVISE`, recommend the smallest useful artifact set. In `MATERIALIZE`, create or edit only artifacts the user authorized.

## Select depth independently

`Lean`, `Standard`, and `Rigorous` are decision criteria, not fixed bundles.

### Lean

Keep the four core area pages and root index brief. Avoid extra documents unless a real need appears. A small project still records what it is, what it does, how it is structured, and how it is verified/run or where it is deployed; mark unknowns instead of inventing details.

### Standard

Separate documents when distinct audiences or change cadences make that useful. Common candidates are system context, architecture, data and integrations, significant ADRs, quality strategy, and requested delivery direction. Include only the candidates that solve a real navigation or maintenance problem.

### Rigorous

Increase evidence and precision for consequential risk. Possible additions include a threat model, data classification, quality scenarios, recovery design, runtime and deployment views, SLOs, compliance mapping, runbooks, and release or rollback criteria. Rigor does not require one file per topic or a large directory tree.

Documentation depth follows uncertainty, consequence, coordination, lifespan, and handoff needs. Architecture depth, assurance, and planning remain independent profiles.

## Grow the folder tree only when the content grows

Keep the four top-level areas stable. At the lean baseline, keep each area's overview and its required visual views together in `indice.md`; do not create a `diagramas/` folder for one diagram.

When an area gains multiple documents with different purposes, audiences, or change cadence, subdivide it around the subject rather than around file type alone. Useful patterns include:

- `01-funcional/<capacidad>/` for related use cases, rules, and flow diagrams;
- `02-arquitectura/vistas/` for multiple C4/runtime/deployment views, while keeping significant decisions in `02-arquitectura/adr/`;
- `04-calidad-operacion/<servicio-o-entorno>/` for deployment, verification, recovery, or runbook material that has its own operational audience.

Keep the parent `indice.md` as the navigation map, add child indexes when a group needs its own navigation, keep nesting shallow, and do not create empty subfolders. Do not split only because the product is “large”; split when the current page becomes hard to navigate or content has an independent consumer or maintenance cycle.

## Choose the artifact by the question

| Question to preserve | Useful artifact | Avoid |
|---|---|---|
| Why does this project exist and for whom? | Project profile or context/vision section | Startup assumptions for personal tools |
| What does the product do and how will completion be checked? | Concise, identified functional requirements, user stories, relevant use cases, and acceptance/verification links | Repeating one behavior in several documents or writing long prose for conventional behavior |
| What quality does the project require? | Applicable, verifiable non-functional requirements and explicit unknowns | Treating implementation preferences as measurable quality targets or inventing numbers |
| How is the system shaped and bounded? | Required architecture overview with a minimal C4 context view; additional architecture details and C4 views as warranted | Detailed diagrams with no current reader |
| Why was a consequential option selected? | ADR | ADRs for local or trivial choices |
| How does one complex capability work? | Feature design or focused runtime flow | A feature folder for every CRUD |
| What quality or operational evidence is required? | Quality strategy, threat model, runbook, or release criteria | Generic checklists detached from risk |
| Where and how is it run or deployed? | Quality/operations overview stating current target or that it is undecided | Claiming a planned host is already deployed |
| What durable sequence was accepted? | Delivery plan or roadmap | Live ticket state copied into Markdown |
| How should contributors navigate the set? | Documentation index | An index for one obvious document |
| What must agents consult before structural changes? | A short `AGENTS.md` rule linking existing docs | Copying the architecture into `AGENTS.md` |

Use the architecture, project-profile, ADR, index, and delivery-plan assets only when their purpose is present.

## Global versus feature documentation

Keep cross-cutting knowledge global: system context, shared boundaries, platform constraints, data ownership, deployment topology, organization-wide quality rules, and broadly applicable ADRs.

Use focused feature documentation when a capability has one or more of these characteristics:

- multiple important flows or state transitions;
- a new public or external contract;
- a complex integration, migration, security boundary, or failure model;
- substantial domain rules or independent risks;
- enough content to make the global architecture hard to navigate.

A possible feature set is `spec.md`, `design.md`, and a runtime or sequence view, but create only what the feature requires. Do not create a feature directory for routine CRUD or restate global rules in every feature.

Link rather than duplicate. A feature document should point to applicable global constraints and ADRs; a global architecture document may list the feature as a specialization.

## Structure and navigation

Use the core areas above and follow the documentation language. For Spanish documentation, use the exact names shown; in another language, translate the labels consistently unless the user or repository has an established naming convention. The root `indice.md` links to the four core pages and states what each represents. Each core page may be a concise overview with links; it need not contain a full specification.

The core pages cover:

- `00-contexto`: purpose, audience/users, problem, scope, and important constraints or unknowns.
- `01-funcional`: source capability disposition, `RF` and `RNF` requirement registers, `RN` rules where present, concise `HU` stories per user-facing capability, relevant detailed `CU` cases, domain terms/model, and an editable sequence view of the primary flow.
- `02-arquitectura`: current versus accepted target architecture, a C4 system-context view, boundaries, stack, important data/integration choices, and links to ADRs.
- `04-calidad-operacion`: verification strategy and test cases linked to requirements, how to run the project, and current deployment/hosting choice or explicit unknown; add security, backup, recovery, monitoring, or release detail in proportion to risk.

Keep one canonical home for each requirement and link to it elsewhere. Every in-scope `RF` and `RNF` has acceptance criteria and a verification method; every source capability is either mapped to requirements or explicitly classified. A user story and a use case are not mandatory duplicates: summarize the user intent in a story and detail a use case when its flow, alternatives, or risk adds information. For a conventional login, a concise requirement and acceptance criteria may be enough. See [requirements-engineering.md](requirements-engineering.md) for identifiers, traceability, and completeness rules.

Planning is independent of these four areas and must not block their materialization. For a complete documentation request with no known preference, ask whether the user wants no plan, repository Markdown, or an existing issue tracker/board. Proceed with the four core areas while that choice is pending; create no planning artifact until the user opts in. If planning is wanted but the source of truth is unclear, ask before creating it. Create `03-planificacion/` only for a local plan or a useful local index pointing to the chosen external source. If the user declines planning, do not create the folder. Never require milestones.

Keep links limited to pages created or confirmed to exist; identify current implementation, accepted target, proposal, and history where it matters.

Do not:

- add empty subfolders or non-core categories solely to mirror a template;
- link future files as though they exist;
- maintain a second index that competes with an established documentation portal;
- duplicate an external roadmap, issue tracker, or knowledge base locally;
- invent owners, review dates, or document status.

The baseline area's concise overview is not an empty taxonomy placeholder; it must state known project information and explicit unknowns where relevant. When a category genuinely has no applicable content, state that and why rather than omitting the category or inventing an item to fill it.

If an external system is authoritative, retain only durable local context and useful links that the repository can maintain.

## Durable knowledge versus execution state

Use this separation:

```text
Documentation = durable intent, accepted design, rationale, and delivery direction
Code          = current implementation
Tests / CI    = executable evidence, which can also be incomplete or stale
Issue system  = assignments, dates, progress, priorities, and live execution state
```

Avoid copying issue status, percent complete, sprint membership, or volatile dates into architecture documentation. A delivery document may define outcomes, dependencies, gates, and exit criteria without becoming a board.

## Investigate drift instead of choosing a winner

When documentation, code, tests, or operational evidence disagree:

1. identify the exact conflicting claims and their scope;
2. check status, timestamps, accepted decisions, and relevant repository history;
3. inspect executable or runtime evidence when available;
4. determine whether the difference is intended evolution, incomplete implementation, stale documentation, or an unresolved decision;
5. report confidence and what remains unverified;
6. propose the smallest synchronized correction;
7. modify sources only within authorized scope.

Documentation is not automatically correct because it states intent. Code is not automatically correct because it runs. Tests do not prove requirements they do not cover.

## Maintain proportionality over time

Update durable documentation when an accepted change alters its claims. Prefer focused edits and links over copying the same explanation across files. Supersede ADRs rather than rewriting accepted history.

Recommend consolidation when documents have overlapping purposes or conflicting ownership. Recommend archival or deletion only after confirming that the content is obsolete, superseded, and no longer a required historical record. Any destructive change still requires user authorization.

Use review triggers tied to change, such as a new trust boundary, deployment unit, external contract, ownership boundary, or risk profile. Do not invent periodic review ceremonies unless the project's governance requires them.

## Integrate with `AGENTS.md` conservatively

`AGENTS.md` can direct future agents to relevant documentation; it cannot guarantee compliance.

If no applicable agent-instructions file exists:

- in `ADVISE`, propose a short block only when future agent behavior would benefit;
- in `MATERIALIZE`, if no suitable instructions file exists, continue with the documentation set and ask before creating one.

If an applicable instructions file exists and the documentation's stated audience includes future coding agents/AI, a concise pointer to `docs/indice.md` is part of the accepted documentation artifact set. That audience request authorizes the pointer only. If agent consumption was not requested, obtain authorization before adding it. In either case:

1. read every applicable parent and nested instruction file before editing;
2. preserve its hierarchy, tone, and unrelated instructions;
3. integrate a short section instead of replacing the file;
4. avoid duplicating an equivalent rule;
5. link only paths verified to exist;
6. mention ADR search only when ADRs or an accepted ADR location exist;
7. keep architecture content in its own documents, not in `AGENTS.md`.

Adapt [the reusable rules block](../assets/agents-documentation-rules.md) to the repository rather than inserting it blindly.

## Materialization check

Before writing documentation, confirm:

- each artifact has a current purpose and audience;
- its claims are identified as observed current state, accepted target, proposal, or history;
- the chosen depth matches risk and coordination needs;
- links and paths exist;
- content does not duplicate operational state or another authoritative system;
- feature and global knowledge are placed at the appropriate level;
- `AGENTS.md` changes follow the audience rule above and remain conservative;
- no empty sections or folders remain solely to mirror a template.

