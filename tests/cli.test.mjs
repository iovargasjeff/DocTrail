import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { hashSkillTree, parseArgs } from "../cli/doctrail.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const cli = join(root, "cli", "doctrail.mjs");
const packageVersion = JSON.parse(await readFile(join(root, "package.json"), "utf8")).version;

function runCli(args, cwd, extraEnv = {}) {
  return spawnSync(process.execPath, [cli, ...args], {
    cwd,
    env: { ...process.env, DISABLE_TELEMETRY: "1", DO_NOT_TRACK: "1", ...extraEnv },
    encoding: "utf8",
    timeout: 120_000,
    maxBuffer: 16 * 1024 * 1024,
    windowsHide: true,
  });
}

test("CLI parser routes no-subcommand invocations to install and validates bounded scan flags", () => {
  assert.equal(parseArgs([]).command, "install");
  assert.deepEqual(parseArgs(["--global", "--agent", "codex"]).options, {
    scope: "global", agents: ["codex"], ignores: [], format: "markdown", yes: false, force: false, json: false,
  });
  const scan = parseArgs(["scan", ".", "--format", "json", "--max-files", "5", "--max-directories", "20", "--ignore", "node_modules"]);
  assert.equal(scan.command, "scan");
  assert.equal(scan.positionals[0], ".");
  assert.equal(scan.options.format, "json");
  assert.equal(scan.options.maxFiles, "5");
  assert.equal(scan.options.maxDirectories, "20");
  assert.throws(() => parseArgs(["scan", "--max-files", "nope"]), /non-negative integer/);
  assert.throws(() => parseArgs(["scan", "--max-files", "0"]), /at least 1/);
  assert.throws(() => parseArgs(["unknown"]), /Unknown command/);
});

test("skill integrity hash is deterministic and detects changed, added, and removed files", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "doctrail-hash-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(join(directory, "references"));
  await writeFile(join(directory, "SKILL.md"), "base\n");
  await writeFile(join(directory, "references", "a.md"), "ref\n");
  const original = await hashSkillTree(directory);
  assert.deepEqual(await hashSkillTree(directory), original);
  await writeFile(join(directory, ".doctrail-install.json"), "state is intentionally excluded\n");
  assert.deepEqual(await hashSkillTree(directory), original);
  await writeFile(join(directory, "references", "a.md"), "changed\n");
  assert.notEqual((await hashSkillTree(directory)).hash, original.hash);
  await writeFile(join(directory, "references", "a.md"), "ref\n");
  await writeFile(join(directory, "custom.md"), "extra\n");
  assert.notEqual((await hashSkillTree(directory)).hash, original.hash);
  await rm(join(directory, "custom.md"));
  assert.equal((await hashSkillTree(directory)).hash, original.hash);
});

test("scan supports JSON and gives a clear missing-Python error", async (t) => {
  const workspace = await mkdtemp(join(tmpdir(), "doctrail-scan-test-"));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  await writeFile(join(workspace, "main.ts"), "export {};\n");

  const scan = runCli(["scan", workspace, "--format", "json"], workspace);
  assert.equal(scan.status, 0, scan.stderr);
  const report = JSON.parse(scan.stdout);
  assert.equal(report.summary.files, 1);
  assert.equal(report.notable_files.likely_entrypoints.includes("main.ts"), true);
  assert.equal(report.limits.file_contents_read, 0);

  const missingPython = runCli(["scan", workspace], workspace, { DOCTRAIL_PYTHON: join(workspace, "missing-python") });
  assert.equal(missingPython.status, 2);
  assert.match(missingPython.stderr, /requires Python 3\.11 or later/);
});

test("install, doctor, safe update, forced update, and uninstall are scoped to DocTrail", { timeout: 180_000 }, async (t) => {
  const workspace = await mkdtemp(join(tmpdir(), "doctrail-cli-test-"));
  t.after(() => rm(workspace, { recursive: true, force: true }));

  const install = runCli(["install", "--project", "--agent", "codex", "--yes"], workspace);
  assert.equal(install.status, 0, `${install.stdout}\n${install.stderr}`);
  const skillDir = join(workspace, ".agents", "skills", "doctrail");
  const installedSkill = join(skillDir, "SKILL.md");
  assert.equal((await readFile(installedSkill, "utf8")).includes("# DocTrail"), true);
  const statePath = join(skillDir, ".doctrail-install.json");
  const state = JSON.parse(await readFile(statePath, "utf8"));
  assert.equal(state.packageVersion, packageVersion);

  const repeatedInstall = runCli(["install", "--project", "--agent", "codex", "--yes"], workspace);
  assert.equal(repeatedInstall.status, 0, repeatedInstall.stderr);
  assert.match(repeatedInstall.stdout, /already installed/);

  const modification = "Local customization must be preserved until forced.\n";
  await writeFile(join(skillDir, "local-notes.md"), modification);
  const guardedInstall = runCli(["install", "--project", "--agent", "codex", "--yes"], workspace);
  assert.equal(guardedInstall.status, 2);
  assert.equal(await readFile(join(skillDir, "local-notes.md"), "utf8"), modification);

  const doctor = runCli(["doctor", "--project", "--json"], workspace);
  assert.equal(doctor.status, 1);
  const doctorReport = JSON.parse(doctor.stdout);
  assert.equal(doctorReport.installations[0].integrity, "modified");

  const guardedUpdate = runCli(["update", "--project", "--agent", "codex"], workspace);
  assert.equal(guardedUpdate.status, 2);
  assert.equal(await readFile(join(skillDir, "local-notes.md"), "utf8"), modification);

  const update = runCli(["update", "--project", "--agent", "codex", "--force"], workspace);
  assert.equal(update.status, 0, `${update.stdout}\n${update.stderr}`);
  assert.equal((await readdir(skillDir)).includes("local-notes.md"), false);
  assert.equal(JSON.parse(await readFile(statePath, "utf8")).packageVersion, packageVersion);

  const otherSkill = join(workspace, ".agents", "skills", "other-skill");
  await mkdir(otherSkill, { recursive: true });
  await writeFile(join(otherSkill, "SKILL.md"), "---\nname: other-skill\ndescription: Test fixture\n---\n");
  const uninstall = runCli(["uninstall", "--project"], workspace);
  assert.equal(uninstall.status, 0, `${uninstall.stdout}\n${uninstall.stderr}`);
  assert.equal(await readdir(join(workspace, ".agents", "skills")).then((items) => items.includes("other-skill")), true);
  const repeatedUninstall = runCli(["uninstall", "--project"], workspace);
  assert.equal(repeatedUninstall.status, 0);
});

test("packed npm artifact installs and runs without repository-only files", { timeout: 240_000 }, async (t) => {
  const packRoot = await mkdtemp(join(tmpdir(), "doctrail-pack-test-"));
  const installRoot = join(packRoot, "consumer");
  const workspace = join(installRoot, "workspace");
  await mkdir(workspace, { recursive: true });
  t.after(() => rm(packRoot, { recursive: true, force: true }));
  assert.ok(process.env.npm_execpath, "npm_execpath is available when tests run through npm");

  const packed = spawnSync(process.execPath, [process.env.npm_execpath, "pack", "--json", "--pack-destination", packRoot], {
    cwd: root,
    encoding: "utf8",
    timeout: 120_000,
    maxBuffer: 8 * 1024 * 1024,
  });
  assert.equal(packed.status, 0, packed.stderr);
  const tarballInfo = JSON.parse(packed.stdout)[0];
  const tarball = join(packRoot, tarballInfo.filename);
  assert.ok(tarballInfo.files.some((item) => item.path === "doctrail/scripts/repository_inventory.py"));
  assert.equal(tarballInfo.files.some((item) => item.path.startsWith("doctrail/evals/")), false);

  const installed = spawnSync(process.execPath, [
    process.env.npm_execpath, "install", "--prefix", installRoot, "--ignore-scripts", "--no-audit", "--no-fund", tarball,
  ], { cwd: workspace, encoding: "utf8", timeout: 180_000, maxBuffer: 8 * 1024 * 1024 });
  assert.equal(installed.status, 0, `${installed.stdout}\n${installed.stderr}`);
  const packagedCli = join(installRoot, "node_modules", "@iovargasjeff", "doctrail", "cli", "doctrail.mjs");
  const runPackaged = (args) => spawnSync(process.execPath, [packagedCli, ...args], {
    cwd: workspace,
    encoding: "utf8",
    timeout: 120_000,
    maxBuffer: 8 * 1024 * 1024,
    windowsHide: true,
    env: { ...process.env, DISABLE_TELEMETRY: "1", DO_NOT_TRACK: "1" },
  });

  const install = runPackaged(["--agent", "codex", "--yes"]);
  assert.equal(install.status, 0, `${install.stdout}\n${install.stderr}`);
  const doctor = runPackaged(["doctor", "--json"]);
  assert.equal(doctor.status, 0, doctor.stderr);
  assert.ok(doctor.stdout.trim(), `doctor --json emitted no report. stderr: ${doctor.stderr}`);
  assert.equal(JSON.parse(doctor.stdout).installations[0].integrity, "ok");
  const update = runPackaged(["update", "--agent", "codex"]);
  assert.equal(update.status, 0, `${update.stdout}\n${update.stderr}`);
  const uninstall = runPackaged(["uninstall"]);
  assert.equal(uninstall.status, 0, `${uninstall.stdout}\n${uninstall.stderr}`);
});
