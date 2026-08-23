import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

import {
  components,
  modules,
  platformDeclarationContracts,
  platformHeaders,
  publicHeaders,
} from "./api-coverage.mjs";
import { resolveHuxerUISource } from "./resolve-huxerui-source.mjs";

const docsRoot = path.resolve("src/content/docs");
const frameworkRoot = await resolveHuxerUISource();
const publicHeaderRoot = path.join(frameworkRoot, "include", "huxerui");
const failures = [];

async function readDocument(relativePath) {
  try {
    return await readFile(path.join(docsRoot, relativePath), "utf8");
  } catch {
    failures.push(`Missing documentation page: ${relativePath}`);
    return "";
  }
}

async function readHeader(relativePath) {
  try {
    return await readFile(path.join(publicHeaderRoot, relativePath), "utf8");
  } catch {
    failures.push(`Coverage manifest references a missing public header: ${relativePath}`);
    return "";
  }
}

async function collectFiles(directory, extension) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(target, extension)));
    } else if (entry.isFile() && entry.name.endsWith(extension)) {
      files.push(target);
    }
  }
  return files;
}

function requireSymbols(owner, content, symbols) {
  for (const symbol of symbols) {
    if (!content.includes(symbol)) {
      failures.push(`${owner} does not cover ${symbol}`);
    }
  }
}

function normalizeDeclaration(value) {
  return value.replace(/\s+/g, " ").replace(/\s*([<>{}(),;*&=])\s*/g, "$1").trim();
}

for (const component of components) {
  const pagePath = `components/${component.page}.mdx`;
  const page = await readDocument(pagePath);
  const header = await readHeader(component.header);
  requireSymbols(pagePath, page, component.symbols);
  requireSymbols(`include/huxerui/${component.header}`, header, component.symbols);

  const sectionCount = (page.match(/^## /gm) ?? []).length;
  const intentionallyCompact = component.page === "divider" || component.page === "spacer";
  if (!intentionallyCompact && sectionCount < 2) {
    failures.push(`${pagePath} needs at least two meaningful sections`);
  }
}

for (const module of modules) {
  const pagePath = `reference/${module.page}.mdx`;
  const page = await readDocument(pagePath);
  const headers = (await Promise.all(module.headers.map(readHeader))).join("\n");
  requireSymbols(pagePath, page, module.symbols);
  requireSymbols(module.headers.map((header) => `include/huxerui/${header}`).join(", "), headers, module.symbols);
}

const referenceIndex = await readDocument("reference/index.mdx");
for (const module of modules) {
  for (const header of module.headers) {
    if (!referenceIndex.includes(`\`${header}\``)) {
      failures.push(`Reference index does not map public header: ${header}`);
    }
  }
}

const actualPublicHeaders = (await collectFiles(publicHeaderRoot, ".h"))
  .map((header) => path.relative(publicHeaderRoot, header).split(path.sep).join("/"))
  .sort();
const contractedPublicHeaders = publicHeaders.map(({ path: header }) => header).sort();
for (const header of actualPublicHeaders.filter((header) => !contractedPublicHeaders.includes(header))) {
  failures.push(`Public header is missing from the API contract: include/huxerui/${header}`);
}
for (const header of contractedPublicHeaders.filter((header) => !actualPublicHeaders.includes(header))) {
  failures.push(`API contract references a removed public header: include/huxerui/${header}`);
}

const documentedHeaderOwners = new Map();
for (const entry of publicHeaders) {
  if (!entry.audience || !entry.documentation) {
    failures.push(`Public header contract needs audience and documentation: include/huxerui/${entry.path}`);
    continue;
  }
  const owner = await readDocument(entry.documentation);
  const includeName = `<huxerui/${entry.path}>`;
  if (!owner.includes(includeName) && !owner.includes(`\`${entry.path}\``)) {
    failures.push(`${entry.documentation} does not identify its public header ${includeName}`);
  }
  if (documentedHeaderOwners.has(entry.path)) {
    failures.push(`Public header has duplicate contract entries: include/huxerui/${entry.path}`);
  }
  documentedHeaderOwners.set(entry.path, entry.documentation);
}

const platformReference = await readDocument("reference/platform-specific.mdx");
for (const header of platformHeaders) {
  try {
    await access(path.join(publicHeaderRoot, header));
  } catch {
    failures.push(`Platform coverage references a missing public header: ${header}`);
  }
  if (!platformReference.includes(`\`<huxerui/${header}>\``)) {
    failures.push(`Platform reference does not map public header: ${header}`);
  }
}

for (const contract of platformDeclarationContracts) {
  const header = normalizeDeclaration(await readHeader(contract.header));
  for (const declaration of contract.declarations) {
    if (!header.includes(normalizeDeclaration(declaration))) {
      failures.push(`Platform API signature changed in include/huxerui/${contract.header}: ${declaration}`);
    }
  }
}

const documents = await collectFiles(docsRoot, ".mdx");

const discouraged = [
  { pattern: /\.Get\(\)/g, message: "Prefer natural State reads or operator-> in user examples" },
  { pattern: /Image\s*\(\s*UseImage\s*\(/g, message: "Construct Image directly from ImageResource" },
  { pattern: /Button\s*\(\s*StringVariant::Format\s*\(/g, message: "Resolve immediate Button labels with UseString" },
];

for (const document of documents) {
  const content = await readFile(document, "utf8");
  const relative = path.relative(docsRoot, document).split(path.sep).join("/");
  const cppBlocks = [...content.matchAll(/```(?:cpp|c\+\+)\s*\n([\s\S]*?)```/g)].map((match) => match[1]).join("\n");
  for (const rule of discouraged) {
    rule.pattern.lastIndex = 0;
    if (rule.pattern.test(cppBlocks)) {
      failures.push(`${relative}: ${rule.message}`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Verified ${publicHeaders.length} public headers, ${components.length} component contracts, ` +
      `${modules.length} API modules, ${platformHeaders.length} platform headers, and ` +
      `${documents.length} documentation pages against ${frameworkRoot}.`
  );
}
