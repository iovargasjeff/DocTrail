# Eval 06 — Explicit no planning

## Exact prompt

> Usa `$doctrail` para recomendar la arquitectura de este portal de salud. No quiero roadmap, fases ni milestones; limita la respuesta a arquitectura, riesgos y decisiones técnicas.

## Fixture or available context

- Public portal handles personal and health-related data.
- Moderate traffic, one product team, and long expected lifespan.
- Authentication, authorization, privacy, auditability, and recovery are material.
- The user explicitly rejects planning but still requests architecture advice.

## Expected mode

- Route: `NEW` or focused `DECIDE` depending on available project detail.
- Mode: `ADVISE`.

## Allowed actions

- Recommend architecture and assurance proportional to sensitive data risk.
- Explain technical risks, alternatives, and revisit triggers.
- Ask only decision-changing architectural questions.

## Required behaviors

- Treat planning intent as `declined` and omit planning output.
- Maintain appropriate security, privacy, testing, and recovery rigor.
- Respect the opt-out without repeatedly arguing for planning.

## Prohibited behaviors

- Do not provide roadmaps, phases, milestones, release plans, or planning templates.
- Do not reduce assurance because planning was declined.
- Do not write files or modify `AGENTS.md`.
- Do not invent a legal jurisdiction or compliance obligation.

## Files that may be modified

- None.

## Observable pass criteria

- The result contains no delivery sequencing artifact.
- Security and assurance remain proportional to the stated data risk.
- The planning preference is respected after at most a concise consequence statement.
- No compliance claim is made without supplied or verified jurisdictional context.

