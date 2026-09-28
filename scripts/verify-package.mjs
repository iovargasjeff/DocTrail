import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const npmCli = process.env.npm_execpath;
if (!npmCli) {
  console.error("Run this check through `npm run check:package` so the npm CLI can create the dry-run packlist.");
  process.exit(2);
}

const result = spawnSync(process.execPath, [npmCli, "pack", "--dry-run", "--json"], {
  cwd: root,
  encoding: "utf8",
  windowsHide: true,
  maxBuffer: 16 * 1024 * 1024,
});
if (result.error || result.status !== 0) {
  console.error(result.stderr || result.error?.message || `npm pack exited ${result.status}`);
  process.exit(result.status || 1);
}

let pack;
try {
  pack = JSON.parse(result.stdout);
} catch {
  console.error("npm pack did not return valid JSON in dry-run mode.");
  process.exit(1);
}
const files = new Set((pack[0]?.files ?? []).map((entry) => entry.path.replaceAll("\\", "/")));
const allowed = (path) => (
  ["README.md", "CHANGELOG.md", "LICENSE", "package.json", "assets/doctrail-banner.png"].includes(path)
  || path.startsWith("cli/")
  || path === "doctrail/SKILL.md"
  || path.startsWith("doctrail/agents/")
  || path.startsWith("doctrail/references/")
  || path.startsWith("doctrail/assets/")
  || [
    "doctrail/scripts/repository_inventory.py",
    "doctrail/scripts/validate_docs.py",
  ].includes(path)
);
const unexpected = [...files].filter((path) => !allowed(path)).sort();
const required = [
  "README.md", "CHANGELOG.md", "LICENSE", "package.json", "cli/doctrail.mjs",
  "doctrail/SKILL.md", "doctrail/scripts/repository_inventory.py", "doctrail/scripts/validate_docs.py",
];
const missing = required.filter((path) => !files.has(path));
if (unexpected.length || missing.length) {
  for (const path of unexpected) console.error(`ERROR: unexpected npm package file: ${path}`);
  for (const path of missing) console.error(`ERROR: required npm package file is missing: ${path}`);
  process.exit(1);
}
if ([...files].some((path) => /(?:^|\/)(?:evals|tests|node_modules|__pycache__)(?:\/|$)/i.test(path))) {
  console.error("ERROR: evals, tests, dependencies, and caches must not enter the package archive.");
  process.exit(1);
}

console.log(`npm pack dry-run allowlist passed: ${files.size} files (${pack[0]?.size ?? 0} bytes packed).`);
