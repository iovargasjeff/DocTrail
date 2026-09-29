#!/usr/bin/env python3
"""Validate the completeness of DocTrail's adversarial eval specifications.

This checks that scenarios are runnable/reviewable contracts. It does not call
an LLM or claim that a host passed a behavioral evaluation.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Optional


SCENARIO_RE = re.compile(r"^(?P<id>\d{2})-.+\.md$")
REQUIRED_SECTIONS = (
    "Exact prompt",
    "Fixture or available context",
    "Expected mode",
    "Required behaviors",
    "Prohibited behaviors",
    "Observable pass criteria",
)
REQUIRED_ORIGINAL_IDS = set(range(1, 13))
REQUIRED_ADDITION_IDS = set(range(13, 22))


def _sections(text: str) -> dict[str, str]:
    result: dict[str, list[str]] = {}
    active: Optional[str] = None
    for line in text.splitlines():
        heading = re.match(r"^##\s+(.+?)\s*$", line)
        if heading:
            active = heading.group(1).strip().casefold()
            result.setdefault(active, [])
        elif active is not None:
            result[active].append(line)
    return {key: "\n".join(lines).strip() for key, lines in result.items()}


def validate(evals_root: Path, *, minimum: int = 21) -> dict[str, Any]:
    issues: list[dict[str, str]] = []
    if not evals_root.is_dir():
        return {
            "status": "failed",
            "scenario_count": 0,
            "scenarios": [],
            "issues": [{"path": str(evals_root), "issue": "eval directory does not exist"}],
            "scope": "scenario-contract validation only; agent behavior is not executed",
        }

    files = sorted(
        (path for path in evals_root.glob("[0-9][0-9]-*.md") if path.is_file()),
        key=lambda path: path.name.casefold(),
    )
    found_ids: dict[int, Path] = {}
    scenarios: list[dict[str, Any]] = []

    for path in files:
        match = SCENARIO_RE.match(path.name)
        if not match:
            continue
        scenario_id = int(match.group("id"))
        if scenario_id in found_ids:
            issues.append({
                "path": path.name,
                "issue": f"duplicate scenario ID {scenario_id:02d}; first defined in {found_ids[scenario_id].name}",
            })
        else:
            found_ids[scenario_id] = path

        try:
            content = path.read_text(encoding="utf-8-sig")
        except (OSError, UnicodeError) as error:
            issues.append({"path": path.name, "issue": f"cannot read UTF-8 scenario: {error.__class__.__name__}"})
            continue

        title = re.search(r"^#\s+Eval\s+(\d{2})\b", content, re.MULTILINE | re.IGNORECASE)
        if not title or int(title.group(1)) != scenario_id:
            issues.append({"path": path.name, "issue": "top-level title ID must match the filename"})

        sections = _sections(content)
        normalized_required = {heading.casefold(): heading for heading in REQUIRED_SECTIONS}
        for normalized, heading in normalized_required.items():
            body = sections.get(normalized, "")
            if not body:
                issues.append({"path": path.name, "issue": f"missing or empty section: {heading}"})
            elif heading in {"Required behaviors", "Prohibited behaviors", "Observable pass criteria"}:
                if not re.search(r"(?m)^\s*(?:[-*]|\d+\.)\s+\S", body):
                    issues.append({"path": path.name, "issue": f"section has no observable list items: {heading}"})

        prompt = sections.get("exact prompt", "")
        if prompt and not re.search(r"(?m)^\s*>\s*\S", prompt):
            issues.append({"path": path.name, "issue": "Exact prompt must include a quoted user prompt"})
        expected_mode = sections.get("expected mode", "")
        if expected_mode and not re.search(r"(?i)\b(?:route|mode)\s*:", expected_mode):
            issues.append({"path": path.name, "issue": "Expected mode must name the route and/or authorization mode"})

        scenarios.append({
            "id": f"{scenario_id:02d}",
            "file": path.name,
            "title": title.group(0).lstrip("# ").strip() if title else None,
            "required_sections": [heading for heading in REQUIRED_SECTIONS if sections.get(heading.casefold())],
        })

    if len(files) < minimum:
        issues.append({"path": str(evals_root), "issue": f"expected at least {minimum} scenarios; found {len(files)}"})
    missing_original = sorted(REQUIRED_ORIGINAL_IDS - set(found_ids))
    if missing_original:
        rendered = ", ".join(f"{value:02d}" for value in missing_original)
        issues.append({"path": str(evals_root), "issue": f"original scenarios 01–12 must remain represented; missing: {rendered}"})
    missing_additions = sorted(REQUIRED_ADDITION_IDS - set(found_ids))
    if missing_additions:
        rendered = ", ".join(f"{value:02d}" for value in missing_additions)
        issues.append({"path": str(evals_root), "issue": f"current expansion scenarios 13–21 are required; missing: {rendered}"})

    guide = evals_root / "README.md"
    if not guide.is_file() or not guide.read_text(encoding="utf-8-sig").strip():
        issues.append({"path": "README.md", "issue": "missing eval guide describing execution limits and host scope"})

    return {
        "status": "passed" if not issues else "failed",
        "scenario_count": len(scenarios),
        "scenarios": scenarios,
        "issues": issues,
        "scope": "scenario-contract validation only; agent behavior is not executed",
    }


def render_markdown(report: dict[str, Any]) -> str:
    lines = [
        "# DocTrail eval contract check",
        "",
        f"- Status: **{report['status']}**",
        f"- Scenarios checked: {report['scenario_count']}",
        f"- Scope: {report['scope']}",
        "",
    ]
    if report["issues"]:
        lines.extend(["## Issues", ""])
        lines.extend(f"- `{item['path']}`: {item['issue']}" for item in report["issues"])
    else:
        lines.extend(["## Scenarios", ""])
        # Keep the human-readable report ASCII-safe in Windows terminals whose
        # active code page cannot render the em dash used in scenario titles.
        lines.extend(
            f"- `{item['id']}`: {str(item['title']).replace('—', '-')} (`{item['file']}`)"
            for item in report["scenarios"]
        )
    lines.append("")
    return "\n".join(lines)


def main(argv: Optional[list[str]] = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("evals_root", nargs="?", type=Path, default=Path(__file__).resolve().parents[1] / "evals")
    parser.add_argument("--minimum", type=int, default=21, help="minimum number of scenario contracts required")
    parser.add_argument("--format", choices=("markdown", "json"), default="markdown")
    args = parser.parse_args(argv)
    if args.minimum < 1:
        parser.error("--minimum must be at least 1")
    report = validate(args.evals_root, minimum=args.minimum)
    if args.format == "json":
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        sys.stdout.write(render_markdown(report))
    return 0 if report["status"] == "passed" else 1


if __name__ == "__main__":
    raise SystemExit(main())
