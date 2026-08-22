import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const websiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function loadSourceConfig() {
  return JSON.parse(await readFile(path.join(websiteRoot, "huxerui-source.json"), "utf8"));
}

export function normalizePath(value) {
  return value.split(path.sep).join("/");
}
