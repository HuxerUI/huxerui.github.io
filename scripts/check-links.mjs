import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const distribution = path.resolve(process.argv[2] ?? "dist");

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

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

function outputPathFor(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("#")[0].split("?")[0]);
  if (path.extname(decoded)) {
    return path.join(distribution, decoded.replace(/^\//, ""));
  }
  return path.join(distribution, decoded.replace(/^\//, ""), "index.html");
}

function fragmentFor(url) {
  const hash = url.indexOf("#");
  return hash === -1 ? "" : decodeURIComponent(url.slice(hash + 1));
}

const htmlCache = new Map();

async function readHtml(file) {
  if (!htmlCache.has(file)) {
    htmlCache.set(file, await readFile(file, "utf8"));
  }
  return htmlCache.get(file);
}

function hasFragment(html, fragment) {
  if (!fragment) {
    return true;
  }
  for (const match of html.matchAll(/\s(?:id|name)=["']([^"']+)["']/g)) {
    if (match[1] === fragment) {
      return true;
    }
  }
  return false;
}

const failures = [];
const htmlFiles = (await walk(distribution)).filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const html = await readHtml(file);
  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
    const target = match[1];
    if ((!target.startsWith("/") && !target.startsWith("#")) || target.startsWith("//")) {
      continue;
    }
    const targetFile = target.startsWith("#") ? file : outputPathFor(target);
    if (!(await exists(targetFile))) {
      failures.push(`${path.relative(distribution, file)} -> ${target}`);
      continue;
    }
    const fragment = fragmentFor(target);
    if (fragment && targetFile.endsWith(".html") && !hasFragment(await readHtml(targetFile), fragment)) {
      failures.push(`${path.relative(distribution, file)} -> ${target} (missing fragment)`);
    }
  }
}

if (failures.length > 0) {
  console.error(`Found ${failures.length} unresolved internal links:\n${failures.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`Checked internal links in ${htmlFiles.length} generated pages.`);
}
