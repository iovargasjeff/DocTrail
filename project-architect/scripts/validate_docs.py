#!/usr/bin/env python3
"""Check structural, link, and identifier hygiene for a generated docs tree.

This is a mechanical lint, not a semantic requirements-coverage validator.
It never edits documentation.
"""

from __future__ import annotations

import argparse
import re
import sys
from collections import defaultdict
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from urllib.parse import unquote, urlsplit


CORE_PAGES = (
    "indice.md",
    "00-contexto/indice.md",
    "01-funcional/indice.md",
    "02-arquitectura/indice.md",
    "04-calidad-operacion/indice.md",
)
ID_RE = re.compile(r"\b(?:RNF|RF|RN|HU|CU|TC)-\d{3,}\b")
ID_DEFINITION_RE = re.compile(
    r"^\s*\|\s*((?:RNF|RF|RN|HU|CU|TC)-\d{3,})\s*\|", re.IGNORECASE
)
LINK_RE = re.compile(r"(?<!!)\[[^\]]+\]\(([^)]+)\)")
COMMENT_RE = re.compile(r"<!--.*?-->", re.DOTALL)
FENCE_RE = re.compile(r"```[^\n]*\n.*?```", re.DOTALL)
TRACE_HEADING_RE = re.compile(r"^#{1,6}\s+.*(?:trazabilidad|traceability).*", re.IGNORECASE)
HEADING_RE = re.compile(r"^(#{1,6})\s+.*")


def visible_markdown(text: str, *, keep_code: bool = False) -> str:
    """Drop template comments and, for link scanning, fenced code examples."""
    text = COMMENT_RE.sub("", text)
    if not keep_code:
        text = FENCE_RE.sub("", text)
    return text


def markdown_files(root: Path) -> List[Path]:
    return sorted(path for path in root.rglob("*.md") if path.is_file())


def check_layout(root: Path, *, planning: bool = False) -> List[str]:
    issues: List[str] = []
    for relative in CORE_PAGES:
        path = root / relative
        if not path.is_file():
            issues.append(f"missing required baseline page: {relative}")
        elif not path.read_text(encoding="utf-8-sig").strip():
            issues.append(f"empty required baseline page: {relative}")

    if planning:
        path = root / "03-planificacion" / "indice.md"
        if not path.is_file() or not path.read_text(encoding="utf-8-sig").strip():
            issues.append("planning was requested but 03-planificacion/indice.md is missing or empty")

    functional = root / "01-funcional" / "indice.md"
    architecture = root / "02-arquitectura" / "indice.md"
    quality = root / "04-calidad-operacion" / "indice.md"
    if functional.is_file():
        text = functional.read_text(encoding="utf-8-sig")
        if len(re.findall(r"^```mermaid\s*$", text, re.MULTILINE)) < 2:
            issues.append("01-funcional/indice.md needs editable use-case and primary-flow diagrams")
        if "sequencediagram" not in text.lower():
            issues.append("01-funcional/indice.md is missing the primary sequence diagram")
    if architecture.is_file():
        text = architecture.read_text(encoding="utf-8-sig")
        if "```mermaid" not in text.lower() or "c4" not in text.lower():
            issues.append("02-arquitectura/indice.md needs an editable C4 system-context view or a labeled supported equivalent")
    if quality.is_file() and not quality.read_text(encoding="utf-8-sig").strip():
        issues.append("04-calidad-operacion/indice.md must contain substantive quality/operations information")
    return issues


def definitions(root: Path) -> Tuple[Dict[str, List[Tuple[Path, int]]], List[str]]:
    locations: Dict[str, List[Tuple[Path, int]]] = defaultdict(list)
    issues: List[str] = []
    for path in markdown_files(root):
        text = visible_markdown(path.read_text(encoding="utf-8-sig"), keep_code=True)
        for line_number, line in enumerate(text.splitlines(), start=1):
            match = ID_DEFINITION_RE.match(line)
            if match:
                locations[match.group(1).upper()].append((path, line_number))

    for identifier, occurrences in sorted(locations.items()):
        if len(occurrences) > 1:
            rendered = ", ".join(f"{path.relative_to(root)}:{line}" for path, line in occurrences)
            issues.append(f"identifier {identifier} has multiple register definitions: {rendered}")
    return locations, issues


def check_required_identifiers(root: Path, locations: Dict[str, List[Tuple[Path, int]]]) -> List[str]:
    issues: List[str] = []
    for prefix, label in (("RF", "functional requirement"), ("RNF", "non-functional requirement"), ("HU", "user story"), ("TC", "verification case")):
        if not any(identifier.startswith(prefix + "-") for identifier in locations):
            issues.append(f"no registered {label} ID ({prefix}-###) found")

    functional = root / "01-funcional"
    functional_text = "\n".join(
        path.read_text(encoding="utf-8-sig") for path in markdown_files(functional)
    ) if functional.is_dir() else ""
    if not re.search(r"\bCU-\d{3,}\b", functional_text, re.IGNORECASE):
        issues.append("functional area needs a CU-### identifier in its use-case/capability view")
    if functional.is_dir():
        all_functional = "\n".join(path.read_text(encoding="utf-8-sig") for path in markdown_files(functional))
        if not re.search(r"\btrazabilidad\b|\btraceability\b", all_functional, re.IGNORECASE):
            issues.append("functional area needs a traceability section or equivalent")
    return issues


def check_undefined_identifiers(root: Path, locations: Dict[str, List[Tuple[Path, int]]]) -> List[str]:
    defined = set(locations)
    mentioned: Dict[str, Path] = {}
    for path in markdown_files(root):
        text = visible_markdown(path.read_text(encoding="utf-8-sig"), keep_code=True)
        for identifier in ID_RE.findall(text):
            mentioned.setdefault(identifier.upper(), path)
    issues = []
    for identifier, path in sorted(mentioned.items()):
        if identifier not in defined:
            issues.append(f"{identifier} is referenced but has no register definition (first seen in {path.relative_to(root)})")
    return issues


def check_trace_references(root: Path, locations: Dict[str, List[Tuple[Path, int]]]) -> List[str]:
    """Ensure each RF/RNF register entry is mentioned in a traceability section."""
    sections: List[str] = []
    for path in markdown_files(root):
        lines = visible_markdown(path.read_text(encoding="utf-8-sig"), keep_code=True).splitlines()
        start = None
        level = 0
        for index, line in enumerate(lines):
            heading = HEADING_RE.match(line)
            if start is not None and heading and len(heading.group(1)) <= level:
                sections.append("\n".join(lines[start:index]))
                start = None
            if heading and TRACE_HEADING_RE.match(line):
                start = index
                level = len(heading.group(1))
        if start is not None:
            sections.append("\n".join(lines[start:]))

    trace_text = "\n".join(sections)
    if not trace_text:
        return []  # The missing section is reported by check_required_identifiers.

    issues: List[str] = []
    for prefix in ("RF", "RNF"):
        for identifier in locations:
            if identifier.startswith(prefix + "-") and not re.search(rf"\b{re.escape(identifier)}\b", trace_text, re.IGNORECASE):
                issues.append(f"{identifier} is defined but absent from the traceability section")
    return issues


def check_links(root: Path) -> List[str]:
    issues: List[str] = []
    for markdown_path in markdown_files(root):
        text = visible_markdown(markdown_path.read_text(encoding="utf-8-sig"))
        for match in LINK_RE.finditer(text):
            raw_target = match.group(1).strip()
            if raw_target.startswith("<") and ">" in raw_target:
                target = raw_target[1:raw_target.index(">")]
            else:
                target = raw_target.split()[0]
            parsed = urlsplit(target)
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            path_text = unquote(parsed.path).replace("\\", "/")
            link_path = Path(path_text)
            if not link_path.is_absolute():
                link_path = markdown_path.parent / link_path
            if not link_path.exists():
                line_number = text.count("\n", 0, match.start()) + 1
                issues.append(f"broken local link in {markdown_path.relative_to(root)}:{line_number}: {target}")
    return issues


def validate(root: Path, *, links_only: bool = False, planning: bool = False) -> List[str]:
    if not root.is_dir():
        return [f"documentation root is not a directory: {root}"]
    issues = check_links(root)
    if links_only:
        return issues
    issues.extend(check_layout(root, planning=planning))
    id_locations, id_issues = definitions(root)
    issues.extend(id_issues)
    issues.extend(check_required_identifiers(root, id_locations))
    issues.extend(check_undefined_identifiers(root, id_locations))
    issues.extend(check_trace_references(root, id_locations))
    return issues


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("docs_root", type=Path, help="path to the documentation root")
    parser.add_argument("--links-only", action="store_true", help="check relative Markdown links only; useful for custom layouts")
    parser.add_argument("--planning", action="store_true", help="also require 03-planificacion/indice.md")
    args = parser.parse_args(argv)

    issues = validate(args.docs_root, links_only=args.links_only, planning=args.planning)
    if issues:
        for issue in issues:
            print(f"ERROR: {issue}")
        print(f"Documentation validation failed with {len(issues)} issue(s).")
        return 1
    mode = "link-only" if args.links_only else "structural, identifier, traceability, and link"
    print(f"Documentation {mode} checks passed: {args.docs_root}")
    print("This check cannot establish semantic completeness or verify that documented behavior is implemented.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
