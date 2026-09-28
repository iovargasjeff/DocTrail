# Existing project architecture review

Use this reference for `REVIEW` or when a `FEATURE` requires reconstructing an existing system before deciding how the change fits. The goal is an evidence-based model of the current architecture and proportional improvements, not conformity to a preferred template.

## Set the review boundary

Establish the question before inspecting broadly:

- whole-system architecture, one subsystem, or one proposed feature;
- current-state reconstruction, fitness assessment, drift investigation, or decision support;
- depth expected and important quality attributes;
- files, environments, history, runtime evidence, and external systems available;
- whether commands or tests may be run safely;
- whether the request is analysis-only or includes specifically authorized artifacts.

Operate in `ADVISE` unless the user explicitly authorizes changes. Repository review permits relevant read-only inspection; it does not authorize refactoring, dependency updates, configuration changes, documentation writes, or a roadmap.

Do not silently turn an architecture review into a security audit, performance benchmark, dependency upgrade, or comprehensive code review. Surface material signals, state the limit, and recommend specialized follow-up when necessary.

## Keep feature investigations focused

When `FEATURE` concerns an existing repository, use a smaller boundary than a whole-system review unless the change demonstrably crosses system-wide concerns:

1. Translate the requested behavior into domain terms, synonyms, and likely entry points.
2. Search relevant source, specs, active changes, and tests. Follow callers and dependencies far enough to understand the current end-to-end behavior; do not infer ownership from directory names alone.
3. Compare nearby capabilities and shared rules to identify what should be reused, extended, or kept separate.
4. Check relevant validation, authorization, data ownership, transactions, integrations, and tests when the feature touches them.
5. Report a compact evidence map: current behavior, source paths, reusable logic, genuine gaps, and unverified areas. Distinguish implementation from documented intent and accepted target state.

Use focused searches such as `rg -n` with domain terms, aliases, and related symbols, then inspect the matches and their call paths. Expand the boundary only when evidence shows a cross-cutting change or a significant risk. A failed search is not, by itself, evidence that no related behavior exists. If the repository or source files are unavailable, say so and base conclusions only on the supplied context.

## Inspect from authority to implementation

Adapt this base order to repository structure and the review question:

1. applicable parent and nested `AGENTS.md` files;
2. README, contribution guidance, and workspace or monorepo metadata;
3. existing architecture, feature, operational, and delivery documentation;
4. ADRs and other accepted decisions;
5. manifests, lockfiles, build configuration, and runtime entry points;
6. top-level structure and representative modules;
7. infrastructure, deployment, environment, and migration definitions;
8. tests, CI, static checks, and observable quality gates;
9. repository history or runtime evidence only when needed and available;
10. architecture inference and fitness assessment.

Do not treat the order as a checklist requiring exhaustive reading. Start broad enough to avoid false assumptions, then sample the files that can confirm or refute the architecture model. Follow important call paths across boundaries rather than estimating architecture from folder names alone.

For large repositories, identify the workspace layout and applicable instructions first, then constrain inspection by subsystem, dependency direction, or representative flow. Report the sampling boundary.

## Use a bounded structural inventory

For a whole-system or broad brownfield review, run the bundled helper when Python 3.11+ is available:

```bash
python doctrail/scripts/repository_inventory.py . --format markdown
python doctrail/scripts/repository_inventory.py . --format json
```

The helper uses only the Python standard library, reads filesystem metadata but never opens repository files, omits sensitive names and common generated/dependency areas, does not follow symbolic links, and bounds depth, file/directory counts, entries retained per directory, error detail, and large-file reporting. It reports likely manifests, entrypoints, tests, CI, infrastructure, documentation, ADRs, language extensions, large/generated areas, and basic Git state. Tune `--max-depth`, `--max-files`, `--max-directories`, `--max-entries-per-directory`, `--max-file-size`, or repeat `--ignore` when the default scope is not appropriate.

The inventory is an orientation aid, not proof that a module exists, is active, or has a particular architecture. Follow important references into manifests, source, tests, deployment, and history. In the review evidence inventory, state the exact command, limits, exclusions, partial-scan reasons, errors, and uninspected areas. A lightweight or narrow feature review may skip it. If the bundled helper cannot run, continue with host-native listing/search tools and record that fallback; do not invent findings from a failed scan.

## Build an evidence inventory

Record what was actually available and inspected:

```text
Repository areas inspected
Instructions and documentation read
Manifests and infrastructure inspected
Representative flows traced
Tests or checks run, with result
Runtime or production evidence used
Areas not inspected or inaccessible
```

For a structural scan, include the command and its bounded/ignored areas here; the helper's summary does not replace this evidence record.

Run tests or diagnostic commands only when they are relevant, reasonably safe, and proportionate to the request. Do not imply that reading test files means tests passed. Report commands that were not run and why when that affects confidence.

For `DOCS` or a `FEATURE` that changes product behavior, inspect the relevant functional inventory and verification evidence as well as architecture material. Compare source capabilities, accepted requirements/stories/use cases, implementation paths, tests, active changes, and operations only to the scope needed. Distinguish “not found in this bounded search” from “does not exist.” Record uncovered source items as open/disposition-needed rather than omitting them.

When a claim depends on current framework support, vendor behavior, security status, licensing, or platform limits, verify authoritative current sources if allowed. Repository evidence alone may only establish what the project declares or currently uses.

## Classify every material finding independently

Use three independent dimensions:

### Basis

| Basis | Meaning |
|---|---|
| `OBSERVED` | Directly established from inspected code, configuration, tests, command output, or runtime evidence. |
| `DOCUMENTED` | Stated in project documentation or an accepted decision, but not independently confirmed. |
| `INFERRED` | Reasonably derived from several signals; the inference and supporting signals must be explicit. |
| `UNVERIFIED` | Material to the review but not established with available evidence. |

### Assessment

| Assessment | Meaning |
|---|---|
| `GOOD` | Fits the project's actual context or is a useful convention worth preserving. |
| `WARNING` | Creates a plausible cost or risk that is limited, conditional, or not yet evidenced as failure. |
| `PROBLEM` | Causes demonstrated harm, violates a known requirement, or creates disproportionate material risk. |
| `DECISION NEEDED` | Evidence exposes a meaningful unresolved choice that cannot be resolved safely by inspection alone. |

### Confidence

Use `high`, `medium`, or `low` based on evidence quality, coverage, and consistency—not on how strongly the reviewer feels.

Do not map `UNVERIFIED` to `PROBLEM`, `INFERRED` to `WARNING`, or `OBSERVED` to high confidence automatically. For example, an observed abstraction can still require context before assessing its value.

Use this finding shape for consequential points:

```text
Finding
Basis
Assessment
Confidence
Evidence and scope
Why it matters in this project
Recommendation
Alternatives and trade-offs
Revisit or verification condition
```

Use file and line references where they materially help verification. Do not overload the report with a finding for every inspected file.

## Reconstruct the current architecture

Describe only dimensions relevant to the review:

- runtime and deployment units;
- code organization and dependency direction;
- module, domain, team, or ownership boundaries;
- entry points, public contracts, and trust boundaries;
- data ownership, transactions, consistency, migrations, and recovery;
- external integrations and failure handling;
- synchronous, asynchronous, scheduled, and event flows;
- authentication, authorization, secrets, and sensitive-data paths;
- retries, idempotency, caching, queues, and workers;
- observability, auditability, tests, CI, and release mechanisms.

Distinguish folder organization from enforced boundaries, and declared infrastructure from deployed reality. A dependency diagram inferred from imports does not by itself prove runtime topology or ownership.

Preserve useful local vocabulary and conventions. When possible, explain the system first in its own terms, then map it to architectural patterns if that improves understanding.

## Investigate drift

Drift is a meaningful disagreement among durable intent, implementation, executable evidence, or deployed behavior. It is not simply that a document is old.

Common forms include:

- documentation describes a boundary the code bypasses;
- an accepted ADR names a technology or constraint no longer reflected in implementation;
- tests enforce behavior that contradicts the documented contract;
- deployment configuration differs from the architecture's declared runtime units;
- duplicated documentation expresses incompatible current states;
- a migration or refactor left both old and new paths active without a clear decision.

For each suspected drift:

1. quote or locate the conflicting claims precisely;
2. establish each source's status, scope, and relevant history;
3. look for an accepted superseding decision or incomplete migration;
4. test the behavior only when safe and useful;
5. classify what is observed, documented, inferred, and still unverified;
6. recommend which decision or source needs confirmation before synchronization.

Neither documentation, code, tests, nor deployment wins automatically. Do not “fix” drift by overwriting one side before determining accepted intent.

## Evaluate overengineering contextually

Potential signals include:

- abstractions with no demonstrated variability, isolation need, or testing value;
- repositories layered over repositories without a boundary benefit;
- factories or generic frameworks that obscure simple construction;
- CQRS or event sourcing around straightforward CRUD without relevant audit, scale, or model needs;
- multiple deployables with tightly coupled changes and no independent operational or ownership reason;
- distributed messaging used only to communicate inside one process;
- caches without measured need, invalidation design, or operational ownership;
- tactical DDD ceremony around a simple domain;
- extension points designed for hypothetical consumers;
- duplicate models and mapping layers whose cost exceeds their isolation value.

These are prompts to investigate, not verdicts. Seek the original driver, current consumers, change history, risk isolation, team topology, performance evidence, and migration constraints. An abstraction with one implementation may still isolate a volatile provider or protect a critical test boundary. A queue may exist for durability rather than scale.

Assess demonstrated costs such as slower changes, inconsistent duplication, cognitive load, operational burden, failure modes, or inability to trace behavior. Recommend removal or consolidation only when the expected benefit exceeds migration risk.

## Evaluate underengineering contextually

Potential signals include:

- complex business rules embedded in controllers, UI handlers, or transport code;
- infrastructure access scattered through domain behavior;
- duplicated rules that already diverge;
- unclear data ownership or transaction boundaries;
- external integrations without a stable adapter, failure policy, or contract handling;
- shared state crossing modules without enforceable boundaries;
- secrets in code or unsafe configuration practices;
- critical operations without idempotency, retry limits, reconciliation, or audit evidence;
- background work without poison-message, retry, or observability strategy;
- missing tests, telemetry, recovery, or authorization controls where consequence requires them;
- cyclic dependencies or change coupling that repeatedly causes defects.

Absence of a pattern, layer, diagram, cache, queue, interface, or microservice is not underengineering by itself. Connect the finding to actual domain complexity, risk, repeated change pain, incidents, or foreseeable constraints.

Prefer the smallest remedy that restores fitness: extract one rule, define one ownership boundary, centralize one integration, add one transaction or idempotency mechanism, or document one significant decision. Do not prescribe a wholesale rewrite merely because a named architecture pattern is absent.

## Balance findings and prioritize change

Record strengths worth preserving, not only defects. Useful conventions, simple boundaries, effective tests, or intentionally low operational burden constrain better recommendations.

Prioritize recommendations by:

1. consequence and likelihood of harm;
2. evidence strength and uncertainty to resolve;
3. current friction or blocked capability;
4. reversibility and migration risk;
5. effort relative to expected value;
6. dependencies among improvements.

Separate:

- immediate correctness or safety concerns;
- verification or decisions needed before change;
- incremental improvements that reduce current friction;
- revisit triggers for currently acceptable design;
- optional future evolution.

Do not invent timelines, owners, milestones, or a transformation roadmap unless planning is requested. Prefer incremental changes and compatibility-aware migrations over a template-driven reorganization.

## Review output contract

A complete proportional review contains:

1. review question, scope, and exclusions;
2. evidence inventory and tests or checks run;
3. concise current-architecture model;
4. strengths to preserve;
5. prioritized findings with basis, assessment, and confidence;
6. drift and unresolved decisions;
7. overengineering and underengineering conclusions tied to context;
8. recommendations with trade-offs and smallest viable next change;
9. unverified areas and conditions that would change the assessment.

Scale the report to the request. A focused feature review may need only a boundary map and a few findings; a whole-system review may justify separate sections or diagrams. In `MATERIALIZE`, use existing project documentation or the architecture template selectively, and change only accepted artifacts.

Before finishing, verify that the report does not present inference as fact, absence as a defect, documentation as deployed truth, or architectural preference as an objective requirement.

