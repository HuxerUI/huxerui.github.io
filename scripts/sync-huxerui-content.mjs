import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { resolveHuxerUISource } from "./resolve-huxerui-source.mjs";
import { loadSourceConfig, normalizePath, websiteRoot } from "./source-config.mjs";

function escapeYaml(value) {
  return JSON.stringify(value);
}

async function expandDocumentation(source, patterns) {
  const files = [];
  for (const pattern of patterns) {
    if (!pattern.endsWith("/*.md")) {
      files.push(pattern);
      continue;
    }
    const directory = pattern.slice(0, -"/*.md".length);
    const entries = await readdir(path.join(source, "docs", directory), { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(normalizePath(path.join(directory, entry.name)));
      }
    }
  }
  return [...new Set(files)].sort();
}

function convertDocument(markdown, relativePath, sourceRef) {
  const titleMatch = markdown.match(/^#\s+(.+)\r?\n/);
  if (!titleMatch) {
    throw new Error(`HuxerUI documentation has no level-one heading: ${relativePath}`);
  }

  const title = titleMatch[1].trim();
  const body = markdown
    .slice(titleMatch[0].length)
    .replace(/```xcconfig/g, "```ini")
    .replace(/```gitignore/g, "```text")
    .replace(
      /\]\(\.\.\/README\.md(#[^)]+)?\)/g,
      `](https://github.com/HuxerUI/HuxerUI/blob/${sourceRef}/README.md$1)`,
    );
  const editUrl = `https://github.com/HuxerUI/HuxerUI/edit/${sourceRef}/docs/${normalizePath(relativePath)}`;
  const frontmatter = [
    "---",
    `title: ${escapeYaml(title)}`,
    `description: ${escapeYaml(`${title} in the canonical HuxerUI documentation.`)}`,
    `editUrl: ${escapeYaml(editUrl)}`,
    "---",
    "",
  ].join("\n");
  return `${frontmatter}${body.trimStart()}`;
}

const config = await loadSourceConfig();
const source = await resolveHuxerUISource();
const outputRoot = path.join(websiteRoot, "src", "content", "docs", "generated");
const generatedRoot = path.join(websiteRoot, "src", "generated");
const files = await expandDocumentation(source, config.documentation);

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });
await mkdir(generatedRoot, { recursive: true });

for (const relativePath of files) {
  const markdown = await readFile(path.join(source, "docs", relativePath), "utf8");
  const target = path.join(outputRoot, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, convertDocument(markdown, relativePath, config.ref), "utf8");
}

await writeFile(
  path.join(generatedRoot, "content-source.json"),
  `${JSON.stringify({ repository: config.repository, ref: config.ref, documents: files }, null, 2)}\n`,
  "utf8",
);

console.log(`Synchronized ${files.length} canonical HuxerUI documents from ${config.ref}.`);
