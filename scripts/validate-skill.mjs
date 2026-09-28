import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillRoot = resolve(root, "doctrail");
const errors = [];

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function parseYamlFile(path) {
  try {
    return parseYaml(readFileSync(path, "utf8"));
  } catch (error) {
    errors.push(`${relative(root, path)}: invalid YAML (${error.message})`);
    return null;
  }
}

const skillPath = resolve(skillRoot, "SKILL.md");
if (!existsSync(skillPath)) {
  errors.push("doctrail/SKILL.md is missing");
} else {
  const skillText = readFileSync(skillPath, "utf8");
  const frontmatter = skillText.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontmatter) {
    errors.push("doctrail/SKILL.md: YAML frontmatter is missing");
  } else {
    try {
      const metadata = parseYaml(frontmatter[1]);
      if (!metadata || metadata.name !== "doctrail" || typeof metadata.description !== "string" || !metadata.description.trim()) {
        errors.push("doctrail/SKILL.md: frontmatter must define name=doctrail and a non-empty description");
      }
    } catch (error) {
      errors.push(`doctrail/SKILL.md: invalid YAML frontmatter (${error.message})`);
    }
  }
}

for (const path of walk(skillRoot).filter((item) => [".yaml", ".yml"].includes(extname(item).toLowerCase()))) {
  parseYamlFile(path);
}
for (const entry of readdirSync(resolve(root, ".github", "workflows"), { withFileTypes: true })) {
  if (entry.isFile() && [".yaml", ".yml"].includes(extname(entry.name).toLowerCase())) {
    parseYamlFile(resolve(root, ".github", "workflows", entry.name));
  }
}
for (const path of ["package.json", "release-please-config.json", ".release-please-manifest.json"].map((item) => resolve(root, item))) {
  try {
    JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    errors.push(`${relative(root, path)}: invalid JSON (${error.message})`);
  }
}

const linkPattern = /(?<!!)\[[^\]]+\]\(([^)]+)\)/g;
const markdown = [resolve(root, "README.md"), ...walk(skillRoot).filter((item) => extname(item).toLowerCase() === ".md")];
for (const markdownPath of markdown) {
  // Relative links inside templates are output-project examples, not DocTrail source links.
  if (relative(skillRoot, markdownPath).startsWith("assets\\") || relative(skillRoot, markdownPath).startsWith("assets/")) continue;
  const source = readFileSync(markdownPath, "utf8").replace(/<!--.*?-->/gs, "");
  for (const match of source.matchAll(linkPattern)) {
    let raw = match[1].trim();
    if (raw.startsWith("<") && raw.includes(">")) raw = raw.slice(1, raw.indexOf(">"));
    else raw = raw.split(/\s+/)[0];
    if (!raw || raw.startsWith("#") || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(raw)) continue;
    const target = decodeURIComponent(raw.split(/[?#]/, 1)[0]).replaceAll("\\", "/");
    if (!target) continue;
    const resolved = resolve(dirname(markdownPath), target);
    if (resolved !== root && !resolved.startsWith(`${root}/`) && !resolved.startsWith(`${root}\\`)) {
      errors.push(`${relative(root, markdownPath)}: local link escapes the repository (${raw})`);
    } else if (!existsSync(resolved)) {
      errors.push(`${relative(root, markdownPath)}: broken local link (${raw})`);
    }
  }
}

const required = [
  "doctrail/agents/openai.yaml",
  "doctrail/references/requirements-engineering.md",
  "doctrail/assets/functional-template.md",
  "doctrail/assets/project-profile.yaml",
  "doctrail/scripts/validate_docs.py",
  "doctrail/scripts/repository_inventory.py",
];
for (const relativePath of required) {
  if (!existsSync(resolve(root, relativePath))) errors.push(`${relativePath} is missing`);
}

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  console.error(`Skill validation failed with ${errors.length} issue(s).`);
  process.exitCode = 1;
} else {
  console.log("Skill frontmatter, YAML resources, required assets, and local Markdown links passed.");
  console.log("This check validates structure only; it does not establish semantic quality or host behavior.");
}
