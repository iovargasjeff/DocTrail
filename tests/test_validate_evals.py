from __future__ import annotations

import shutil
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPT_DIR = ROOT / "doctrail" / "scripts"
sys.path.insert(0, str(SCRIPT_DIR))

import validate_evals  # noqa: E402


class ValidateEvalsTests(unittest.TestCase):
    def test_current_nineteen_scenario_contracts_validate(self) -> None:
        report = validate_evals.validate(ROOT / "doctrail" / "evals")
        self.assertEqual(report["status"], "passed", report["issues"])
        self.assertEqual(report["scenario_count"], 19)
        self.assertIn("not executed", report["scope"])

    def test_reports_missing_behavioral_invariant_section(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            evals_root = Path(temp_dir) / "evals"
            shutil.copytree(ROOT / "doctrail" / "evals", evals_root)
            path = evals_root / "01-small-crud.md"
            text = path.read_text(encoding="utf-8")
            text = text.replace("## Required behaviors", "## Missing behaviors", 1)
            path.write_text(text, encoding="utf-8")

            report = validate_evals.validate(evals_root)
            self.assertEqual(report["status"], "failed")
            self.assertTrue(any("Required behaviors" in issue["issue"] for issue in report["issues"]))

    def test_reports_removed_original_case(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            evals_root = Path(temp_dir) / "evals"
            shutil.copytree(ROOT / "doctrail" / "evals", evals_root)
            (evals_root / "01-small-crud.md").unlink()
            report = validate_evals.validate(evals_root)
            self.assertTrue(any("missing: 01" in issue["issue"] for issue in report["issues"]))


if __name__ == "__main__":
    unittest.main()
