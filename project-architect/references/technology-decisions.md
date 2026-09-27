# Technology decisions

Use this reference for `DECIDE`, for the technology portion of `NEW`, or when a `FEATURE` may introduce a new dependency. It is a decision framework, not a catalog or ranking.

## Decision method

1. Define the capability or constraint the technology must satisfy.
2. Identify hard constraints: environment, team, compatibility, security, data, deployment, budget, and operations.
3. Separate must-haves from preferences.
4. Compare the smallest credible set of alternatives, including “use what already exists” and “add nothing.”
5. Account for lifecycle cost: learning, operations, migration, lock-in, failure handling, and exit path.
6. Recommend one option or a conditional choice.
7. State costs, rejected complexity, and `Revisit when` triggers.
8. Propose an ADR only when the decision creates durable architectural constraints.

Use this output shape for significant choices:

```text
Recommendation
Decision drivers
Why this fits
Alternatives considered
Trade-offs and consequences
Do not add yet
Revisit when
Verification status for time-sensitive claims
```

If the user selects another viable option, continue within it after explaining the consequences. Do not repeatedly relitigate an accepted choice.

## Current-information rule

Verify authoritative sources when the recommendation depends on current:

- supported versions or end-of-life dates;
- security properties or advisories;
- pricing, quotas, regional availability, or service limits;
- licensing or commercial restrictions;
- platform capabilities or deprecations.

Prefer official documentation, release notes, support policies, and provider pricing. If verification is unavailable, say so and avoid presenting the claim as current.

## Language and runtime

Choose using:

- Team competence and hiring/maintenance expectations.
- Required libraries, SDKs, platform support, and interoperability.
- Runtime characteristics that matter to measured or credible workloads.
- Tooling, testability, deployment, and observability.
- Upgrade and long-term support path.

Do not choose a language for benchmark prestige when the workload is dominated by database or network latency. Do not reject a familiar runtime without a concrete limitation.

## Frontend framework

First decide whether a framework is needed.

Good reasons include routing, complex state, server rendering, accessibility primitives, established team conventions, or a component ecosystem. A static or lightly interactive site may need less.

Compare:

- Rendering and hosting requirements.
- Interaction and state complexity.
- Accessibility and design-system needs.
- Team experience and maintenance horizon.
- Ecosystem stability and upgrade cost.

Avoid selecting based only on popularity or because a comparable product uses it.

## Full-stack framework or dedicated backend

Favor a full-stack application when:

- one primary web client owns most use cases;
- one team benefits from a single deployment and shared types;
- domain and integration complexity remain moderate;
- independent scaling or release cadence is not required.

Favor a dedicated backend when:

- multiple independent clients consume stable APIs;
- backend ownership or deployment is separate;
- domain workflows and integrations need an independent boundary;
- external consumers require explicit versioning or compatibility;
- runtime or security constraints differ materially.

Do not split solely because a separate backend feels more “professional.” Revisit when clients, ownership, release cadence, or runtime constraints diverge.

## Data store

### SQL by default when relationships matter

Favor a relational database for:

- transactions and invariants;
- relational queries and reporting;
- durable business records;
- migrations and well-understood operational behavior.

### SQLite

Good fit:

- personal, local-first, embedded, desktop, edge, test, or low-concurrency workloads;
- simple deployment and backup are valuable;
- one process or controlled write concurrency is acceptable.

Avoid or revisit when write concurrency, independent database operations, centralized multi-instance access, or availability requirements outgrow it.

### PostgreSQL or comparable relational service

Good fit for multi-user applications, richer concurrency, durable server-side data, transactions, indexing, reporting, and a broad ecosystem.

Costs include service operations, migrations, connection management, backup, and environment provisioning.

### Document database

Consider when aggregate-shaped documents, variable schemas, or platform constraints are genuine drivers. Avoid using “schema flexibility” to evade domain modeling, validation, or migrations.

Do not use NoSQL as a synonym for scale. State consistency, query, indexing, transaction, and exit-path consequences.

## ORM and data access

An ORM is useful for productive CRUD, migrations, common queries, and consistent mapping. Evaluate:

- query transparency and escape hatches;
- migration behavior;
- transaction control;
- type generation and schema ownership;
- performance diagnostics;
- team familiarity.

Avoid repository layers that merely wrap an ORM without adding a boundary, policy, alternate implementation, or test value. Use direct data access where it remains clear; introduce boundaries around meaningful domain or ownership concerns.

## Authentication and authorization

Separate identity from authorization.

Evaluate:

- personal/local use versus public users;
- password, passkey, social, enterprise SSO, or service identity needs;
- account recovery and lifecycle;
- tenant and role model;
- session revocation and auditability;
- regulatory or data-residency constraints;
- build-versus-provider operational burden.

A personal local tool may need no remote authentication. A public application should not invent credential handling without a concrete reason and the required expertise.

Record a significant auth strategy as an ADR because replacement affects data, flows, and trust boundaries.

## Cache and Redis

Add a cache only for a defined problem such as:

- measured expensive repeated reads;
- cross-instance rate limiting;
- ephemeral coordination, locking, or deduplication;
- pub/sub with acceptable delivery semantics;
- session or short-lived state with explicit ownership.

Before adding Redis or another stateful dependency, consider:

- query and index optimization;
- application or platform caching;
- in-process caching for one instance;
- materialized data in the primary store;
- whether stale data, invalidation, eviction, and cache failure are designed.

“The app may scale” is not a requirement. Revisit when measurements or distributed coordination create a concrete need.

## Queues and background workers

Use a worker without a queue when scheduled or deferred work can be claimed safely from the primary store and throughput is modest.

Consider a queue when:

- producers and consumers need temporal decoupling;
- retries and buffering are first-class needs;
- burst absorption or independent worker scaling is required;
- delivery semantics are understood.

Always define:

- idempotency and duplicate handling;
- retry and backoff policy;
- poison/dead-letter handling;
- ordering requirements;
- transaction boundary between durable state and message publication;
- observability and replay safety.

Do not add distributed messaging for trivial CRUD or to imitate another architecture.

## Realtime

Choose the least complex mechanism that satisfies the interaction:

- polling for infrequent or delay-tolerant updates;
- server-sent events for one-way streams;
- WebSockets for bidirectional low-latency interaction;
- managed realtime when operational simplicity outweighs lock-in and cost.

Account for reconnects, missed events, authorization, fan-out, ordering, presence, and degraded behavior. Realtime UX does not automatically require an event-driven backend.

## Object storage

Use object storage for large immutable or binary content, direct uploads, CDN delivery, retention, and lifecycle policies. Keep metadata and business ownership in the primary data model when appropriate.

Decide:

- naming and tenant isolation;
- upload authorization and size limits;
- malware or content validation;
- retention and deletion;
- consistency between metadata and objects;
- local-development strategy.

Do not store small files externally when a simpler existing mechanism satisfies the requirement.

## API style

Choose based on consumers and interaction patterns:

- REST for resource-oriented interoperable APIs and broad tooling.
- RPC/action endpoints for command-shaped operations.
- GraphQL for client-driven aggregation when its schema, authorization, caching, and operational costs are justified.
- Events or webhooks for asynchronous integration with explicit delivery semantics.

Do not force all operations into one style. Document contracts that cross team, process, or trust boundaries.

## Docker and local environments

Use containers when they improve reproducibility, dependency isolation, deployment parity, or multi-service coordination. Avoid requiring Docker for a single local process when native tooling is simpler and reliable.

Consider developer experience, image security, build time, architecture compatibility, persistence, and secrets. Docker does not choose the production platform by itself.

## Deployment model

Start from operational constraints:

- local or self-hosted;
- static hosting plus managed services;
- platform-as-a-service;
- serverless functions;
- containers on a managed platform;
- orchestrated infrastructure only when its capabilities are needed.

Compare availability, regions, scaling shape, cold starts, background work, state, observability, recovery, team skill, lock-in, and cost.

Do not recommend Kubernetes for abstract future scale. Adopt orchestration when multiple services, scheduling, policy, portability, or platform ownership create a concrete need and the team can operate it.

## Observability

Match observability to risk and failure modes:

- structured logs with correlation identifiers;
- health and dependency checks;
- error reporting;
- service and business metrics;
- traces across meaningful distributed boundaries;
- alerts tied to actionable symptoms;
- audit logs when accountability is required.

Avoid purchasing or instrumenting a complex stack without questions it must answer. High-risk operations need enough evidence to diagnose, reconcile, and recover even when traffic is low.

## Build, buy, or adapt

Prefer buying or adapting when the capability is undifferentiated, expensive to operate safely, and a provider satisfies constraints. Prefer building when control, privacy, offline behavior, custom workflow, learning, or strategic differentiation is the actual goal.

For personal or educational projects, building may be the success criterion. State the trade-off without invalidating the project.

## ADR threshold

An ADR is usually warranted for a durable choice involving:

- primary data strategy;
- architectural or deployment style;
- authentication strategy;
- communication and async model;
- major provider dependency;
- data ownership or persistence boundary.

Routine library choices, easily reversible tooling, and local implementation details usually do not need one.

