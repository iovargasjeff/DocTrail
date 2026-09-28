<!--
Adapt this block before integrating it into AGENTS.md.
- Add a navigation pointer when the user explicitly says the docs are for future AI/coding-agent use; this authorizes only the pointer.
- If there is no suitable instructions file, ask before creating one.
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

For project purpose, behavior, architecture, and operations, start at [docs/indice.md](docs/indice.md) and follow the links relevant to the change. Read the applicable area page before editing; consult architecture decisions when changing a boundary, data ownership, integration, or public contract.

Keep assignments, dates, progress, and other live execution state in the project's execution system rather than architecture documentation.
