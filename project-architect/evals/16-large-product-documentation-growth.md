# Eval 16 — Scale documentation for a large product

## Exact prompt

> Document this established multi-tenant SaaS product for engineers and future coding agents. Keep a navigable baseline, explain the important user and system flows, and show how the web app, mobile client, API, background worker, database, object storage, and payment provider fit together. The docs should grow where it helps; do not create folders just to satisfy a template. No delivery roadmap yet.

## Fixture or available context

- Repository has independently deployed web, mobile, API, and worker applications.
- The API and worker share a PostgreSQL database and object storage; payments integrate with an external provider.
- Existing evidence includes authentication, subscription checkout/webhook, and asynchronous document-processing flows.
- docs/ is absent. A root AGENTS.md exists and has appropriate space for a short docs pointer.
- Mermaid is supported in the documentation renderer.
- User explicitly asks that future coding agents use the documentation; user declines a delivery roadmap for now.

## Expected mode

- Route: `DOCS`, using `REVIEW` to reconstruct the current multi-unit system.
- Mode: MATERIALIZE for the baseline, justified sub-area documents, and conservative navigation pointer.

## Allowed actions

- Inspect instructions, repository structure, application entry points, manifests, tests, deployment config, and integration evidence.
- Create a root documentation index, all four core area overview pages, and focused child documents/indexes where multiple capabilities or independent audiences justify them.
- Add a concise documentation-index pointer to the existing root AGENTS.md, preserving all unrelated guidance.

## Required behaviors

- Always include the baseline three views: C4 system context, functional use-case view, and a sequence for the primary use case.
- Include functional and non-functional requirement registers with stable IDs, acceptance/verification criteria, source/disposition, and traceability to user stories/use cases, design boundaries, and test evidence.
- Inventory supplied capabilities and preserve each as a mapped requirement or explicit future/recommended/pending/rejected/out-of-scope disposition; do not treat a topic-to-page map as requirement coverage.
- Include concise user stories per user-facing capability. Detail use cases and additional sequences for flows with meaningful business rules, permissions, async behavior, failure, or risk; avoid duplicating ordinary behavior.
- Add C4 Container and Deployment views because independent runtime units and deployment topology materially affect understanding. Add component or extra sequence views only for meaningful complexity/risk, not every module or endpoint.
- Separate current, accepted target, proposed, and unverified claims; use repository evidence and do not infer that declared infrastructure is deployed.
- Keep each area's overview useful and navigable. Group related functional details by capability, architecture views when there are several, and operations by service/environment when there are multiple independently maintained documents.
- Keep folder depth shallow, avoid one folder per file or file type, and add child indexes only when they materially help navigation.
- Put significant ADRs in 02-arquitectura/adr/; do not create ADRs merely to fill a folder.
- Add a concise pointer to the existing docs index in AGENTS.md because agent use is explicit; preserve its hierarchy and unrelated instructions.
- Omit 03-planificacion/ and delivery artifacts because the user declined planning.

## Prohibited behaviors

- Do not produce a flat monolithic document set when independent capabilities and operational units warrant navigation.
- Do not create a deep taxonomy, empty folders, a diagramas/ directory for only a few views, or component diagrams mirroring source folders.
- Do not force milestones, a roadmap, or an implementation sequence.
- Do not label proposed infrastructure or inferred behavior as current fact.
- Do not duplicate requirement catalogs or live issue status across several documents.
- Do not rewrite AGENTS.md or copy architecture content into it.

## Files that may be modified

- docs/indice.md
- substantive core overview pages under 00-contexto/, 01-funcional/, 02-arquitectura/, and 04-calidad-operacion/
- focused child documents and child indexes justified by actual content
- accepted ADRs under 02-arquitectura/adr/, only for significant evidenced decisions
- existing root AGENTS.md

## Observable pass criteria

- All four core areas and the root index exist; planning is absent.
- Baseline C4 context, use-case, and primary-sequence views exist, plus justified container/deployment views.
- Each source capability is dispositioned; in-scope requirements have stable IDs and traceable acceptance/verification without unbounded one-file-per-requirement growth.
- Functional and operations knowledge is grouped only where it improves navigation; architecture views remain distinct from ADR history.
- Each view distinguishes verified current facts from target/proposal/unknowns.
- AGENTS.md preserves existing rules and includes only a short, correct docs pointer.
- No unnecessary one-file folders, empty taxonomy, fabricated evidence, or mandatory milestone structure appears.
