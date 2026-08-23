import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const distribution = path.resolve(process.argv[2] ?? "dist");

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(target)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(target);
    }
  }
  return files;
}

const links = new Set();
for (const file of await walk(distribution)) {
  const html = await readFile(file, "utf8");
  for (const match of html.matchAll(/href=["'](https?:\/\/[^"'#]+(?:#[^"']*)?)["']/g)) {
    const url = new URL(match[1]);
    if (url.hostname === "huxerui.github.io") {
      continue;
    }
    links.add(url.href);
  }
}

async function request(url, method) {
  return fetch(url, {
    method,
    redirect: "follow",
    signal: AbortSignal.timeout(20_000),
    headers: { "user-agent": "HuxerUI-website-link-check" },
  });
}

async function check(url) {
  for (let attempt = 0; attempt < 2; ++attempt) {
    try {
      let response = await request(url, "HEAD");
      if (response.status === 405 || response.status === 501) {
        response = await request(url, "GET");
      }
      if (response.status < 500 && response.status !== 404 && response.status !== 410) {
        return null;
      }
      if (attempt === 1) {
        return `${url} -> HTTP ${response.status}`;
      }
    } catch (error) {
      if (attempt === 1) {
        return `${url} -> ${error instanceof Error ? error.message : String(error)}`;
      }
    }
  }
  return null;
}

const queue = [...links];
const failures = [];
await Promise.all(
  Array.from({ length: Math.min(8, queue.length) }, async () => {
    while (queue.length > 0) {
      const failure = await check(queue.shift());
      if (failure) {
        failures.push(failure);
      }
    }
  })
);

if (failures.length > 0) {
  console.error(`Found ${failures.length} unavailable external links:\n${failures.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${links.size} external links.`);
}
