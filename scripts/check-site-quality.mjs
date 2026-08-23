import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { loadSourceConfig } from "./source-config.mjs";

const distribution = path.resolve(process.argv[2] ?? "dist");
const sourceConfig = await loadSourceConfig();
const failures = [];

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

function attributes(element) {
  return new Map([...element.matchAll(/\s([:\w-]+)(?:=["']([^"']*)["'])?/g)].map((match) => [match[1], match[2] ?? ""]));
}

const htmlFiles = (await walk(distribution)).filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const relative = path.relative(distribution, file).split(path.sep).join("/");
  const html = await readFile(file, "utf8");
  const ids = new Set();
  for (const match of html.matchAll(/\sid=["']([^"']+)["']/g)) {
    if (ids.has(match[1])) {
      failures.push(`${relative}: duplicate id ${match[1]}`);
    }
    ids.add(match[1]);
  }

  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!attributes(match[0]).has("alt")) {
      failures.push(`${relative}: image is missing alt text`);
    }
  }

  if (!relative.startsWith("demos/")) {
    const mainCount = (html.match(/<main(?:\s|>)/g) ?? []).length;
    if (mainCount !== 1) {
      failures.push(`${relative}: expected one main content region, found ${mainCount}`);
    }
  }
  if (!/<html\b[^>]*\slang=["'][^"']+["']/.test(html)) {
    failures.push(`${relative}: document language is missing`);
  }

  for (const match of html.matchAll(/href=["'](https:\/\/github\.com\/HuxerUI\/HuxerUI\/(?:blob|tree)\/([^/"']+)[^"']*)["']/g)) {
    if (match[2] !== sourceConfig.ref) {
      failures.push(`${relative}: source link does not use pinned revision ${sourceConfig.ref}: ${match[1]}`);
    }
  }
}

const cssFiles = (await walk(distribution)).filter((file) => file.endsWith(".css"));
for (const file of cssFiles) {
  const css = await readFile(file, "utf8");
  if (/min-width:\s*(?:[1-9]\d{3,}px|1[1-9]\d+vw)/.test(css)) {
    failures.push(`${path.relative(distribution, file)}: fixed minimum width can cause page-level horizontal overflow`);
  }
}

if (failures.length > 0) {
  console.error(`Found ${failures.length} generated-site quality failures:\n${failures.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`Checked accessibility structure, duplicate IDs, source revisions, and static overflow risks in ${htmlFiles.length} pages.`);
}
