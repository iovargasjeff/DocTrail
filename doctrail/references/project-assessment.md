# Project assessment

Use this reference for `NEW`, for a substantial `FEATURE`, or when a focused decision lacks the context needed to be reliable. Do not run a full questionnaire when one or two known constraints decide the answer.

## Outcome

Produce the smallest useful context model for architecture, technology, documentation, assurance, and optional planning. The assessment supports judgment; it is not a score and does not decide architecture mechanically.

## Assessment rules

1. Reuse facts already supplied by the user or repository.
2. Ask only questions whose answers could change the recommendation.
3. Distinguish known facts, assumptions, and unknowns.
4. Prefer ranges and load shapes over unsupported exact forecasts.
5. Evaluate current needs plus reasonably foreseeable constraints, not imagined scale.
6. Keep the four rigor profiles independent.
7. Omit planning when it is outside scope; use `none` only after it was considered and deliberately declined or found unnecessary.
8. Generate `project-profile.yaml` only in `MATERIALIZE` and only when a durable profile will help later work.

## Minimum dimensions

### Intent and use

Determine what success means before judging the idea.

- Purpose: personal, internal, educational, experimental, public, or commercial.
- Audience: one person, a small team, an organization, customers, or the public.
- Distribution: local, self-hosted, private cloud, or public cloud.
- Lifespan: disposable, short-lived, or long-term.
- Success criteria: observable outcomes that matter to this user.
- Scope policy: recommend, include-all, or preserve-only.

Do not apply startup expectations to a personal tool. A product with existing commercial alternatives may still be worthwhile for privacy, learning, offline use, custom workflow, ownership, or reduced dependency.

### Stage

| Stage | Meaning | Architectural implication |
|---|---|---|
| Prototype | Learn or prove feasibility | Optimize for learning; avoid durable infrastructure unless risk requires it. |
| MVP | Deliver minimum validated value | Keep scope narrow; assurance still follows risk. |
| Product | Repeated real use | Favor maintainability, operations, and explicit ownership. |
| Growth | Load, team, or capability expansion | Revisit measured bottlenecks and coordination boundaries. |
| Mature | Stability and change safety dominate | Preserve compatibility, observability, recovery, and migration discipline. |

Stage is not a risk score. A financial MVP may need rigorous assurance; a mature internal utility may remain architecturally lean.

### Team

- Number of contributors and expected parallel work.
- Experience with candidate technologies.
- Ownership model and maintenance responsibility.
- Bus factor and handoff expectations.
- Tolerance for operational burden.

Prefer technologies the team can operate unless a concrete requirement justifies a learning or hiring cost.

### Complexity

Assess the shape, not the file count:

- Domain rules and invariants.
- Data model, consistency, transactions, and migrations.
- External integrations and their volatility.
- Async processing, scheduled work, retries, and idempotency.
- Realtime collaboration or streaming.
- Deployment topology and environments.
- Multiple clients, tenants, regions, or trust boundaries.

Complexity in one dimension does not require complexity everywhere. Volatile integrations may justify ports without requiring strict hexagonal architecture across the whole codebase.

### Risk

Evaluate impact and likelihood qualitatively:

- Security and authorization.
- Privacy and sensitive data.
- Financial value or money movement.
- Regulatory or contractual obligations.
- Availability and recovery expectations.
- Irreversible operations.
- Data loss, duplication, and external side effects.

Risk primarily raises assurance. It may also require architectural boundaries or documentation, but it does not automatically require distribution.

### Scale and load shape

Avoid relying on user count alone. Ask what drives load:

- Peak requests and burstiness.
- Read/write mix.
- Data volume and retention.
- Background work volume.
- Payload sizes and media processing.
- Concurrent connections.
- Geographic latency and offline needs.

If reliable estimates do not exist, record assumptions and revisit triggers instead of inventing precision.

### Planning context

Assess planning only when requested or materially useful:

- Need for sequencing or parallel coordination.
- External deadlines and dependencies.
- Technical spikes or unknowns.
- Release, migration, or rollback constraints.
- Decision gates and evidence required before proceeding.
- User preference for milestones or another planning format.

An explicit planning opt-out wins. Explain critical consequences without creating unwanted planning artifacts.

## Comparable solutions research

Research similar applications, workflows, or build-vs-buy options when the result could change scope, technology, or architecture.

### Useful cases

- A public or commercial product needs differentiation or interoperability.
- A provider or platform could remove substantial custom infrastructure.
- The user asks whether the idea or technology is sensible.
- Current ecosystem constraints, pricing, licensing, or support materially affect the decision.

### Usually unnecessary

- A small personal utility with explicit success criteria.
- A learning exercise where building is itself the goal.
- A focused architectural question already decided by local constraints.

### Research output

Capture only decision-changing evidence:

```text
Comparable solution
Relevant capability or constraint
What transfers to this project
What does not transfer
Decision impact
```

Do not copy another product's scale, infrastructure, or business priorities. Prefer authoritative sources for current capabilities, support, pricing, licensing, and security claims.

## Derive independent profiles

### Documentation

| Profile | Use when | Typical outcome |
|---|---|---|
| Lean | Few capabilities, low handoff cost, reversible decisions | The same four-area baseline with compact RF/RNF registers, stories, trace links, core diagrams, and concise verification/operation notes. |
| Standard | Multiple capabilities, contributors, integrations, or meaningful change coordination | The same required content, split into focused documents where audiences, ownership, or change cadence benefit. |
| Rigorous | High risk, compliance, complex operations, or costly misunderstandings | Increase evidence and verification precision; add quality scenarios, threat model, recovery, runtime, deployment, and governance artifacts where justified. |

Documentation depth changes verbosity, evidence, and file splitting; it does not remove the complete-baseline requirements contract. Planning remains an independent optional profile.

### Architecture

| Profile | Use when | Typical outcome |
|---|---|---|
| Lean | Simple domain and deployment, small ownership surface | Simple MVC/layered or feature-oriented monolith. |
| Standard | Meaningful module boundaries, integrations, or parallel work | Modular boundaries, vertical slices, selected ports, explicit data ownership. |
| Rigorous | Multiple deployables, complex domain, critical boundaries, or distributed behavior | Explicit contracts, failure semantics, quality scenarios, and carefully justified distribution. |

### Assurance

| Profile | Use when | Typical outcome |
|---|---|---|
| Lean | Reversible, low-impact failures | Basic automated tests and simple operational checks. |
| Standard | Real users, durable data, important integrations | Layered tests, observability, backup expectations, and failure handling. |
| Rigorous | Security, money, regulation, irreversible actions, or high availability | Threat modeling, auditability, idempotency, recovery evidence, and explicit quality gates. |

### Planning

| Profile | Use when | Typical outcome |
|---|---|---|
| Omitted | Planning was not assessed | No planning section or artifact. |
| None | Deliberately unnecessary or declined | No roadmap; do not insist. |
| Lean | One person or a short, clear sequence | Next steps, phases, or Now/Next/Later. |
| Standard | Dependencies, parallel work, or several outcomes | Capability sequence, optional milestones, risks, and decision gates. |
| Rigorous | Critical releases, migrations, regulation, or costly rollback | Readiness evidence, rollback, external dependencies, and release gates. |

## Assessment output

For advice, prefer a concise summary:

```text
Context
- Known facts
- Assumptions
- Important unknowns

Profiles
- Documentation
- Architecture
- Assurance
- Planning, only if assessed

Implications
- What this context favors
- What it makes unnecessary
- Risks and decisions that remain
```

Do not hide uncertainty behind a profile label. Explain the few signals that materially drove each result.

