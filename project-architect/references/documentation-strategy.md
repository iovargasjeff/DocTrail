# Proportional documentation strategy

Use this reference when deciding what architecture knowledge should be durable, organizing multiple documents, separating global and feature documentation, resolving documentation drift, or integrating documentation rules into `AGENTS.md`.

## Start with purpose, not a folder tree

Create a document only when it has a present consumer and a durable job. Useful jobs include:

- orienting contributors to system context and boundaries;
- preserving accepted constraints or decisions;
- explaining a complex domain, integration, runtime flow, or deployment model;
- defining quality, security, recovery, or release expectations;
- sequencing durable delivery direction when planning was requested;
- making a risky change reviewable and maintainable.

Do not create files or directories only because a template contains them. Prefer a clear section in an existing document until navigation, ownership, change cadence, or size justifies separation.

In `ADVISE`, recommend the smallest useful artifact set. In `MATERIALIZE`, create or edit only artifacts the user authorized.

## Select depth independently

`Lean`, `Standard`, and `Rigorous` are decision criteria, not fixed bundles.

### Lean

Use a small number of concise documents when the system, team, and operational risk are limited. Combine context, architecture, relevant decisions, and near-term direction where that remains navigable. Add an index only if readers need one to find multiple artifacts.

### Standard

Separate documents when distinct audiences or change cadences make that useful. Common candidates are system context, architecture, data and integrations, significant ADRs, quality strategy, and requested delivery direction. Include only the candidates that solve a real navigation or maintenance problem.

### Rigorous

Increase evidence and precision for consequential risk. Possible additions include a threat model, data classification, quality scenarios, recovery design, runtime and deployment views, SLOs, compliance mapping, runbooks, and release or rollback criteria. Rigor does not require one file per topic or a large directory tree.

Documentation depth follows uncertainty, consequence, coordination, lifespan, and handoff needs. Architecture depth, assurance, and planning remain independent profiles.

## Choose the artifact by the question

| Question to preserve | Useful artifact | Avoid |
|---|---|---|
| Why does this project exist and for whom? | Project profile or context/vision section | Startup assumptions for personal tools |
| How is the system shaped and bounded? | Architecture document; selective C4 views | Diagram sets with no current reader |
| Why was a consequential option selected? | ADR | ADRs for local or trivial choices |
| How does one complex capability work? | Feature design or focused runtime flow | A feature folder for every CRUD |
| What quality or operational evidence is required? | Quality strategy, threat model, runbook, or release criteria | Generic checklists detached from risk |
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

Follow the repository's established language, names, and locations. When no convention exists, organize by concepts such as context, functional knowledge, architecture, delivery direction, and quality/operations, but materialize only populated areas.

Create a documentation index when there are enough documents, locations, or audiences that discovery is no longer obvious. The index should state what each linked artifact is for and, where helpful, whether it represents current state, accepted target state, a proposal, or history.

Do not:

- create empty taxonomy folders;
- link future files as though they exist;
- maintain a second index that competes with an established documentation portal;
- duplicate an external roadmap, issue tracker, or knowledge base locally;
- invent owners, review dates, or document status.

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

If no applicable `AGENTS.md` exists:

- in `ADVISE`, propose a short block only when future agent behavior would benefit;
- in `MATERIALIZE`, create one only when the user specifically authorizes agent instructions or accepts it in the artifact set.

If one exists:

1. read every applicable parent and nested `AGENTS.md` before editing;
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
- `AGENTS.md` changes are separately authorized and conservative;
- no empty sections or folders remain solely to mirror a template.

