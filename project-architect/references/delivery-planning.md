# Proportional technical delivery planning

Use this reference only when planning is requested, when its value must be assessed, or when the user wants ideas preserved and sequenced. It defines durable technical direction, not live project management.

## Establish planning intent

Use one of these states internally:

| Intent | Meaning | Behavior |
|---|---|---|
| `not-assessed` | Planning is outside the request. | Omit planning and do not persist a planning profile. |
| `declined` | The user explicitly does not want planning. | Respect the choice; explain only critical consequences. |
| `not-needed` | Planning was considered and adds no current value. | Do not create or keep proposing a roadmap. |
| `requested` | The user asks for ordering, phases, roadmap, gates, or milestones. | Select the smallest fitting representation. |
| `recommended` | Sequencing, coordination, or risk reduction would materially benefit. | Recommend it in `ADVISE`; do not materialize automatically. |

An explicit decline wins over a recommendation. Rejecting a roadmap or milestones does not lower security, testing, compliance, recovery, or other necessary assurance.

Do not create planning for a focused decision, a disposable experiment, a few obvious next actions, or implementation work whose execution system already provides the needed ordering.

## Pick the representation, then the depth

Roadmaps and milestones are independent choices. Adapt to the user's delivery method without imposing Scrum, Kanban, Shape Up, or another methodology.

| Need | Suitable representation |
|---|---|
| A few immediate actions | Next steps |
| Coarse ordered evolution | Phases |
| Flexible priority horizons | Now / Next / Later |
| Dependencies among user-visible abilities | Capability sequence |
| Demonstrable outcomes or coordination boundaries | Outcome milestones |
| Safety, readiness, migration, or regulatory decisions | Release or decision gates |

Combine forms only when each solves a distinct problem. A roadmap can use phases with no milestones. A Kanban team can use Now/Next/Later. A continuous-delivery project may use capability sequence and release gates without fixed releases.

### None

No durable plan. Appropriate when planning was declined, assessed as unnecessary, or the work is too small or temporary.

### Lean

Use one short document or an existing section. Capture the selected format, key dependencies, major uncertainties, and immediate decision points. Separate milestone or future-capability files only if the content no longer remains navigable.

### Standard

Describe outcomes or capabilities with exit criteria, dependencies, risks, required architectural runway, and decision gates. Keep the near horizon concrete and later horizons coarse.

### Rigorous

Increase evidence and control for consequential delivery: readiness criteria, security or regulatory gates, migration and rollback strategy, external dependencies, acceptance evidence, and release constraints. Rigor changes proof and gates; it does not require more milestones or a larger backlog.

## Choose a scope policy

Clarify or infer the policy from the user's request:

- `recommend`: propose what to commit now and what to retain for later;
- `include-all`: include every feasible user-required idea, sequence it by phases, and surface conflicts and costs;
- `preserve-only`: record ideas and rationale without adding them to committed delivery.

Do not use `recommend` to silently delete ideas. Do not use `include-all` to pretend incompatible ideas coexist or to hide impracticality. Explain why an idea is costly, premature, risky, or poorly aligned; if the informed user still requires a viable idea, plan within that choice.

## Sequence for learning and risk

Order accepted work using the factors that actually constrain it:

1. hard dependencies and external contracts;
2. irreversible or high-consequence decisions;
3. feasibility spikes and uncertain assumptions;
4. security, data, migration, and operational risks;
5. the shortest path to demonstrable user value;
6. integration feedback and learning;
7. architectural runway needed just before dependent capability work.

Avoid detailed ordering in distant horizons when dependencies may change. Record assumptions and decision gates instead of false precision.

### Walking skeleton

Prefer a thin end-to-end path when it can validate the system's riskiest integration or core user outcome earlier. A useful walking skeleton crosses the necessary layers, uses realistic contracts, is demonstrable, and leaves room to harden or expand; it is not a throwaway collection of mocks presented as production completion.

Do not force it when another order reduces risk better:

- backend or contract first may fit public APIs, migrations, transactional invariants, shared platform services, or external consumers;
- UI first may fit interaction-heavy products where usability is the main uncertainty;
- infrastructure or security groundwork may precede a slice when no safe path exists without it;
- a technical spike may precede all delivery when feasibility is unknown.

State why the chosen sequence is better for this project.

## Define outcome milestones only when useful

A milestone is an optional demonstrable result, not a percentage of components completed. When used, include only relevant fields:

```text
Outcome
Why now
In scope
Out of scope
Prerequisites
Architecture implications
Exit criteria
Risks and open decisions
```

Exit criteria should be observable and proportional: a working user flow, a verified contract, migration rehearsal, recovery evidence, security approval, or another meaningful outcome. Do not invent dates, owners, estimates, or evidence.

Milestones are useful for cross-team coordination, external dependencies, costly releases, explicit learning checkpoints, or readiness gates. They are often unnecessary for continuous small changes or when the user prefers another representation.

## Preserve future capabilities without committing them

Use durable idea states consistently:

| State | Meaning |
|---|---|
| `COMMITTED` | Accepted into the current durable delivery direction. |
| `RECOMMENDED` | Advised for consideration but not yet committed. |
| `FUTURE` | Preserved as a possible later capability. |
| `DECISION NEEDED` | Conflicts, uncertainty, or consequences require a choice. |
| `NOT RECOMMENDED` | Preserved with the reason it is not advised. |
| `PROMOTED` | Previously future or recommended, now linked to an accepted phase or milestone. |
| `SUPERSEDED` | Replaced by another idea or decision, with history retained. |

These are durable intent states. Do not add `IN PROGRESS`, percent complete, assignees, sprint state, or other live execution fields.

For each nontrivial future idea, preserve enough to make it useful:

```text
Capability
State
User value or purpose
Why now / why later / why not recommended
Dependencies or conflicts
Conditions for promotion or reconsideration
Related phase, milestone, feature, or ADR
```

When an idea is promoted, link the accepted phase or milestone and retain its origin. When superseded, link the replacement. Never relabel `FUTURE` as committed merely because it appears in the same file as the roadmap.

Keep a small number of future ideas in a roadmap section. Create `future-capabilities.md` only when volume, distinct audiences, or differing change cadence makes a separate file easier to maintain. Do not create one file per idea unless its complexity independently justifies feature documentation.

## Separate durable direction from live execution

The delivery plan may contain outcomes, order, dependencies, risk, architectural runway, gates, exit criteria, and future capabilities. Issues, owners, dates, estimates, percentages, board columns, and live priority belong in GitHub, Linear, Notion, or the user's execution system.

If an external roadmap already exists, do not copy it. Link to it when useful and keep only architecture-relevant direction or decisions that need repository durability. A future organizer skill or project tool may turn the direction into live work; this skill does not maintain that state.

## Planning output contract

In `ADVISE`, provide:

```text
Planning intent
Recommended representation and why
Scope policy
Proposed sequence and rationale
Key dependencies, risks, and decision gates
Milestones: none or the minimal useful set
Future-idea handling
What belongs in the execution system
```

In `MATERIALIZE`, use the delivery plan template selectively. Split files only when justified, preserve repository conventions, and write no invented status. Before finishing, verify that milestones remain optional, future ideas are visibly noncommitted, near work is more detailed than distant work, and every gate or exit criterion is observable.

