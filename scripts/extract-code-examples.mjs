import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const docsRoot = path.resolve("src/content/docs");
const outputRoot = path.resolve(process.argv[2] ?? ".cache/docs-examples");
const failures = [];
const examples = [];
const reviewedMoves = new Map([
  [
    "dsl/events-and-interaction.mdx:std::move(query)",
    "transfers the event payload into the operation that owns the search",
  ],
  ["reference/file.mdx:std::move(text)", "extracts the owned value from an rvalue FileResult"],
  ["guides/files.mdx:std::move(text)", "extracts the owned value from an rvalue FileResult"],
  [
    "guides/lifecycle-and-activation.mdx:std::move(subscription)",
    "transfers the subscription into the cleanup that owns it",
  ],
  ["guides/theme-and-styling.mdx:std::move(spec)", "transfers a completed ThemeSpec into the theme provider"],
]);
const observedMoves = new Map();

async function collectDocuments(directory) {
  const documents = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      documents.push(...(await collectDocuments(target)));
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      documents.push(target);
    }
  }
  return documents;
}

const identifiers = new Set();
let fragmentCount = 0;
for (const document of await collectDocuments(docsRoot)) {
  const content = await readFile(document, "utf8");
  const relative = path.relative(docsRoot, document).split(path.sep).join("/");
  let blockIndex = 0;
  for (const match of content.matchAll(/```(?:cpp|c\+\+)([^\n]*)\n([\s\S]*?)```/g)) {
    ++blockIndex;
    const metadata = match[1].trim();
    const source = match[2];
    if (source.includes(".Get(")) {
      failures.push(
        `${relative} C++ block ${blockIndex} uses State::Get(); documentation examples must prefer natural reads and operator->`,
      );
    }
    for (const move of source.matchAll(/std::move\([^\n)]+\)/g)) {
      const key = `${relative}:${move[0]}`;
      if (!reviewedMoves.has(key)) {
        failures.push(
          `${relative} C++ block ${blockIndex} contains unreviewed ownership transfer ${move[0]}; remove teaching noise or add a reasoned audit entry`,
        );
      }
      observedMoves.set(key, (observedMoves.get(key) ?? 0) + 1);
    }
    const compileMatch = metadata.match(/(?:^|\s)compile="([a-z0-9_-]+)"(?:\s|$)/);
    const isFragment = /(?:^|\s)fragment(?:\s|$)/.test(metadata);
    if (Boolean(compileMatch) === isFragment) {
      failures.push(`${relative} C++ block ${blockIndex} must be classified as exactly one of fragment or compile=\"id\"`);
      continue;
    }
    if (isFragment) {
      ++fragmentCount;
      continue;
    }

    const identifier = compileMatch[1];
    if (identifiers.has(identifier)) {
      failures.push(`Duplicate compiled example identifier: ${identifier}`);
      continue;
    }
    identifiers.add(identifier);
    if (!source.includes("#include <huxerui/")) {
      failures.push(`${relative} compiled example ${identifier} must be a visible, self-contained translation unit`);
    }
    examples.push({ identifier, document: relative, block: blockIndex, source });
  }
}

for (const [key, reason] of reviewedMoves) {
  const count = observedMoves.get(key) ?? 0;
  if (count !== 1) {
    failures.push(`Reviewed ownership transfer ${key} must occur exactly once (found ${count}); reason: ${reason}`);
  }
}

if (examples.length === 0) {
  failures.push("No C++ documentation blocks are marked for compilation");
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });
for (const example of examples) {
  await writeFile(path.join(outputRoot, `${example.identifier}.cpp`), example.source, "utf8");
}
await writeFile(
  path.join(outputRoot, "manifest.json"),
  `${JSON.stringify(examples.map(({ source: _source, ...entry }) => entry), null, 2)}\n`,
  "utf8"
);

console.log(
  `Classified ${fragmentCount} fragments, extracted ${examples.length} complete C++ examples, and reviewed ${reviewedMoves.size} ownership transfers.`,
);
