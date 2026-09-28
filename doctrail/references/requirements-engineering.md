# Requirements-led project documentation

Use this reference for the `DOCS` workflow, a complete project-documentation baseline, or a `FEATURE` that changes accepted behavior. Its purpose is to make intent buildable and verifiable without requiring verbose prose or a large file tree.

## Required content contract

A complete baseline covers these areas even for a small system:

1. **Context:** problem, purpose, intended users/callers, scope, exclusions, constraints, assumptions, and unresolved questions.
2. **Functionality:** source capability inventory/disposition, functional requirements, applicable business rules, user stories, relevant use cases, and domain vocabulary/model.
3. **Architecture:** C4 context view, current versus accepted target/proposed boundaries, data and integration choices, relevant contracts, and significant ADRs.
4. **Quality and operations:** verification strategy/cases linked to requirements, how to run and deploy (or that deployment is undecided), and risk/recovery detail where relevant. Keep the canonical `RNF` register with the other requirements in the functional area; link to it here instead of duplicating it.
5. **Navigation and traceability:** root/area indexes and a compact mapping from source capabilities to requirements, design, and verification.

Planning is a separate opt-in area. Its absence must not reduce requirements, architecture, or quality documentation. A small project may combine these contents in concise area pages; a larger system splits by capability, audience, or independent change cadence. Do not create empty template files.

## Stable identifiers and meaning

Follow existing repository conventions when present. Otherwise use unique, never-reassigned identifiers:

| Prefix | Meaning | Minimum useful record |
|---|---|---|
| `RF-###` | Functional requirement | Observable system behavior, source, priority, scope disposition, acceptance criteria, verification method |
| `RNF-###` | Non-functional requirement | Quality attribute, measurable scenario or explicit unresolved target, source, disposition, verification method |
| `RN-###` | Business/domain rule | Invariant or policy, source, affected requirements/use cases, verification where material |
| `HU-###` | User story | User/caller, need, outcome, linked `RF` IDs; acceptance criteria live with the requirement unless story-specific |
| `CU-###` | Detailed use case | Actor/trigger, preconditions, main outcome, relevant alternatives/failures, linked requirements |
| `TC-###` | Verification/test case | Setup, action, expected result, linked requirements, automated/manual method |

Use concise statements such as “The system shall…”. Preserve accepted local priority/status terminology; when none exists, define a small priority scale (`P0` = needed for the first usable/safe outcome, `P1` = accepted follow-up scope, `P2` = optional evolution) and a separate scope disposition. Standard dispositions are `ACCEPTED`, `RECOMMENDED/PROPOSED`, `DEFERRED/FUTURE`, `PENDING`, `REJECTED`, and `OUT_OF_SCOPE`; use only states supported by a user decision or evidence. Do not conflate acceptance with implementation: code and executable evidence determine what is implemented or verified; Markdown is not a live issue board.

Every complete baseline has concise functional and non-functional requirement registers in the functional area. Do not leave either category silently absent. If the project context is insufficient to accept a requirement or target, mark it `TBD`/pending and state what must be clarified; never manufacture a metric or claim. Business-rule entries are required only where actual domain rules exist; otherwise say none have been identified.

## Write for verification, not volume

- Make each `RF` atomic enough that its acceptance can be decided. Split compound statements only when behaviors can be accepted, prioritized, deferred, or tested independently.
- Give each in-scope `RF` concise acceptance criteria and a verification method. Use Given/When/Then when it clarifies behavior, not as mandatory ceremony.
- Write `RNF` as a quality scenario where evidence permits: relevant condition/load, expected system response, target or threshold, and verification method. Security, privacy, usability/accessibility, compatibility, reliability/recovery, performance/capacity, and maintainability/operability are candidates, not a checklist to populate blindly.
- Distinguish non-functional quality goals from implementation constraints. For example, “respond within X under Y load” is a performance requirement; “use PostgreSQL” is a constraint/decision unless the user gives it a quality rationale.
- Use a short `HU` for each meaningful user-facing capability. A system job, API consumer, or scheduled trigger can be the actor for non-interactive software.
- Detail a `CU` only when it explains meaningful ordering, business rules, alternatives, errors, permissions, asynchronous behavior, or risk. Standard behavior such as an ordinary login can remain a concise `RF` with acceptance criteria; document exceptions such as tenant selection, invitations, recovery, MFA, or elevated authorization when they matter.
- Keep domain terms and material `RN` rules in one canonical location. Link from other documents rather than copying definitions or acceptance criteria.
- Keep diagrams editable and evidence-based. The baseline C4 context, functional use-case view, and primary sequence remain required by the core skill. Add ER/data, container, deployment, integration, or extra sequence views only when they improve a real reader decision.

## Preserve every source capability without silently accepting all of it

For each supplied source section, existing feature, or requested capability, record one of:

- mapped to one or more accepted/proposed `RF` IDs;
- `RECOMMENDED` or `FUTURE` with rationale/dependency;
- `PENDING DECISION` with the question that blocks classification;
- `REJECTED` with the reason, if the user made or accepted that decision;
- `OUT OF SCOPE` with boundary/rationale.

The user decides whether to accept a recommendation. Do not drop ideas, silently turn suggestions into commitments, or treat a topic-to-document link as proof that its requirements were captured.

## Compact traceability

Maintain one concise matrix (or equivalent linked index) with columns appropriate to the project:

```text
Source/capability | Disposition | RF/RNF/RN | HU/CU | Design/API/data | TC/verification | Plan reference (only if planning exists)
```

Use `N/A` with a short reason where a relation does not apply. Every in-scope requirement must have an acceptance criterion and verification method; every critical/high-risk requirement should link to one or more named `TC` cases. A small low-risk project may use manual checks as test cases. The matrix demonstrates navigation/coverage, not semantic correctness; review each source and compare it against the mapped requirement.

## DOCS workflow

For a complete documentation request:

1. Read applicable instructions, existing docs/indexes, source requirements, relevant code/manifests/tests, and operational configuration. Establish whether each claim is current, accepted target, proposal, future, or unverified.
2. Inventory source capabilities and decide what is known, contradictory, missing, recommended, or out of scope. In brownfield work, preserve useful structure and identify drift; do not rewrite merely to match a template.
3. Create the required four areas with concise substance, requirement registers, stories, selected cases, baseline diagrams, quality/operation content, and traceability. Use additional focused pages only when navigation or ownership warrants them.
4. Ask only about product choices that cannot be inferred and would materially alter scope or design. Continue with explicit `TBD` where safe; do not let optional planning block the core baseline.
5. Validate links, stable IDs, required sections/views, source dispositions, and trace references. Report checks run, unverified claims, and semantic coverage limitations.

Keep `ADVISE` read-only. In `MATERIALIZE`, modify only the user-authorized artifacts, and use existing repository conventions in preference to these defaults.

## FEATURE intake and scope control

For a new capability in an existing system:

1. Search the related docs, requirements, accepted decisions, active changes, code paths, and tests before proposing a design.
2. Classify the request as existing behavior, defect, extension, or genuinely new capability. Identify reusable logic and affected boundaries/contracts/data/quality requirements.
3. Explain the user problem, relevant alternatives (including not building it), recommendation, trade-offs, risks, dependencies, and how it fits the product's purpose. Research comparable solutions only when evidence could change the choice.
4. Separate what the user explicitly requested from adjacent recommendations and future ideas. Never broaden approved scope because an additional feature seems useful.
5. In `ADVISE`, recommend `RF`/`RNF`/`HU`/`CU`/`TC` and planning changes without writing them. In `MATERIALIZE`, update only accepted/authorized requirements and corresponding trace links; implementation additionally requires authorization for that implementation.
6. Verify the accepted requirement and update durable docs/evidence after a change. Keep volatile issue status in its authoritative tracker.
