// Ground-truth success assertion. The harness independently re-runs the relevant
// CLI/validation (the agent's own runs inside the transcript can lie or be skipped),
// and keys `quire validate` pass/fail on EXIT CODE only — `DuplicateArchetype`
// warnings on stderr coexist with a passing (exit 0) validation.

import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { spawnSync } from "node:child_process";

import { findQuire, ixSpecBin } from "./resolve.mjs";

/** Recursively list repo-relative file paths (posix-style), skipping dotdirs. */
function listFiles(root, dir = root, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".")) continue;
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) listFiles(root, abs, acc);
    else acc.push(relative(root, abs).split(sep).join("/"));
  }
  return acc;
}

/** Glob -> RegExp supporting `**`, `*`, `?`. */
function globToRegExp(glob) {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") {
        i++;
        if (glob[i + 1] === "/") i++;
        re += "(?:.*/)?";
      } else {
        re += "[^/]*";
      }
    } else if (c === "?") re += "[^/]";
    else re += c.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }
  // case-insensitive: agents legitimately name files `fr-001.md` (matching the
  // lowercase skeletons) or `FR-001.md` (canonical type casing) — both should match.
  return new RegExp(`^${re}$`, "i");
}

export function matchFiles(repo, glob) {
  const re = globToRegExp(glob);
  return listFiles(repo).filter((f) => re.test(f));
}

function ixSpec(ctx, args, env) {
  return spawnSync(process.execPath, [ixSpecBin(), ...args], {
    cwd: ctx.repo,
    encoding: "utf8",
    env,
  });
}

/**
 * Assert a scenario's expectations against the final repo + config state.
 * @param expect {
 *   files?: string[], validate?: {globs, shouldPass},
 *   flow?: [{id, defName}], cliRejects?: string[],
 *   plugin?: {name, present}, resolvesTo?: {type, moduleNameIncludes},
 *   sentinel?: "complete"|"failed"
 * }
 * @returns { ok, failures, validation, matchedFiles, checks }
 */
export function assertExpectations(
  ctx,
  expect,
  runResult,
  { quireBin = findQuire(), modulesDir, extraEnv = {} } = {},
) {
  const env = {
    ...process.env,
    IX_HOME: ctx.ixHome,
    IX_SCHEMA_PATH: modulesDir,
    ...extraEnv,
  };
  const scope = ctx.scope ?? ctx.repo; // validation + file-assertion root
  const failures = [];
  const matchedFiles = {};
  const checks = {};

  for (const glob of expect.files ?? []) {
    const hits = matchFiles(scope, glob);
    matchedFiles[glob] = hits.length;
    if (hits.length === 0)
      failures.push(`no file matched expected glob: ${glob}`);
  }

  let validation = null;
  if (expect.validate) {
    const { globs, shouldPass = true } = expect.validate;
    const r = spawnSync(quireBin, ["validate", "--scope", scope, ...globs], {
      cwd: scope,
      encoding: "utf8",
      env,
    });
    const passed = (r.status ?? 1) === 0;
    validation = {
      exitCode: r.status ?? null,
      passed,
      stderr: (r.stderr ?? "").slice(-2000),
    };
    if (passed !== shouldPass) {
      failures.push(
        `validation expected pass=${shouldPass} but got pass=${passed}`,
      );
    }
  }

  for (const { id, defName } of expect.flow ?? []) {
    const r = spawnSync(
      "ix-flow",
      ["status", id, "--json", "--config-root", ctx.ixHome],
      { cwd: ctx.repo, encoding: "utf8", env },
    );
    let ok = false;
    let actual = null;
    try {
      const data = JSON.parse(r.stdout || "{}");
      actual = data?.data?.defName ?? data?.summary?.defName;
      ok = (r.status ?? 1) === 0 && actual === defName;
    } catch {
      // non-JSON => failure below
    }
    checks[`flow:${id}`] = { ok, defName: actual, exitCode: r.status };
    if (!ok)
      failures.push(`flow ${id} not running as ${defName} (got ${actual})`);
  }

  for (const type of expect.cliRejects ?? []) {
    const r = ixSpec(ctx, ["write", ctx.repo, "--types", type], env);
    const rejected = (r.status ?? 0) !== 0;
    checks[`cliRejects:${type}`] = { ok: rejected, exitCode: r.status };
    if (!rejected) failures.push(`CLI did not reject unknown type: ${type}`);
  }

  if (expect.plugin) {
    const { name, present = true } = expect.plugin;
    const r = ixSpec(ctx, ["plugin", "list", "--json"], env);
    let found = false;
    try {
      found = (JSON.parse(r.stdout || "{}").plugins ?? []).some(
        (p) => p.name === name,
      );
    } catch {
      // parse failure => found stays false
    }
    checks[`plugin:${name}`] = { ok: found === present, present: found };
    if (found !== present)
      failures.push(`plugin ${name} present=${found}, expected ${present}`);
  }

  if (expect.resolvesTo) {
    const { type, moduleNameIncludes } = expect.resolvesTo;
    const r = ixSpec(ctx, ["write", ctx.repo, "--types", type, "--json"], env);
    let ok = false;
    let moduleRoot = null;
    try {
      const pack = JSON.parse(r.stdout || "{}");
      moduleRoot = pack.types?.[0]?.moduleRoot ?? "";
      ok = moduleRoot.includes(moduleNameIncludes);
    } catch {
      // parse failure => ok stays false
    }
    checks[`resolvesTo:${type}`] = { ok, moduleRoot };
    if (!ok)
      failures.push(
        `${type} did not resolve to a module under "${moduleNameIncludes}" (got ${moduleRoot})`,
      );
  }

  const wantSentinel = expect.sentinel ?? "complete";
  if (runResult.exitReason !== wantSentinel) {
    failures.push(
      `expected sentinel "${wantSentinel}" but run ended "${runResult.exitReason}"`,
    );
  }

  return {
    ok: failures.length === 0,
    failures,
    validation,
    matchedFiles,
    checks,
  };
}
