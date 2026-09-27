# C4 and arc42

Use C4 to communicate selected views and arc42 to check whether important architectural questions were considered. Neither requires a fixed document set.

## Decide whether a diagram is useful

Create a diagram only when it clarifies a relationship, boundary, runtime interaction, or deployment fact that prose or a small table would communicate poorly.

Before creating one, answer:

- Who will use it and for what decision?
- What question should the diagram answer?
- What level is required to answer that question?
- Where will its maintained source live?
- What change would make it stale?

If there is no owner, question, or maintenance path, prefer concise prose.

## C4 views

### System Context

Show the system, important people or roles, and external systems.

Use when:

- actors or external systems materially shape architecture;
- system scope is misunderstood;
- trust, ownership, or integration boundaries need a shared view.

Omit when the project is a tiny isolated tool and the same information is obvious in one sentence.

Include:

- system under consideration;
- meaningful actors;
- external systems and the purpose of each relationship;
- boundary or ownership notes when relevant.

Do not include internal modules, frameworks, tables, or deployment detail.

### Containers

In C4, a container is an application, process, data store, or independently running unit, not necessarily a Docker container.

Use when the system has multiple meaningful runtime units such as:

- web or mobile clients;
- API or backend application;
- worker or scheduler;
- database, cache, or object storage;
- external providers;
- independently deployed services.

Include responsibilities, technology only when decision-relevant, and communication direction or protocol.

Avoid representing every library, module, serverless function, or infrastructure resource as a container.

### Components

Show major responsibilities inside one container only when internal structure is complex enough that readers cannot infer it from code organization and prose.

Good reasons:

- several architectural modules or capability boundaries;
- dependency direction needs explanation;
- a risky or frequently changed container needs a shared model.

Avoid component diagrams for simple CRUD containers or when the view would merely mirror folders.

### Dynamic or sequence view

Use for an important runtime flow with meaningful ordering, failures, async boundaries, retries, or trust changes.

Typical examples:

- OAuth or authentication callback;
- payment or money movement;
- webhook receipt and idempotent processing;
- scheduled publication with retry;
- distributed workflow or compensation;
- critical user action crossing several containers.

Show the happy path plus decision-relevant failure behavior. Do not diagram every endpoint.

### Deployment view

Use when topology affects availability, security, latency, scaling, operations, or data residency.

Show only relevant facts:

- environments, regions, networks, or trust zones;
- deployable units and managed services;
- data location and replication;
- ingress, egress, and operational dependencies;
- scaling or failover relationships.

Omit when one obvious managed deployment has no architectural consequence.

## C4 quality rules

- Give each element one clear responsibility.
- Use consistent names across diagrams, code, and documentation.
- Label relationships with intent, not only protocol.
- Make external ownership and trust boundaries explicit when relevant.
- Distinguish current from proposed architecture.
- Mark inferred or unverified brownfield elements.
- Prefer a small readable view over one complete but unusable diagram.
- Link to ADRs or decisions instead of embedding their full rationale.

## arc42 as a reasoning checklist

Consider each topic, but create a section or document only when the answer matters.

### 1. Goals

Questions:

- What business, user, or learning outcomes drive the architecture?
- Which quality attributes determine success?

Materialize when goals constrain design or prevent future agents from optimizing the wrong thing.

### 2. Constraints

Questions:

- What technical, organizational, legal, budget, schedule, or compatibility constraints are real?
- Which choices are fixed by the user or environment?

Keep facts separate from preferences and assumptions.

### 3. Context

Questions:

- Who uses the system?
- Which external systems and trust boundaries exist?
- What is in and out of scope?

A C4 context view is useful when relationships are non-trivial.

### 4. Solution strategy

Questions:

- What few architectural choices explain most of the design?
- Why is this level of structure proportional?

Summarize the strategy; put significant rationale in ADRs.

### 5. Building blocks

Questions:

- What are the major capabilities, modules, containers, or services?
- What does each own and expose?
- What dependency rules matter?

Use a table, tree, or C4 component view only at the necessary level.

### 6. Runtime

Questions:

- Which flows are critical, asynchronous, failure-prone, or security-sensitive?
- Where are transactions, retries, idempotency, and eventual consistency handled?

Use sequence or dynamic views selectively.

### 7. Deployment

Questions:

- Where does each runtime unit execute?
- How are state, networking, scaling, environments, and recovery handled?

Create a deployment view only when topology is not obvious.

### 8. Cross-cutting concepts

Consider only relevant topics:

- identity, authorization, tenancy, and secrets;
- validation, errors, retries, and idempotency;
- observability and auditability;
- data ownership, migrations, privacy, and retention;
- configuration, localization, and accessibility;
- testing and release strategy.

Do not create a section for every possible concern.

### 9. Architectural decisions

Questions:

- Which decisions are durable, consequential, or difficult to reverse?
- What alternatives and revisit conditions matter?

Use ADRs rather than repeating full rationale in the architecture overview.

### 10. Quality requirements

Questions:

- Which measurable security, availability, latency, consistency, usability, or maintainability scenarios drive design?
- What evidence will demonstrate them?

High assurance does not imply microservices; it implies explicit risks and evidence.

### 11. Risks and technical debt

Questions:

- What could invalidate the design?
- Which unknowns require a spike, measurement, or decision gate?
- Which accepted shortcuts have triggers for repayment?

Avoid generic risk lists disconnected from decisions.

### 12. Glossary

Create a glossary when domain terms, acronyms, or overloaded words cause real ambiguity. Do not define universal software terms.

## Choose documentation by profile

### Lean

Usually one architecture document containing relevant goals, constraints, context, strategy, major blocks, key decisions, risks, and revisit triggers. Add diagrams only when they materially improve understanding.

### Standard

May separate architecture overview, context/containers, data, integrations, ADRs, runtime flows, deployment, and risks when each has a current audience and purpose.

### Rigorous

May add quality scenarios, security architecture, threat model, data classification, recovery, observability, detailed runtime and deployment views, and architecture rules when risk or compliance justifies them.

The profile controls depth and evidence, not a mandatory document count.

## Avoid diagram drift

- Keep source beside the documentation when practical.
- Prefer text-based or model-based diagrams that the team can maintain, but do not introduce a tool solely for theoretical maintainability.
- Link diagrams from the documentation index only when they exist.
- When code and a diagram disagree, investigate which changed and why; do not silently overwrite either.
- Remove or explicitly mark obsolete views after an accepted change.

## Recommended output

When proposing diagrams, state:

```text
Question answered
Recommended view and level
Included elements
Deliberately omitted detail
Maintenance owner or trigger
```

Do not output all C4 levels or all arc42 topics by default.

