from __future__ import annotations

import json
import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock


SCRIPT_DIR = Path(__file__).resolve().parents[1] / "doctrail" / "scripts"
sys.path.insert(0, str(SCRIPT_DIR))

import repository_inventory  # noqa: E402


class RepositoryInventoryTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self.temp_dir.name)

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def write(self, relative: str, content: str = "fixture\n") -> Path:
        path = self.root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return path

    def test_identifies_monorepo_manifests_and_navigation_paths(self) -> None:
        self.write("package.json", '{"workspaces": ["apps/*"]}')
        self.write("pnpm-workspace.yaml", "packages:\n  - apps/*\n")
        self.write("packages/web/package.json", '{"name": "web"}')
        self.write("apps/api/pyproject.toml")
        self.write("apps/api/main.py")
        self.write("apps/api/tests/test_api.py")
        self.write(".github/workflows/ci.yml")
        self.write("docs/02-arquitectura/adr/adr-001.md")

        report = repository_inventory.inventory(self.root)
        notable = report["notable_files"]
        self.assertIn("package.json", notable["manifests"])
        self.assertIn("apps/api/pyproject.toml", notable["manifests"])
        self.assertIn("packages/web/package.json", notable["manifests"])
        self.assertIn("pnpm-workspace.yaml", notable["workspaces"])
        self.assertIn("apps/api/main.py", notable["likely_entrypoints"])
        self.assertIn("apps/api/tests/test_api.py", notable["tests"])
        self.assertIn(".github/workflows/ci.yml", notable["ci_cd"])
        self.assertIn("docs/02-arquitectura/adr/adr-001.md", notable["adrs"])
        self.assertTrue(any(item["language"] == "Python" for item in report["languages"]))

    def test_skips_sensitive_and_generated_paths_without_emitting_secret_values(self) -> None:
        self.write(".env.production", "DO_NOT_EMIT=super-secret-value\n")
        self.write("credentials.json", '{"token":"secret-token-value"}')
        self.write("secrets/private.key", "private-key-value\n")
        self.write("node_modules/library/index.js", "generated dependency\n")
        self.write("src/app.ts", "export const app = true;\n")

        rendered = json.dumps(repository_inventory.inventory(self.root), ensure_ascii=False)
        for secret in ("super-secret-value", "secret-token-value", "private-key-value", ".env.production", "credentials.json", "private.key"):
            self.assertNotIn(secret, rendered)
        self.assertIn("configured_or_generated", rendered)
        self.assertIn("sensitive", rendered)
        self.assertIn("src/app.ts", rendered)

    def test_custom_ignore_accepts_directory_names_and_relative_paths(self) -> None:
        self.write("build/output.js")
        self.write("apps/admin/src/index.ts")
        self.write("apps/api/main.ts")

        report = repository_inventory.inventory(self.root, ignores=("build", "apps/admin"))
        rendered = json.dumps(report)
        self.assertNotIn("build/output.js", rendered)
        self.assertNotIn("apps/admin/src/index.ts", rendered)
        self.assertIn("apps/api/main.ts", rendered)

    def test_limits_mark_scan_partial_and_preserve_stable_order(self) -> None:
        self.write("z.ts")
        self.write("a.py")
        self.write("m.js")

        first = repository_inventory.inventory(self.root, max_files=2)
        second = repository_inventory.inventory(self.root, max_files=2)
        self.assertEqual(first, second)
        self.assertEqual(first["status"], "partial")
        self.assertEqual(first["summary"]["files"], 2)
        self.assertIn("max-files:2", first["scan"]["truncation_reasons"])

    def test_depth_limit_is_reported_as_partial(self) -> None:
        self.write("nested/deeper/main.py")
        report = repository_inventory.inventory(self.root, max_depth=0)
        self.assertEqual(report["status"], "partial")
        self.assertIn("max-depth:0", report["scan"]["truncation_reasons"])

    def test_directory_and_entry_limits_are_reported_with_stable_selection(self) -> None:
        self.write("root/z.ts")
        self.write("root/server.ts")
        self.write("root/index.ts")
        self.write("root/main.ts")
        report = repository_inventory.inventory(
            self.root,
            max_entries_per_directory=2,
        )
        self.assertEqual(report["status"], "partial")
        self.assertIn("max-entries-per-directory:root:2", report["scan"]["truncation_reasons"])
        self.assertEqual(report["summary"]["files"], 2)
        entrypoints = report["notable_files"]["likely_entrypoints"]
        self.assertIn("root/index.ts", entrypoints)
        self.assertIn("root/main.ts", entrypoints)
        self.assertNotIn("root/z.ts", entrypoints)

        directory_limited = repository_inventory.inventory(self.root, max_directories=1)
        self.assertIn("max-directories:1", directory_limited["scan"]["truncation_reasons"])

    def test_permission_errors_are_reported_without_aborting_the_scan(self) -> None:
        self.write("blocked/hidden.py")
        self.write("visible/main.py")
        real_scandir = os.scandir

        def guarded_scandir(path: str | os.PathLike[str]):
            if Path(path).name == "blocked":
                raise PermissionError("fixture permission failure")
            return real_scandir(path)

        with mock.patch.object(repository_inventory.os, "scandir", side_effect=guarded_scandir):
            report = repository_inventory.inventory(self.root)

        self.assertEqual(report["status"], "partial")
        self.assertTrue(any(error["path"] == "blocked" and error["error"] == "PermissionError" for error in report["scan"]["errors"]))
        self.assertIn("visible/main.py", report["notable_files"]["likely_entrypoints"])

    def test_repository_without_git_is_valid_and_explicit(self) -> None:
        self.write("main.py")
        with mock.patch.object(repository_inventory.subprocess, "run", side_effect=FileNotFoundError):
            report = repository_inventory.inventory(self.root)
        self.assertFalse(report["git"]["available"])
        self.assertIsNone(report["git"]["dirty"])

    def test_invalid_scan_limits_are_rejected(self) -> None:
        with self.assertRaises(ValueError):
            repository_inventory.inventory(self.root, max_files=0)
        with self.assertRaises(ValueError):
            repository_inventory.inventory(self.root, max_entries_per_directory=0)


if __name__ == "__main__":
    unittest.main()
