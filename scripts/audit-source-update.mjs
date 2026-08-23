import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

import { components, modules, platformDeclarationContracts, publicHeaders } from "./api-coverage.mjs";
import { loadSourceConfig } from "./source-config.mjs";

const candidateArgument = process.argv[2] ?? process.env.HUXERUI_SOURCE_DIR;
if (!candidateArgument) {
  throw new Error("Pass a candidate HuxerUI checkout: npm run audit:revision -- <path>");
}
const candidateRoot = path.resolve(candidateArgument);

async function collect(directory, suffix) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collect(target, suffix)));
    } else if (entry.isFile() && entry.name.endsWith(suffix)) {
      files.push(target);
    }
  }
  return files;
}

function normalizeDeclaration(value) {
  return value.replace(/\s+/g, " ").replace(/\s*([<>{}(),;*&=])\s*/g, "$1").trim();
}

const config = await loadSourceConfig();
const headerRoot = path.join(candidateRoot, "include", "huxerui");
const actualHeaders = (await collect(headerRoot, ".h"))
  .map((file) => path.relative(headerRoot, file).split(path.sep).join("/"))
  .sort();
const contractedHeaders = publicHeaders.map(({ path: header }) => header).sort();
const added = actualHeaders.filter((header) => !contractedHeaders.includes(header));
const removed = contractedHeaders.filter((header) => !actualHeaders.includes(header));

let candidateRevision = "unknown";
let changedFiles = [];
try {
  candidateRevision = execFileSync("git", ["-C", candidateRoot, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  changedFiles = execFileSync("git", ["-C", candidateRoot, "diff", "--name-only", config.ref, "--", "include/huxerui", "examples"], { encoding: "utf8" })
    .split(/\r?\n/)
    .filter(Boolean);
} catch {
  // A source archive can still be audited for current headers and configured examples.
}

const headerContents = new Map();
async function readCandidateHeader(header) {
  if (!headerContents.has(header)) {
    try {
      headerContents.set(header, await readFile(path.join(headerRoot, header), "utf8"));
    } catch {
      headerContents.set(header, "");
    }
  }
  return headerContents.get(header);
}

const contractDrift = new Set();
for (const component of components) {
  const header = await readCandidateHeader(component.header);
  for (const symbol of component.symbols) {
    if (!header.includes(symbol)) {
      contractDrift.add(`${component.header}: ${symbol}`);
    }
  }
}
for (const module of modules) {
  const headers = (await Promise.all(module.headers.map(readCandidateHeader))).join("\n");
  for (const symbol of module.symbols) {
    if (!headers.includes(symbol)) {
      contractDrift.add(`${module.headers.join("+")}: ${symbol}`);
    }
  }
}
for (const contract of platformDeclarationContracts) {
  const header = normalizeDeclaration(await readCandidateHeader(contract.header));
  for (const declaration of contract.declarations) {
    if (!header.includes(normalizeDeclaration(declaration))) {
      contractDrift.add(`${contract.header}: ${declaration}`);
    }
  }
}

const affectedDocs = new Set();
for (const file of changedFiles) {
  const header = file.replace(/^include\/huxerui\//, "");
  const contract = publicHeaders.find(({ path: candidate }) => candidate === header);
  if (contract) {
    affectedDocs.add(contract.documentation);
  }
}

const missingExamples = [];
for (const slug of config.webExamples) {
  for (const relative of [`examples/${slug}/CMakeLists.txt`, `examples/${slug}/main.cpp`]) {
    try {
      await readFile(path.join(candidateRoot, relative));
    } catch {
      missingExamples.push(relative);
    }
  }
}
const changedExamples = [...new Set(changedFiles
  .map((file) => file.match(/^examples\/([^/]+)\//)?.[1])
  .filter((slug) => slug && config.webExamples.includes(slug)))].sort();

console.log(`Pinned revision:    ${config.ref}`);
console.log(`Candidate revision: ${candidateRevision}`);
console.log(`Added headers:       ${added.length ? added.join(", ") : "none"}`);
console.log(`Removed headers:     ${removed.length ? removed.join(", ") : "none"}`);
console.log(`Contract drift:      ${contractDrift.size ? [...contractDrift].sort().join("; ") : "none"}`);
console.log(`Missing examples:    ${missingExamples.length ? missingExamples.join(", ") : "none"}`);
console.log(`Changed Web examples:${changedExamples.length ? ` ${changedExamples.join(", ")}` : " none"}`);
console.log(`Pages to review:     ${affectedDocs.size ? [...affectedDocs].sort().join(", ") : "none detected"}`);
console.log("Run check:docs and the C++ contract build against the candidate before changing huxerui-source.json.");

if (added.length || removed.length || contractDrift.size || missingExamples.length) {
  process.exitCode = 1;
}
