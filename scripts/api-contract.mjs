import { createHash } from "node:crypto";

export function normalizeDeclaration(value) {
  return value.replace(/\s+/g, " ").replace(/\s*([<>{}(),;*&=])\s*/g, "$1").trim();
}

export function headerReviewHash(source) {
  return createHash("sha256").update(source.replace(/\r\n/g, "\n")).digest("hex");
}

export function typeBody(source, name) {
  if (!/^[A-Za-z_]\w*$/.test(name)) throw new Error("Invalid contract type name: " + name);
  const clean = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  const match = new RegExp("\\b(?:class|struct)\\s+" + name + "\\b[^;{]*\\{").exec(clean);
  if (!match) return "";
  const start = match.index + match[0].length;
  let depth = 1;
  for (let index = start; index < clean.length; ++index) {
    if (clean[index] === "{") ++depth;
    if (clean[index] === "}" && --depth === 0) return clean.slice(start, index);
  }
  return "";
}
