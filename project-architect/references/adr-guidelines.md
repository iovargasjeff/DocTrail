# Architecture decision records

Use this reference when a decision may deserve an ADR, when creating or updating ADRs, or when reviewing decision history. An ADR preserves why a consequential choice was made; it is not a log of every technical preference.

## Decide whether an ADR adds value

Create or recommend an ADR when the choice has durable consequences and at least one of these applies:

- it establishes a system boundary, dependency direction, data ownership rule, or deployment topology;
- it selects or rejects a technology whose replacement would be costly;
- it changes a public contract, consistency model, security posture, or operational responsibility;
- multiple viable options have meaningful trade-offs;
- future contributors are likely to question or accidentally reverse the choice;
- an assumption or constraint must remain visible until a specific revisit trigger occurs.

Usually do not create an ADR for:

- formatting, naming, or local implementation details covered by existing conventions;
- easily reversible choices with no cross-cutting effect;
- a decision already governed by an accepted ADR;
- raw meeting notes, research dumps, or unresolved brainstorming;
- operational status, assignments, dates, or progress tracking;
- a choice the user has not accepted, unless the ADR is explicitly marked `Proposed`.

If the choice matters but does not justify a standalone ADR, record it briefly in the relevant architecture or feature document.

## Authorization and output mode

In `ADVISE`, say whether an ADR is warranted and provide its proposed subject, status, rationale, and revisit trigger. Do not write or renumber files.

In `MATERIALIZE`:

1. read repository instructions and existing decision conventions;
2. inspect the ADR directory, index, filenames, numbering, statuses, and links;
3. use the repository's language and format when an established convention is adequate;
4. create or change only the specifically authorized decision artifacts;
5. update an existing index only when it exists or its creation was accepted.

Do not create an ADR directory, index, or template merely to satisfy this skill's preferred shape.

## ADR content contract

A useful ADR answers:

```text
What decision is being made?
What context and decision drivers matter?
Which credible options were considered?
Why was this option selected?
What benefits and costs are accepted?
Under which observable conditions should it be revisited?
What prior or related decisions does it affect?
```

Keep evidence separate from interpretation. Link supporting measurements, prototypes, threat models, or vendor documentation instead of copying large source material into the ADR.

### Required and conditional fields

- `Status`: required.
- `Date`: include when known or when the repository convention requires it; never invent one.
- `Decision owners`: include only when ownership is meaningful and known.
- `Context`, `Decision drivers`, `Considered options`, `Decision`, and `Consequences`: required for a substantive ADR.
- `Revisit when`: required. Use observable triggers, not “later” or an arbitrary calendar date without a reason.
- `Supersedes / Superseded by` and `Related`: include when applicable.

Good revisit triggers include measured capacity thresholds, a new regulatory requirement, loss of vendor support, a second independent deployment need, repeated incidents, or a domain boundary becoming independently owned. A trigger invites reassessment; it does not automatically reverse the decision.

## Status lifecycle

Use the destination repository's statuses if they are clear. Otherwise use this small set:

| Status | Meaning |
|---|---|
| `Proposed` | A concrete decision is under consideration but not accepted. |
| `Accepted` | The decision is the current durable intent. |
| `Rejected` | The proposal was considered and deliberately not adopted. |
| `Deprecated` | The decision remains historical but should not guide new work. |
| `Superseded` | A later ADR replaces this decision. |

Do not use operational statuses such as `IN PROGRESS` in an ADR. Implementation progress belongs in the execution system.

Common transitions are `Proposed → Accepted`, `Proposed → Rejected`, and `Accepted → Deprecated` or `Accepted → Superseded`. Follow existing governance if acceptance requires named reviewers or another approval mechanism; do not invent approval.

## Numbering and naming

Before choosing an identifier, list existing ADRs and follow their convention. For sequential identifiers, choose the next available number only after inspection. Do not infer the next number from a partial file listing, and do not renumber accepted history to close gaps.

When concurrent work could claim the same number, prefer the repository's collision-safe convention or stop before materializing an ambiguous identifier. A descriptive filename is acceptable if that is the established convention.

Titles should state the choice or decision topic, not a vague activity. Prefer “Use PostgreSQL for transactional records” over “Database decision.”

## Preserve decision history

An accepted ADR is an historical record. You may correct spelling, broken links, or factual metadata conservatively when that does not alter the decision. Do not rewrite its rationale, consequences, or outcome to reflect a later choice.

To replace an accepted decision:

1. create a new ADR with its own context and rationale;
2. mark the old ADR `Superseded`;
3. add `Superseded by` on the old ADR and `Supersedes` on the new one;
4. preserve both files and any useful relationships;
5. update navigation without erasing the old record.

Use `Deprecated` when a decision should no longer guide new work but no single replacement decision exists.

## Relate ADRs to other documentation

- Architecture documents summarize the current strategy and link ADRs; they should not duplicate complete decision histories.
- Feature documents link decisions that apply specifically to the feature.
- A documentation index may expose accepted, proposed, and superseded records without hiding history.
- `AGENTS.md` may tell agents to search ADRs before introducing a competing decision, but it should not contain the decisions themselves.
- A roadmap may point to a decision gate, but acceptance of an ADR and completion of a milestone are distinct events.

## Handle disagreement and drift

If an ADR conflicts with code, tests, or newer documentation, do not assume which source is correct. Establish:

- the scope and date of each source;
- whether the ADR was accepted, superseded, or only proposed;
- whether implementation intentionally diverged;
- what tests or runtime evidence demonstrate;
- who can accept a corrective decision.

Report the conflict as drift or an unresolved decision. Change the ADR, implementation, or both only within the user's authorized scope.

## Quality check

Before finishing an ADR, verify that:

- the decision is architecturally significant;
- context does not smuggle in an unsupported conclusion;
- options are credible rather than straw alternatives;
- negative consequences and operational cost are explicit;
- `Revisit when` is observable;
- status and relationships are consistent;
- no dates, owners, evidence, or acceptance were invented;
- the file follows local conventions and links resolve.

