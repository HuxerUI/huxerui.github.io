import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { loadSourceConfig, websiteRoot } from "./source-config.mjs";

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(target)));
    } else if (entry.isFile()) {
      files.push(target);
    }
  }
  return files;
}

const buildDirectory = process.env.HUXERUI_WEB_BUILD_DIR;
if (!buildDirectory) {
  throw new Error("HUXERUI_WEB_BUILD_DIR must point to an Emscripten HuxerUI build.");
}

const config = await loadSourceConfig();
const sourceRoot = path.resolve(buildDirectory);
const outputRoot = path.resolve(websiteRoot, "public", "demos");
if (!outputRoot.startsWith(path.resolve(websiteRoot, "public") + path.sep)) {
  throw new Error(`Refusing to stage demos outside the website public directory: ${outputRoot}`);
}

const files = await walk(sourceRoot);
await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

const manifest = [];
for (const slug of config.webExamples) {
  const targetName = `example_${slug}`;
  const entry = files.find((file) => path.basename(file) === `${targetName}.html`);
  if (!entry) {
    throw new Error(`The Web build does not contain ${targetName}.html.`);
  }

  const sourceDirectory = path.dirname(entry);
  const outputDirectory = path.join(outputRoot, slug);
  await mkdir(outputDirectory, { recursive: true });
  const siblings = await readdir(sourceDirectory, { withFileTypes: true });
  const staged = [];
  for (const sibling of siblings) {
    if (!sibling.isFile() || !sibling.name.startsWith(`${targetName}.`)) {
      continue;
    }
    const outputName = sibling.name === `${targetName}.html` ? "index.html" : sibling.name;
    await cp(path.join(sourceDirectory, sibling.name), path.join(outputDirectory, outputName));
    staged.push(outputName);
  }
  manifest.push({ slug, entry: `/demos/${slug}/index.html`, files: staged.sort() });
}

await writeFile(path.join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Staged ${manifest.length} independent HuxerUI Web examples.`);
