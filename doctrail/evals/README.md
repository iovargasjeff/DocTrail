# DocTrail evaluation suite

The numbered Markdown files are adversarial scenario contracts. They preserve the exact user prompt, available fixture/context, expected route and authorization mode, required and prohibited behaviors, and observable pass criteria. Scenarios 01–12 are the original set; 13–19 add requirements-led documentation and scope-control coverage.

Run `python doctrail/scripts/validate_evals.py` (or `npm run evals`) to validate the suite structure and produce a readable summary. Use `--format json` for machine-readable scenario metadata. CI runs this contract check and the deterministic script tests.

This command does **not** invoke an LLM, execute the prompts, or claim that a host passed a behavioral evaluation. A reviewer must run the exact prompt with the scenario fixture in an isolated temporary repository and judge the observable criteria, including allowed file changes. Record host, host version, operating system, invocation method, artifacts, and limitations for behavioral results. `$doctrail` is the canonical explicit invocation shown in the prompts; other hosts may use their own explicit invocation syntax without changing the behavior being assessed. Host-specific integration checks are tracked separately in issue #10.

Inventory scenarios must not read secret values; tool output and changed files should be checked for side effects. Never run an evaluation against a live project or external service unless that scenario explicitly has safe authorization and fixtures.
