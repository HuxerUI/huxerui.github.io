import { access, mkdir } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

import { loadSourceConfig, websiteRoot } from "./source-config.mjs";

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

function runGit(arguments_) {
  return new Promise((resolve, reject) => {
    const child = spawn("git", arguments_, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`git ${arguments_.join(" ")} failed with exit code ${code}`));
      }
    });
  });
}

export async function resolveHuxerUISource() {
  const config = await loadSourceConfig();
  const configuredPath = process.env.HUXERUI_SOURCE_DIR;
  if (configuredPath) {
    const source = path.resolve(configuredPath);
    if (!(await exists(path.join(source, "README.md")))) {
      throw new Error(`HUXERUI_SOURCE_DIR does not contain a HuxerUI checkout: ${source}`);
    }
    return source;
  }

  const cacheRoot = path.join(websiteRoot, ".cache");
  const source = path.join(cacheRoot, "huxerui");
  if (await exists(path.join(source, ".git"))) {
    await runGit(["-C", source, "remote", "set-url", "origin", config.repository]);
    await runGit(["-C", source, "fetch", "--depth", "1", "origin", config.ref]);
    await runGit(["-C", source, "checkout", "--detach", "FETCH_HEAD"]);
    return source;
  }
  if (await exists(source)) {
    throw new Error(`HuxerUI cache path exists but is not a Git checkout: ${source}`);
  }

  await mkdir(cacheRoot, { recursive: true });
  await runGit(["clone", "--depth", "1", "--branch", config.ref, config.repository, source]);
  return source;
}
