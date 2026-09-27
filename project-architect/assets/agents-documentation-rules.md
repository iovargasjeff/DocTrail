<!--
Adapt this block before integrating it into AGENTS.md.
- Add it only with explicit authorization.
- Preserve existing and nested AGENTS.md instructions.
- Match the repository's language, tone, and terminology.
- Keep the base rules below and add only conditional lines whose artifacts exist.
- Replace any retained example path with a verified repository path.
- Remove this template comment before delivery.
- Do not copy architecture content into AGENTS.md.
-->

## Project architecture and documentation

Before making structural, architectural, domain, data-ownership, or public-contract changes:

1. Read the applicable project documentation for the affected area.
2. Do not silently contradict accepted architectural decisions.
3. Keep durable documentation synchronized with accepted changes.
4. Treat discrepancies among documentation, code, and tests as drift to investigate; none wins automatically.

<!-- Optional when a documentation index exists: Read the project documentation index at `path/to/index.md`. -->
<!-- Optional when ADRs exist: Search the ADRs at `path/to/adrs/` before introducing a competing decision. -->

Keep assignments, dates, progress, and other live execution state in the project's execution system rather than architecture documentation.
