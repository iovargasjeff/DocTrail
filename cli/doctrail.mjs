#!/usr/bin/env node

import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { createReadStream, readFileSync, realpathSync } from "node:fs";
import { lstat, readFile, readdir, readlink, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";

const CLI_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(CLI_DIR, "..");
const SKILL_DIR = join(PACKAGE_ROOT, "doctrail");
const INVENTORY_SCRIPT = join(SKILL_DIR, "scripts", "repository_inventory.py");
const INSTALL_STATE_FILE = ".doctrail-install.json";
const STATE_SCHEMA_VERSION = 1;
const REQUIRED_NODE = { major: 22, minor: 20, patch: 0 };
const MAX_SKILL_FILES = 2_000;
const MAX_SKILL_BYTES = 50 * 1024 * 1024;

const require = createRequire(import.meta.url);

function versionAtLeast(actual, required) {
  const match = String(actual).match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return false;
  const current = match.slice(1).map(Number);
  return current[0] > required.major
    || (current[0] === required.major && current[1] > required.minor)
    || (current[0] === required.major && current[1] === required.minor && current[2] >= required.patch);
}

export function parseArgs(argv) {
  const knownCommands = new Set(["install", "scan", "doctor", "update", "uninstall", "help"]);
  const args = [...argv];
  let command = "install";
  if (args[0] && knownCommands.has(args[0])) command = args.shift();
  else if (args[0] && !args[0].startsWith("-")) {
    throw new Error(`Unknown command: ${args[0]}. Run "doctrail --help" for usage.`);
  }

  const options = { scope: "project", agents: [], ignores: [], format: "markdown", yes: false, force: false, json: false };
  const positionals = [];
  const valueOptions = new Set(["--agent", "--format", "--max-depth", "--max-files", "--max-directories", "--max-entries-per-directory", "--max-file-size", "--ignore"]);
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--version" || arg === "-V") {
      options.version = true;
    } else if (arg === "--global" || arg === "-g") {
      options.scope = "global";
    } else if (arg === "--project" || arg === "-p") {
      options.scope = "project";
    } else if (arg === "--yes" || arg === "-y") {
      options.yes = true;
    } else if (arg === "--force") {
      options.force = true;
    } else if (arg === "--json") {
      options.json = true;
    } else if (valueOptions.has(arg)) {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${arg} requires a value.`);
      index += 1;
      if (arg === "--agent") options.agents.push(value);
      else if (arg === "--ignore") options.ignores.push(value);
      else if (arg === "--format") options.format = value;
      else if (arg === "--max-depth") options.maxDepth = value;
      else if (arg === "--max-files") options.maxFiles = value;
      else if (arg === "--max-directories") options.maxDirectories = value;
      else if (arg === "--max-entries-per-directory") options.maxEntriesPerDirectory = value;
      else if (arg === "--max-file-size") options.maxFileSize = value;
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}. Run "doctrail --help" for usage.`);
    } else {
      positionals.push(arg);
    }
  }

  if (options.version) command = "version";
  if (options.help) command = "help";
  if (options.format !== "markdown" && options.format !== "json") {
    throw new Error("--format must be markdown or json.");
  }
  if (options.json && command !== "doctor") throw new Error("--json is currently supported only by doctor.");
  if (command === "scan" && positionals.length > 1) throw new Error("scan accepts at most one repository path.");
  if (command !== "scan" && positionals.length > 0) throw new Error(`${command} does not accept positional arguments.`);
  for (const [key, value] of [
    ["--max-depth", options.maxDepth], ["--max-files", options.maxFiles],
    ["--max-directories", options.maxDirectories], ["--max-entries-per-directory", options.maxEntriesPerDirectory],
    ["--max-file-size", options.maxFileSize],
  ]) {
    if (value !== undefined && (!/^\d+$/.test(String(value)) || Number(value) > Number.MAX_SAFE_INTEGER)) {
      throw new Error(`${key} must be a non-negative integer.`);
    }
  }
  for (const [key, value] of [["--max-files", options.maxFiles], ["--max-directories", options.maxDirectories], ["--max-entries-per-directory", options.maxEntriesPerDirectory]]) {
    if (value !== undefined && Number(value) < 1) throw new Error(`${key} must be at least 1.`);
  }
  return { command, options, positionals };
}

function usage() {
  return `DocTrail — project architecture and documentation CLI

Usage:
  doctrail [install] [--global|--project] [--agent <name>] [--yes]
  doctrail scan [path] [--format markdown|json] [--max-depth N] [--max-files N]
               [--max-directories N] [--max-entries-per-directory N]
               [--max-file-size BYTES] [--ignore PATH_OR_NAME]
  doctrail doctor [--global|--project] [--json]
  doctrail update [--global|--project] [--agent <name>] [--force]
  doctrail uninstall [--global|--project] [--agent <name>] [--force]

No command defaults to install. Installation and updates use the official
"skills" CLI; agent path mappings are not maintained by DocTrail.

Use --force only after reviewing local changes. Non-interactive update/removal
stops rather than overwriting or deleting an unverified installation.
Set DOCTRAIL_PYTHON to select a Python executable for scan/doctor.
DocTrail disables the upstream installer telemetry for commands it runs.
`;
}

function skillsCliPath() {
  try {
    const packageJson = require.resolve("skills/package.json");
    const path = join(dirname(packageJson), "bin", "cli.mjs");
    return path;
  } catch {
    throw new Error("The official 'skills' CLI dependency is missing. Reinstall DocTrail with npm/npx and try again.");
  }
}

function runProcess(executable, args, { cwd = process.cwd(), env = process.env, maxBuffer = 16 * 1024 * 1024 } = {}) {
  const result = spawnSync(executable, args, {
    cwd,
    env,
    encoding: "utf8",
    windowsHide: true,
    maxBuffer,
    shell: false,
  });
  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    error: result.error,
  };
}

function skillsEnvironment() {
  return { ...process.env, DISABLE_TELEMETRY: "1", DO_NOT_TRACK: "1" };
}

function parseLastJsonArray(text) {
  for (let index = text.lastIndexOf("["); index >= 0; index = text.lastIndexOf("[", index - 1)) {
    try {
      const parsed = JSON.parse(text.slice(index).trim());
      if (Array.isArray(parsed) && (parsed.length === 0 || parsed.every((item) => (
        item && typeof item === "object" && !Array.isArray(item) && typeof item.status === "string"
      )))) return parsed;
    } catch {
      // Ignore non-JSON progress output before the final machine-readable array.
    }
  }
  throw new Error("The official skills CLI did not return a valid JSON array.");
}

function runSkills(args, options = {}) {
  const result = runProcess(process.execPath, [skillsCliPath(), ...args], {
    cwd: options.cwd ?? process.cwd(),
    env: skillsEnvironment(),
  });
  if (result.error) throw new Error(`Could not start the official skills CLI: ${result.error.message}`);
  if (options.forwardOutput !== false) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  }
  return result;
}

function readSkillsList(options = {}) {
  const result = runSkills(["list", "--json"], { ...options, forwardOutput: false });
  if (result.status !== 0) {
    throw new Error(`Could not inspect installed skills (skills list exited ${result.status}).`);
  }
  try {
    const parsed = JSON.parse(result.stdout);
    if (!Array.isArray(parsed)) throw new Error("Expected a JSON array.");
    return parsed;
  } catch {
    throw new Error("The official skills CLI returned invalid output for 'skills list --json'.");
  }
}

function scopedInstallations(options = {}) {
  const scope = options.scope ?? "project";
  const entries = readSkillsList(options).filter((item) => (
    item && String(item.name).toLowerCase() === "doctrail" && item.scope === scope && typeof item.path === "string"
  ));
  const unique = new Map();
  for (const entry of entries) {
    const absolutePath = resolve(entry.path);
    const key = process.platform === "win32" ? absolutePath.toLowerCase() : absolutePath;
    const current = unique.get(key);
    if (current) current.agents = [...new Set([...(current.agents ?? []), ...(entry.agents ?? [])])];
    else unique.set(key, { ...entry, path: absolutePath });
  }
  return [...unique.values()];
}

export async function hashSkillTree(root) {
  const rootPath = resolve(root);
  const hash = createHash("sha256");
  let files = 0;
  let totalBytes = 0;

  async function visit(directory, relativeDirectory = "") {
    const entries = await readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name, "en"));
    for (const entry of entries) {
      if (!relativeDirectory && entry.name === INSTALL_STATE_FILE) continue;
      const relativePath = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
      const absolutePath = join(directory, entry.name);
      const info = await lstat(absolutePath);
      if (info.isSymbolicLink()) {
        hash.update(`symlink\0${relativePath}\0`);
        hash.update(await readlink(absolutePath));
        hash.update("\0");
      } else if (info.isDirectory()) {
        hash.update(`directory\0${relativePath}\0`);
        await visit(absolutePath, relativePath);
      } else if (info.isFile()) {
        files += 1;
        totalBytes += info.size;
        if (files > MAX_SKILL_FILES || totalBytes > MAX_SKILL_BYTES) {
          throw new Error("The installed skill exceeds safe integrity-scan limits; inspect it manually before update or removal.");
        }
        hash.update(`file\0${relativePath}\0${info.size}\0`);
        for await (const chunk of createReadStream(absolutePath)) hash.update(chunk);
        hash.update("\0");
      }
    }
  }

  await visit(rootPath);
  return { hash: hash.digest("hex"), files, bytes: totalBytes };
}

function statePath(skillPath) {
  return join(skillPath, INSTALL_STATE_FILE);
}

async function loadState(skillPath) {
  try {
    const content = await readFile(statePath(skillPath), "utf8");
    const state = JSON.parse(content);
    if (state.schemaVersion !== STATE_SCHEMA_VERSION || typeof state.contentHash !== "string") return null;
    return state;
  } catch {
    return null;
  }
}

async function writeState(skillPath, packageVersion) {
  const tree = await hashSkillTree(skillPath);
  const state = {
    schemaVersion: STATE_SCHEMA_VERSION,
    packageVersion,
    contentHash: tree.hash,
    fileCount: tree.files,
  };
  await writeFile(statePath(skillPath), `${JSON.stringify(state, null, 2)}\n`, { encoding: "utf8" });
  return state;
}

async function inspectInstallation(entry) {
  let stat;
  try {
    stat = await lstat(entry.path);
  } catch {
    return { ...entry, state: null, integrity: "missing", currentHash: null };
  }
  if (!stat.isDirectory() || stat.isSymbolicLink()) {
    return { ...entry, state: null, integrity: "unverified", currentHash: null };
  }
  const state = await loadState(entry.path);
  try {
    const tree = await hashSkillTree(entry.path);
    return {
      ...entry,
      state,
      currentHash: tree.hash,
      integrity: !state ? "unmanaged" : tree.hash === state.contentHash ? "ok" : "modified",
    };
  } catch (error) {
    return { ...entry, state, integrity: "unverified", currentHash: null, error: error.message };
  }
}

async function confirmLocalChanges(installations, action, force) {
  const risky = installations.filter((item) => item.integrity !== "ok");
  if (risky.length === 0) return true;
  if (force) return true;
  const summary = risky.map((item) => `${item.path} (${item.integrity})`).join("\n  ");
  const message = `The following DocTrail installation(s) are modified or unmanaged:\n  ${summary}\n${action} can replace local files. Continue? [y/N] `;
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    console.error(`${message.trim()}\nStopped. Review the installation and pass --force to explicitly accept this change.`);
    return false;
  }
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await prompt.question(message);
    return ["y", "yes"].includes(answer.trim().toLowerCase());
  } finally {
    prompt.close();
  }
}

function assertNodeRuntime() {
  if (versionAtLeast(process.versions.node, REQUIRED_NODE)) return;
  throw new Error(`DocTrail's installer requires Node.js 22.20.0 or later; found ${process.versions.node}.`);
}

function npmPackageVersion() {
  const packageJson = JSON.parse(readFileSync(join(PACKAGE_ROOT, "package.json"), "utf8"));
  return packageJson.version;
}

function skillsAddArgs(options, { confirm = false } = {}) {
  const args = ["add", SKILL_DIR, "--skill", "doctrail", "--copy"];
  if ((options.scope ?? "project") === "global") args.push("--global");
  if (options.agents?.length) args.push("--agent", ...options.agents);
  if (confirm || options.yes) args.push("--yes", "--json");
  return args;
}

async function install(options) {
  assertNodeRuntime();
  const currentVersion = npmPackageVersion();
  const existing = scopedInstallations(options).map((entry) => ({ entry, inspect: null }));
  if (existing.length) {
    const states = await Promise.all(existing.map(async (item) => ({ ...item, inspect: await inspectInstallation(item.entry) })));
    const changed = states.filter(({ inspect }) => inspect.integrity !== "ok");
    if (changed.length) {
      console.error("A DocTrail directory already exists but its integrity is unverified or modified. `install` did not overwrite it; inspect with `doctor` and use `update --force` only if you accept the changes.");
      return 2;
    }
    const sameVersion = states.every(({ inspect }) => inspect.state.packageVersion === currentVersion);
    if (sameVersion) console.log(`DocTrail ${currentVersion} is already installed in ${options.scope} scope; no files changed.`);
    else console.log(`DocTrail is already installed in ${options.scope} scope. Run "doctrail update" to move to ${currentVersion}.`);
    return 0;
  }

  const result = runSkills(skillsAddArgs(options));
  if (result.status !== 0) return result.status;
  const installations = scopedInstallations(options);
  if (!installations.length) {
    console.error("The skills CLI finished without a discoverable DocTrail installation. Check the selected agent and scope.");
    return 1;
  }
  for (const entry of installations) await writeState(entry.path, currentVersion);
  console.log(`DocTrail ${currentVersion} installed in ${options.scope} scope.`);
  return 0;
}

async function update(options) {
  assertNodeRuntime();
  const currentVersion = npmPackageVersion();
  const entries = scopedInstallations(options);
  if (!entries.length) {
    console.error(`No DocTrail installation found in ${options.scope} scope. Run "doctrail install" first.`);
    return 1;
  }
  const inspected = await Promise.all(entries.map(inspectInstallation));
  if (!await confirmLocalChanges(inspected, "Updating DocTrail", options.force)) return 2;

  const result = runSkills(skillsAddArgs(options, { confirm: true }));
  if (result.status !== 0) return result.status;
  let installedPaths;
  try {
    installedPaths = new Set(parseLastJsonArray(result.stdout)
      .filter((item) => item.status === "installed" && typeof item.path === "string")
      .map((item) => {
        const value = resolve(item.path);
        return process.platform === "win32" ? value.toLowerCase() : value;
      }));
  } catch (error) {
    console.error(`Could not verify the update result: ${error.message}`);
    return 1;
  }
  const refreshed = scopedInstallations(options);
  let updated = 0;
  for (const entry of refreshed) {
    const key = process.platform === "win32" ? entry.path.toLowerCase() : entry.path;
    if (!installedPaths.has(key)) continue;
    const state = await writeState(entry.path, currentVersion);
    if (state.packageVersion === currentVersion) updated += 1;
  }
  if (updated === 0) {
    console.error("The skills CLI did not update a discoverable DocTrail copy. Use `skills list --json` to inspect its target.");
    return 1;
  }
  console.log(`DocTrail updated to ${currentVersion} in ${options.scope} scope (${updated} installation path${updated === 1 ? "" : "s"}).`);
  return 0;
}

async function uninstall(options) {
  assertNodeRuntime();
  const entries = scopedInstallations(options);
  if (!entries.length) {
    console.log(`DocTrail is not installed in ${options.scope} scope; nothing to remove.`);
    return 0;
  }
  const inspected = await Promise.all(entries.map(inspectInstallation));
  if (!await confirmLocalChanges(inspected, "Uninstalling DocTrail", options.force)) return 2;

  const args = ["remove", "doctrail", "--yes"];
  if (options.scope === "global") args.push("--global");
  if (options.agents?.length) args.push("--agent", ...options.agents);
  const result = runSkills(args);
  if (result.status !== 0) return result.status;
  const remaining = scopedInstallations(options);
  if (remaining.length && !options.agents?.length) {
    console.error("The skills CLI reported success, but DocTrail is still listed in this scope. Check the selected agent and run `skills list --json`.");
    return 1;
  }
  console.log(options.agents?.length
    ? `DocTrail removed for the selected agent(s) in ${options.scope} scope. Other skill names were not selected.`
    : `DocTrail removed from ${options.scope} scope. Other skill names were not selected.`);
  return 0;
}

function pythonCandidate(executable, prefixArgs = []) {
  const result = runProcess(executable, [...prefixArgs, "--version"], { maxBuffer: 1024 * 1024 });
  const output = `${result.stdout}\n${result.stderr}`;
  const match = output.match(/Python\s+(\d+)\.(\d+)\.(\d+)/i);
  if (result.error || result.status !== 0 || !match) return null;
  const version = match.slice(1).map(Number);
  return { executable, prefixArgs, version: version.join("."), supported: version[0] > 3 || (version[0] === 3 && version[1] >= 11) };
}

function findPython() {
  const explicit = process.env.DOCTRAIL_PYTHON;
  const candidates = explicit
    ? [[explicit, /(?:^|[\\/])py(?:\.exe)?$/i.test(explicit) ? ["-3"] : []]]
    : process.platform === "win32"
      ? [["py", ["-3"]], ["python", []]]
      : [["python3", []], ["python", []]];
  for (const [executable, prefixArgs] of candidates) {
    const info = pythonCandidate(executable, prefixArgs);
    if (info?.supported) return info;
  }
  return null;
}

function scan(options, positionals) {
  assertNodeRuntime();
  const python = findPython();
  if (!python) {
    console.error("`scan` requires Python 3.11 or later. Install it or set DOCTRAIL_PYTHON to its executable path.");
    return 2;
  }
  const target = resolve(positionals[0] ?? process.cwd());
  const args = [...python.prefixArgs, INVENTORY_SCRIPT, target, "--format", options.format];
  for (const [flag, value] of [
    ["--max-depth", options.maxDepth], ["--max-files", options.maxFiles],
    ["--max-directories", options.maxDirectories], ["--max-entries-per-directory", options.maxEntriesPerDirectory],
    ["--max-file-size", options.maxFileSize],
  ]) {
    if (value !== undefined) args.push(flag, String(value));
  }
  for (const ignored of options.ignores ?? []) args.push("--ignore", ignored);
  const result = runProcess(python.executable, args, { cwd: process.cwd(), maxBuffer: 16 * 1024 * 1024 });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) {
    console.error(`Could not start Python: ${result.error.message}`);
    return 2;
  }
  return result.status;
}

async function doctor(options) {
  const packageJson = JSON.parse(readFileSync(join(PACKAGE_ROOT, "package.json"), "utf8"));
  const nodeSupported = versionAtLeast(process.versions.node, REQUIRED_NODE);
  let bundle;
  try {
    const skillStat = await lstat(join(SKILL_DIR, "SKILL.md"));
    if (!skillStat.isFile()) throw new Error("SKILL.md is not a regular file");
    const tree = await hashSkillTree(SKILL_DIR);
    bundle = { status: "ok", files: tree.files, bytes: tree.bytes, hash: tree.hash };
  } catch (error) {
    bundle = { status: "invalid", error: error.message };
  }
  const python = findPython();
  let entries = [];
  let listError = null;
  try {
    entries = scopedInstallations(options);
  } catch (error) {
    listError = error.message;
  }
  const installations = await Promise.all(entries.map(async (entry) => {
    const item = await inspectInstallation(entry);
    return {
      scope: item.scope,
      path: item.path,
      agents: item.agents ?? [],
      integrity: item.integrity,
      installedVersion: item.state?.packageVersion ?? null,
      updateAvailable: Boolean(item.state?.packageVersion && item.state.packageVersion !== packageJson.version),
    };
  }));
  const checks = [
    { name: "node", status: nodeSupported ? "ok" : "failed", actual: process.versions.node, required: ">=22.20.0" },
    { name: "skill-bundle", status: bundle.status, files: bundle.files ?? null, bytes: bundle.bytes ?? null },
    { name: "python-scan-runtime", status: python ? "ok" : "warning", actual: python?.version ?? null, required: ">=3.11 (scan only)" },
    { name: "installation", status: installations.length ? "ok" : "missing", count: installations.length, scope: options.scope },
  ];
  if (listError) checks.push({ name: "skills-cli", status: "failed", error: listError });
  const report = {
    package: { name: packageJson.name, version: packageJson.version },
    checks,
    installations,
    notes: [
      "Updates are explicit; publishing a new npm version does not update installed skill copies.",
      "Integrity compares each installed copy to its locally recorded baseline; local customization is reported, not silently treated as corruption.",
      "No telemetry is collected by DocTrail; the upstream skills CLI is run with telemetry disabled.",
    ],
  };
  const failed = checks.some((item) => ["failed", "missing"].includes(item.status))
    || installations.some((item) => item.integrity === "modified" || item.integrity === "unverified");
  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`DocTrail doctor — ${packageJson.version}`);
    for (const check of checks) {
      const marker = check.status === "ok" ? "✓" : check.status === "warning" ? "!" : "✗";
      console.log(`${marker} ${check.name}: ${check.actual ?? check.status}${check.required ? ` (requires ${check.required})` : ""}`);
    }
    for (const item of installations) {
      console.log(`  ${item.integrity === "ok" ? "✓" : item.integrity === "modified" ? "!" : "✗"} ${item.scope}: ${item.path} — ${item.installedVersion ?? "unmanaged"}${item.updateAvailable ? " (update available)" : ""}`);
    }
    if (python) console.log(`Python ${python.version} detected; scan is available.`);
    else console.log("Python 3.11+ not detected; install it or set DOCTRAIL_PYTHON to enable `scan`. ");
    for (const note of report.notes) console.log(`- ${note}`);
  }
  return failed ? 1 : 0;
}

export async function main(argv = process.argv.slice(2)) {
  let parsed;
  try {
    parsed = parseArgs(argv);
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    return 2;
  }
  if (parsed.command === "help") {
    console.log(usage());
    return 0;
  }
  if (parsed.command === "version") {
    console.log(npmPackageVersion());
    return 0;
  }
  try {
    if (parsed.command === "install") return await install(parsed.options);
    if (parsed.command === "scan") return scan(parsed.options, parsed.positionals);
    if (parsed.command === "doctor") return await doctor(parsed.options);
    if (parsed.command === "update") return await update(parsed.options);
    if (parsed.command === "uninstall") return await uninstall(parsed.options);
    console.error(`ERROR: Unsupported command: ${parsed.command}`);
    return 2;
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    return 1;
  }
}

if (process.argv[1]
  && realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url))) {
  const exitCode = await main();
  process.exitCode = exitCode;
}
