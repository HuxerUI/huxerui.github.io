import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { websiteRoot } from "./source-config.mjs";

const apiUrl = "https://api.github.com/repos/HuxerUI/HuxerUI/releases/latest";
const releasesUrl = "https://github.com/HuxerUI/HuxerUI/releases";
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "HuxerUI-website-build",
  "X-GitHub-Api-Version": "2022-11-28",
};
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

function classifyAsset(name) {
  const match = name.match(/^huxerui-sdk-.+-(windows|macos|linux)-([^.]+)\.(zip|tar\.gz)$/);
  if (!match) {
    return undefined;
  }
  return { platform: match[1], architecture: match[2], format: match[3] };
}

async function checksumFor(asset, assets) {
  const checksumAsset = assets.find((candidate) => candidate.name === `${asset.name}.sha256`);
  if (!checksumAsset) {
    return undefined;
  }
  const response = await fetch(checksumAsset.browser_download_url, { headers });
  if (!response.ok) {
    throw new Error(`Unable to read ${checksumAsset.name}: ${response.status}`);
  }
  return (await response.text()).trim().split(/\s+/)[0];
}

const response = await fetch(apiUrl, { headers });
let output;
if (response.status === 404) {
  output = {
    available: false,
    releasesUrl,
    message: "The first public SDK release has not been published yet.",
  };
} else {
  if (!response.ok) {
    throw new Error(`GitHub Releases request failed: ${response.status} ${response.statusText}`);
  }
  const release = await response.json();
  const archives = release.assets.filter((asset) => classifyAsset(asset.name));
  output = {
    available: true,
    releasesUrl,
    tag: release.tag_name,
    name: release.name,
    publishedAt: release.published_at,
    releaseUrl: release.html_url,
    assets: await Promise.all(
      archives.map(async (asset) => ({
        name: asset.name,
        url: asset.browser_download_url,
        bytes: asset.size,
        sha256: await checksumFor(asset, release.assets),
        ...classifyAsset(asset.name),
      })),
    ),
  };
}

const generatedRoot = path.join(websiteRoot, "src", "generated");
await mkdir(generatedRoot, { recursive: true });
await writeFile(path.join(generatedRoot, "release.json"), `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(output.available ? `Collected ${output.assets.length} SDK archives for ${output.tag}.` : output.message);
