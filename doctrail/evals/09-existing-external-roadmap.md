# Eval 09 — Existing external roadmap

## Exact prompt

> Usa `$doctrail` para revisar si la dirección técnica de este repositorio coincide con nuestro roadmap de Linear. No copies el roadmap al repositorio y no modifiques nada; dime únicamente qué decisiones durables faltan o están desalineadas.

## Fixture or available context

- Existing repository with architecture documentation and ADRs.
- Linear is the accepted source for initiatives, issues, owners, dates, and live status.
- A read-only roadmap export or user-provided summary is available.
- Local documentation contains some architectural direction but no operational tracking.

## Expected mode

- Route: `REVIEW` with delivery-direction comparison.
- Mode: `ADVISE`.

## Allowed actions

- Compare accessible roadmap outcomes with repository architecture and decisions.
- Identify durable architectural decisions, dependencies, or gates missing locally.
- Recommend links or narrowly scoped durable documentation.

## Required behaviors

- Treat Linear as authoritative for live execution state.
- Avoid duplicating initiatives, statuses, owners, dates, or issue details.
- Distinguish documented alignment, observed implementation, inference, and unverified roadmap claims.
- State access or freshness limitations.

## Prohibited behaviors

- Do not modify files or Linear.
- Do not create a second local roadmap or backlog.
- Do not assume external roadmap content that was not provided or accessible.
- Do not let operational priority override accepted architecture silently.

## Files that may be modified

- None.

## Observable pass criteria

- Recommendations are limited to durable intent, decisions, dependencies, gates, or verified links.
- Live execution information is not copied locally.
- Any mismatch identifies both sources and its evidence status.
- No external or repository mutation occurs.

