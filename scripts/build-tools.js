#!/usr/bin/env node
/**
 * Build tools
 * Provides version computation, git info, and other build utilities
 */

import { execSync } from "child_process";
import { createHash } from "crypto";

function exec(cmd, options = {}) {
  try {
    return execSync(cmd, { encoding: "utf8", ...options }).trim();
  } catch {
    return options.fallback || "";
  }
}

function getGitTag() {
  return exec("git describe --tags --abbrev=0 2>/dev/null", {
    fallback: "0.0.0",
  });
}

function getGitCommit() {
  return exec("git rev-parse --short HEAD 2>/dev/null", { fallback: "local" });
}

function getGitBranch() {
  const branch = exec("git rev-parse --abbrev-ref HEAD 2>/dev/null", {
    fallback: "local",
  });
  return branch.replace(/[^a-zA-Z0-9]/g, "-");
}

function getGitStatus() {
  const diff = exec("git diff --no-ext-diff 2>/dev/null");
  const untracked = exec(
    "git ls-files --others --exclude-standard 2>/dev/null",
  );
  return diff || untracked ? "dirty" : "clean";
}

function getDirtyHash() {
  const diff = exec("git diff --no-ext-diff 2>/dev/null");
  const untracked = exec(
    "git ls-files --others --exclude-standard 2>/dev/null",
  );
  const combined = diff + untracked;
  return createHash("sha256").update(combined).digest("hex").substring(0, 8);
}

function getDevVersion() {
  const base = getGitTag();
  // Bump patch so dev versions are semver-higher than the last stable tag
  // e.g. tag 0.1.10 -> dev version 0.1.11-timestamp-commit
  const parts = base.split(".");
  parts[parts.length - 1] = String(Number(parts[parts.length - 1]) + 1);
  const devBase = parts.join(".");
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace("T", ".")
    .split(".")
    .slice(0, 2)
    .join(".");
  const commit = getGitCommit();
  const status = getGitStatus();

  if (status === "dirty") {
    const dirtyHash = getDirtyHash();
    return `${devBase}-${timestamp}-${commit}.${dirtyHash}`;
  }
  return `${devBase}-${timestamp}-${commit}`;
}

const commands = {
  version() {
    console.log(getDevVersion());
  },

  info() {
    console.log(`Tag:        ${getGitTag()}`);
    console.log(`Commit:     ${getGitCommit()}`);
    console.log(`Branch:     ${getGitBranch()}`);
    console.log(`Status:     ${getGitStatus()}`);
    if (getGitStatus() === "dirty") {
      console.log(`Dirty hash: ${getDirtyHash()}`);
    }
  },

  help() {
    console.log("Build Tools - Version and Git Information Utilities");
    console.log("");
    console.log("Usage: build-tools <command>");
    console.log("");
    console.log("Commands:");
    console.log("  version    Print computed development version");
    console.log(
      "             Format: <tag>-<timestamp>-<commit>[.<dirty-hash>]",
    );
    console.log("             Example: 0.0.1-20260201-e45c1c7.cd2e88fa");
    console.log("");
    console.log("  info       Show git repository information");
    console.log(
      "             Displays: tag, commit, branch, status, dirty hash",
    );
    console.log("");
    console.log("  help       Show this help message");
  },
};

const cmd = process.argv[2];
if (!cmd || cmd === "--help" || cmd === "-h") {
  commands.help();
  process.exit(0);
}

if (!commands[cmd]) {
  console.error(`Error: Unknown command '${cmd}'`);
  console.error("");
  commands.help();
  process.exit(1);
}

commands[cmd]();
