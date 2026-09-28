# Architecture patterns

Use this reference when choosing, reviewing, or evolving architectural structure. Compare options within the same axis before combining choices across axes.

## Reason by axes

An architecture is normally a composition, not one label:

| Axis | Questions | Typical choices |
|---|---|---|
| Code organization | Where does a change live? | MVC, layered, feature-oriented, vertical slices |
| Boundaries and dependencies | What may depend on what? | Simple modules, ports and adapters, clean architecture |
| Domain modeling | Where do business concepts and invariants live? | Transaction scripts, domain services, strategic DDD |
| Deployment topology | What is independently deployed or scaled? | Monolith, modular monolith, microservices, serverless |
| Communication and execution | How does work happen over time? | Synchronous calls, events, queues, workers |
| Repository topology | Where is source owned and coordinated? | Monorepo, multirepo |

Do not compare choices from different axes as if they were mutually exclusive. A modular monolith can use vertical slices, selected hexagonal boundaries, strategic DDD, and background workers.

For every recommendation, identify the concrete problem solved, the introduced cost, and a migration path that preserves optionality.

## Simple MVC

### What it is

Organizes request handling into models, views, and controllers, usually inside one application and deployment.

### Good fit

- CRUD-heavy web applications.
- Small teams and straightforward workflows.
- Frameworks whose conventions already provide this structure.
- Projects where speed of comprehension matters more than boundary formalism.

### Bad fit

- Complex invariants spread across many use cases.
- Controllers that would coordinate long workflows or multiple integrations.
- Independent modules with conflicting ownership or change cadence.

### Benefits

- Low ceremony and strong framework alignment.
- Fast onboarding and delivery.
- Clear enough structure for many real applications.

### Costs

- Models can accumulate unrelated responsibilities.
- Business rules may leak into controllers without discipline.
- Feature changes may cross several technical folders.

### Common misuse

- Treating MVC as “all logic in controllers.”
- Adding service, repository, factory, and adapter layers that only forward calls.
- Rejecting MVC because it appears insufficiently sophisticated.

### Signals to adopt

- Predominantly CRUD behavior.
- One deployable and one primary team.
- Low domain and integration complexity.

### Signals to avoid

- Repeated cross-controller business rules.
- Growing coordination logic and transaction complexity.
- Strong capability boundaries that need independent ownership.

### Migration path

Extract business operations into feature services or vertical slices, then introduce explicit module or external dependency boundaries only where pressure appears.

## Layered architecture

### What it is

Separates presentation, application/business logic, and data or infrastructure concerns, normally with dependencies flowing inward or downward according to a simple rule.

### Good fit

- Business applications with shared policies and clear technical responsibilities.
- Teams that need more separation than MVC without strict ports everywhere.
- Monoliths with conventional request/application/persistence flows.

### Bad fit

- Features that repeatedly require changes across every horizontal layer and have little sharing.
- Systems needing strong independent capability ownership.
- Tiny applications where layers add files without clarity.

### Benefits

- Familiar dependency structure.
- Testable application logic when infrastructure remains outside it.
- Incremental path from simple MVC.

### Costs

- Horizontal layers can become broad coupling points.
- Changes may scatter across technical folders.
- “Layer” may become a reason for pass-through abstractions.

### Common misuse

- Requiring every request to pass through identical empty layers.
- Allowing circular dependencies or infrastructure to leak everywhere.
- Assuming layered architecture requires one repository class per table.

### Signals to adopt

- Shared business policies need a clear home.
- The team benefits from conventional responsibility boundaries.
- Infrastructure should be replaceable or testable at selected seams.

### Signals to avoid

- Most changes are feature-local and layers obscure that locality.
- The application is too small to justify the ceremony.

### Migration path

Group code by feature inside or across layers, promote stable capabilities into modules, and use ports only at volatile or consequential boundaries.

## Feature-oriented organization

### What it is

Groups controllers, application logic, domain code, and persistence related to one capability near each other instead of organizing the whole application by technical type.

### Good fit

- Product work is discussed and owned by feature or capability.
- Teams want local change paths in a monolith.
- Features have mostly distinct rules but share platform utilities.

### Bad fit

- A tiny CRUD project where feature folders would contain one file each.
- Capabilities are not yet understood and premature boundaries would churn.
- Shared policies would be duplicated rather than deliberately centralized.

### Benefits

- Better change locality and ownership.
- Easier path toward explicit modules or slices.
- Reduces broad controller/service/repository directories.

### Costs

- Shared code ownership requires discipline.
- Cross-feature workflows need an explicit coordination approach.
- Poorly chosen feature boundaries can hide coupling.

### Common misuse

- Duplicating every shared utility to preserve folder purity.
- Calling arbitrary UI pages “domains.”
- Treating folders as enforced boundaries when imports remain unrestricted.

### Signals to adopt

- Most work maps to recognizable capabilities.
- Horizontal folder structure causes scattered changes or ownership confusion.

### Signals to avoid

- No stable capability language exists yet.
- Technical layers are already small, clear, and effective.

### Migration path

Move one coherent capability at a time, preserve public entry points, and add import rules later only if drift becomes a demonstrated problem.

## Vertical slices

### What it is

Organizes code around individual use cases or commands/queries, allowing each slice to contain the behavior and data access it needs while sharing deliberate cross-cutting infrastructure.

### Good fit

- Use cases vary significantly in validation, data access, or response shape.
- Independent feature delivery and test locality matter.
- Horizontal layers create frequent coordinated edits.

### Bad fit

- Very small CRUD where slices multiply files without reducing complexity.
- A domain with important shared invariants that would be duplicated across slices.
- Teams mistake isolation for permission to ignore consistent policies.

### Benefits

- High change locality.
- Use-case-centered tests and ownership.
- Allows different implementation strategies per slice.

### Costs

- Potential duplication.
- Cross-slice consistency and transactions need explicit design.
- Discoverability can suffer without naming conventions.

### Common misuse

- Adding CQRS, a mediator, events, and one class per operation by ritual.
- Duplicating domain rules instead of extracting a coherent model.
- Calling any feature folder a vertical slice.

### Signals to adopt

- Use cases evolve independently.
- Read and write paths differ materially.
- A feature-oriented monolith needs finer-grained locality.

### Signals to avoid

- Shared invariants dominate the domain.
- The only benefit would be more files or framework ceremony.

### Migration path

Start with one high-change use case, retain shared policies where appropriate, and expand only when the slice reduces coordination cost.

## Modular monolith

### What it is

One primary deployment containing explicit capability modules with controlled dependencies, owned data or schemas where useful, and stable internal contracts.

### Good fit

- Domain or team complexity needs boundaries, but independent deployment is unnecessary.
- Strong transaction consistency and simple operations remain valuable.
- The team wants an evolutionary path without distributed-system costs.

### Bad fit

- Tiny applications where modules would be naming ceremony.
- Independent scaling, isolation, compliance, or release cadence is already a hard requirement.
- The codebase has no enforceable or socially understood module boundaries.

### Benefits

- Strong internal structure with simple deployment and debugging.
- Easier transactions and local calls.
- Lower operational burden than microservices.

### Costs

- Boundary enforcement requires discipline or tooling.
- Shared database access can erode ownership.
- Whole-application deployments remain coupled.

### Common misuse

- Calling arbitrary folders modules while allowing unrestricted imports.
- Creating an internal network-like abstraction for every call.
- Designing every module as a future microservice without evidence it will split.

### Signals to adopt

- Multiple capabilities have distinct language, rules, or ownership.
- The application remains one operational unit.
- Teams need parallel work without distribution.

### Signals to avoid

- Boundaries cannot yet be described.
- A simple feature-oriented monolith remains clear.

### Migration path

Define module APIs and data ownership, remove cross-module database access, add dependency checks if needed, then extract only modules with a demonstrated independent deployment need.

## Hexagonal architecture / ports and adapters

### What it is

Places application or domain behavior behind ports and connects external systems through adapters, keeping dependency direction toward the core.

### Good fit

- External providers are volatile, consequential, or need reliable fakes.
- Business behavior should remain independent of delivery and persistence details.
- Multiple adapters genuinely exist or are foreseeable from current constraints.

### Bad fit

- Simple CRUD tightly aligned with one framework and store.
- Interfaces would have one trivial implementation and no testing or volatility value.
- Applying the pattern everywhere would obscure direct code.

### Benefits

- Explicit boundaries and dependency direction.
- Easier substitution and focused tests at important seams.
- Contains provider-specific behavior.

### Costs

- Additional contracts, mapping, and navigation.
- Risk of lowest-common-denominator interfaces.
- Framework integration can become indirect.

### Common misuse

- One interface per class or table.
- Treating every library call as a port.
- Creating generic repositories that hide useful database capabilities.

### Signals to adopt

- Payments, identity, messaging, storage, or other external boundaries may change or fail independently.
- Tests need deterministic control over side effects.
- Dependency leakage is already causing change cost.

### Signals to avoid

- No concrete boundary problem exists.
- The abstraction would only rename a direct dependency.

### Migration path

Introduce ports at one volatile boundary, move provider mapping into an adapter, and expand only where the separation proves useful.

## Clean architecture

### What it is

Organizes policy into inner layers and details into outer layers, with dependencies pointing toward business rules and use cases.

### Good fit

- Long-lived systems with substantial policy independent of frameworks.
- Several delivery mechanisms or infrastructure implementations.
- Teams need an explicit dependency rule across a large codebase.

### Bad fit

- Small applications whose business behavior is mostly CRUD.
- Teams would spend more effort mapping layers than expressing behavior.
- Strict purity would block useful framework capabilities.

### Benefits

- Durable separation of policy and details.
- Clear test seams.
- Framework replacement is less invasive at designed boundaries.

### Costs

- Mapping and indirection.
- More concepts and files to navigate.
- Can encourage generic abstractions and anemic models.

### Common misuse

- Treating a prescribed folder diagram as the objective.
- Duplicating data models in every layer without a meaningful boundary.
- Assuming all dependencies are equally volatile.

### Signals to adopt

- Business policy is complex and long-lived.
- Dependency direction needs to be explicit and teachable.
- External details change independently from core behavior.

### Signals to avoid

- The framework and database effectively define the application.
- Selected ports would solve the actual problem with less ceremony.

### Migration path

Separate use cases and policies first, invert only meaningful dependencies, and avoid a whole-system rewrite to reach theoretical purity.

## Strategic DDD

### What it is

Uses domain language, bounded contexts, context relationships, and explicit ownership to manage complex business meaning. It does not require all tactical DDD patterns.

### Good fit

- Domain terms have conflicting meanings across capabilities.
- Rules and invariants are a major source of complexity.
- Multiple teams or integrations need explicit context boundaries.

### Bad fit

- CRUD around a simple or externally defined data model.
- The team lacks access to domain knowledge.
- DDD terminology would rename technical layers without clarifying the business.

### Benefits

- Better alignment between language, ownership, and software boundaries.
- Makes integration and model translation explicit.
- Helps prioritize domain complexity over infrastructure fashion.

### Costs

- Requires sustained domain collaboration.
- Boundary and language discovery take time.
- Tactical patterns can add substantial ceremony.

### Common misuse

- Adding entities, value objects, aggregates, and repositories to every table.
- Equating bounded contexts with microservices.
- Creating a “domain” folder without a ubiquitous language.

### Signals to adopt

- Repeated misunderstandings arise from overloaded domain terms.
- Business invariants are difficult to locate or protect.
- Capabilities have distinct ownership and models.

### Signals to avoid

- Complexity is primarily technical integration, not domain meaning.
- A simple module vocabulary already works.

### Migration path

Start with language and context mapping, isolate one high-value boundary, then add tactical patterns only where they protect real invariants.

## Event-driven architecture

### What it is

Components publish facts or state changes that other components process asynchronously, often with eventual consistency and independent failure.

### Good fit

- Multiple consumers react independently to the same durable fact.
- Temporal decoupling, buffering, audit streams, or asynchronous workflows are required.
- Eventual consistency is acceptable and designed.

### Bad fit

- Simple in-process coordination or CRUD.
- The system requires immediate transactional consistency across all effects.
- The team lacks tooling for tracing, replay, schema evolution, and failure handling.

### Benefits

- Decouples producers from consumer timing.
- Supports fan-out and independent evolution.
- Can absorb bursts and model meaningful domain facts.

### Costs

- Eventual consistency, duplication, ordering, and replay complexity.
- Harder debugging and end-to-end reasoning.
- Contract versioning and observability requirements.

### Common misuse

- Using an event bus for calls inside one simple process.
- Publishing vague technical events with unclear ownership.
- Ignoring idempotency, outbox boundaries, or dead-letter handling.

### Signals to adopt

- Real asynchronous consumers and failure isolation are needed.
- A durable business fact has multiple independent reactions.
- Synchronous chains create unacceptable coupling or latency.

### Signals to avoid

- Events merely replace direct calls without temporal decoupling.
- Consistency and recovery semantics are undefined.

### Migration path

Begin with one well-defined integration event, establish transactional publication and idempotent consumption, then expand only after operations and observability work.

## Microservices

### What it is

Independently deployed services with explicit network contracts and ownership, each accepting distributed-system and operational costs.

### Good fit

- Independent team ownership and release cadence are demonstrated needs.
- Isolation, scaling, compliance, or technology constraints differ by capability.
- Boundaries and data ownership are mature enough to survive network separation.

### Bad fit

- Small teams, simple domains, early products, or unclear boundaries.
- Services would share one database or require synchronous distributed transactions.
- Operational maturity and observability are insufficient.

### Benefits

- Independent deployment, scaling, and fault containment when boundaries are real.
- Clear ownership and technology autonomy where justified.

### Costs

- Network failure, latency, versioning, observability, security, and data consistency.
- More deployments, environments, incident surfaces, and coordination.
- Local development and testing complexity.

### Common misuse

- One service per entity or table.
- Distribution for resume value or hypothetical scale.
- A distributed monolith with lockstep releases and shared data.

### Signals to adopt

- A modular monolith has a proven boundary with independent operational pressure.
- Teams need autonomous delivery and can own production behavior.
- Isolation benefits exceed coordination cost.

### Signals to avoid

- The primary problem is code organization.
- Boundaries, ownership, or failure semantics remain unclear.

### Migration path

Create a modular boundary first, remove shared data access, define contracts and observability, then extract one service with measurable independent needs.

## Serverless

### What it is

Runs functions or managed components on demand, shifting infrastructure management to a platform and accepting its execution model and constraints.

### Good fit

- Event-driven or bursty workloads.
- Small teams preferring managed operations.
- Short-lived stateless execution and managed integrations.
- Personal or internal tools benefiting from low idle cost.

### Bad fit

- Long-running compute, specialized networking, predictable heavy utilization, or strict latency without suitable platform support.
- Workflows that fight execution duration, local development, or provider constraints.
- Lock-in or regional constraints violate requirements.

### Benefits

- Low infrastructure ownership and automatic elasticity.
- Fine-grained managed integrations.
- Potentially economical for intermittent workloads.

### Costs

- Platform limits, cold starts, observability, local parity, and lock-in.
- Distributed behavior can appear even in a small codebase.

### Common misuse

- Splitting every handler into a separately reasoned service.
- Assuming serverless means no operations or unlimited scale.
- Ignoring concurrency effects on databases and downstream systems.

### Signals to adopt

- Workload and provider capabilities align naturally.
- Managed services materially reduce operational burden.

### Signals to avoid

- Architecture requires workarounds for core platform limits.
- A simple long-running application is cheaper and easier.

### Migration path

Keep domain logic portable, isolate provider adapters, and use standard contracts so selected functions or workloads can move without rewriting the whole system.

## Background workers

### What it is

Processes work outside the request path, either in the same deployable, a separate process, or behind a queue.

### Good fit

- Slow, scheduled, retryable, compute-heavy, or externally rate-limited work.
- User requests should return before side effects finish.
- Work can be made idempotent and observable.

### Bad fit

- Immediate synchronous results are required.
- Retry, cancellation, ownership, and failure recovery are undefined.
- A cron or direct request already satisfies a trivial need safely.

### Benefits

- Protects request latency and isolates background capacity.
- Supports retries and scheduled execution.

### Costs

- Job state, duplicates, retries, deployment, and monitoring.
- User-visible eventual completion needs UX design.

### Common misuse

- Adding a queue before establishing one real background workload.
- Treating “run later” as a substitute for transaction design.
- Retrying irreversible actions without idempotency.

### Signals to adopt

- Work exceeds request budgets or must survive process restarts.
- Independent concurrency or rate control is necessary.

### Signals to avoid

- The only reason is hypothetical future scale.
- The primary store can safely handle a tiny scheduled workload more simply.

### Migration path

Start with a durable job record and one worker when sufficient; add a queue or separate deployment only when throughput, buffering, or isolation requires it.

## Monorepo and multirepo

### What it is

Repository topology controls how code, ownership, versioning, and tooling are coordinated. It does not determine runtime topology.

### Good fit: monorepo

- Coordinated changes across applications or packages are frequent.
- Shared tooling, types, and atomic changes reduce friction.
- Access controls permit shared source ownership.

### Bad fit: monorepo

- Legal, security, or organizational isolation requires separate access.
- Repository scale overwhelms available tooling.
- Independent products have little coordinated change.

### Good fit: multirepo

- Teams and release cycles are genuinely independent.
- Access, compliance, or ownership boundaries are strong.
- Contracts are stable enough for versioned integration.

### Bad fit: multirepo

- Changes constantly require synchronized pull requests.
- Shared packages and compatibility management dominate work.
- A small team gains no ownership benefit.

### Benefits

- Monorepo: atomic changes, shared tooling, discoverability.
- Multirepo: isolation, independent permissions, smaller ownership surfaces.

### Costs

- Monorepo: tooling, build graph, broad access, accidental coupling.
- Multirepo: versioning, duplication, coordinated changes, discoverability.

### Common misuse

- Assuming microservices require multirepo.
- Creating multirepo boundaries before team or access boundaries exist.
- Using a monorepo as permission for uncontrolled cross-package imports.

### Signals to adopt

- Choose based on change coupling, ownership, access, tooling, and release independence.

### Signals to avoid

- Do not migrate because one topology is fashionable.

### Migration path

Define package and contract boundaries first. Split or consolidate repositories only when ownership and change patterns justify the migration cost.

## Useful compositions

### Small CRUD or personal tool

```text
Simple MVC or layered monolith
+ direct relational or SQLite persistence
+ no cache or queue without a concrete need
```

### Growing business application

```text
Feature-oriented modular monolith
+ vertical slices for independent use cases
+ ports at volatile external boundaries
+ background worker for demonstrated asynchronous work
```

### Complex domain with several teams

```text
Strategic DDD context boundaries
+ modular monolith or selected services
+ explicit data ownership
+ events only for real asynchronous integration
```

These are examples, not presets. Select each axis from actual constraints and retain the simplest migration path.

