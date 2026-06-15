// Per-scenario workspace: an isolated repo + IX_HOME, a pre-generated session id,
// and the predetermined Claude Code transcript path.

import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { join } from "node:path";

import { snapshotInto } from "./seed.mjs";

/**
 * Claude Code's project-dir slug for a cwd: every non-alphanumeric character
 * becomes `-`, case preserved. (Verified against live transcript dir names.)
 */
export function slug(absPath) {
  return absPath.replace(/[^a-zA-Z0-9]/g, "-");
}

/** Where Claude Code writes the transcript for a session run in `cwd`. */
export function transcriptPathFor(cwd, sessionId) {
  return join(
    homedir(),
    ".claude",
    "projects",
    slug(cwd),
    `${sessionId}.jsonl`,
  );
}

/**
 * Create an isolated workspace for one scenario run.
 * @returns {{ id, work, repo, ixHome, modulesDir, sessionId, transcriptPath, cleanup }}
 */
export function makeScenarioWorkspace(id) {
  const work = mkdtempSync(join(tmpdir(), `ix-spec-${id.toLowerCase()}-`));
  const repo = join(work, "repo");
  const ixHome = join(work, "ix-home");
  mkdirSync(join(repo, "spec"), { recursive: true });
  mkdirSync(ixHome, { recursive: true });
  const modulesDir = snapshotInto(ixHome);
  const sessionId = randomUUID();
  return {
    id,
    work,
    repo,
    ixHome,
    modulesDir,
    sessionId,
    transcriptPath: transcriptPathFor(repo, sessionId),
    data: {}, // scratch for setup(ctx) -> env(ctx)/prompt(ctx) handoff
    cleanup() {
      rmSync(work, { recursive: true, force: true });
    },
  };
}
