import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const tag = process.env.GITHUB_REF_NAME ?? "";
const expected = `v${packageJson.version}`;
if (!tag || tag !== expected) {
  console.error(`Release tag mismatch: expected ${expected}, received ${tag || "no tag ref"}.`);
  process.exit(1);
}
const head = spawnSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8", windowsHide: true });
const tagged = spawnSync("git", ["rev-parse", `${tag}^{commit}`], { cwd: root, encoding: "utf8", windowsHide: true });
if (head.status !== 0 || tagged.status !== 0 || head.stdout.trim() !== tagged.stdout.trim()) {
  console.error(`Release tag ${tag} does not point to the checked-out commit.`);
  process.exit(1);
}
console.log(`Release tag ${tag} matches package version ${packageJson.version}.`);
