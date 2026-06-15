// Hermetic module seeding.
//
// Every `ix-spec write`/`catalog` call runs `ensureDefaultModules()`, which
// reconciles 8 default Filament modules from GitHub into `$IX_HOME/filament/`.
// To keep per-scenario runs offline and fast we do that clone exactly ONCE into a
// cached seed (`evals/.seed-cache/filament`), then `cp -r` it into each scenario's
// isolated IX_HOME. With the modules already pinned, the lazy reconcile is a no-op.

import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

import { evalsRoot, repoRoot, ixSpecBin } from "./resolve.mjs";

const SEED_CACHE = join(evalsRoot(), ".seed-cache");
const SEED_FILAMENT = join(SEED_CACHE, "filament");
const SEED_HASH = join(SEED_CACHE, ".manifest-hash");

function manifestHash() {
  const yaml = readFileSync(join(repoRoot(), "default-modules.yaml"), "utf8");
  return createHash("sha256").update(yaml).digest("hex");
}

export function seedAvailable() {
  return (
    existsSync(join(SEED_FILAMENT, "registry.json")) &&
    existsSync(SEED_HASH) &&
    readFileSync(SEED_HASH, "utf8").trim() === manifestHash()
  );
}

/**
 * Build the seed once (one authenticated reconcile against GitHub). Idempotent:
 * a cached seed matching the current `default-modules.yaml` short-circuits.
 * @returns {{ seedDir: string, filamentDir: string, modulesDir: string, rebuilt: boolean }}
 */
export function buildSeedOnce({ force = false, log = () => {} } = {}) {
  if (!force && seedAvailable()) {
    return seedPaths(false);
  }
  log("seed: building (one authenticated reconcile of default modules)...");
  const tmpHome = mkdtempSync(join(tmpdir(), "ix-spec-seed-"));
  try {
    const out = spawnSync(
      process.execPath,
      [ixSpecBin(), "catalog", "list", "--json"],
      {
        encoding: "utf8",
        env: { ...process.env, IX_HOME: tmpHome },
      },
    );
    if (out.status !== 0) {
      throw new Error(
        `seed reconcile failed (exit ${out.status}). The 8 default modules are ` +
          "private until they go public; this step needs GitHub auth/network once.\n" +
          "Offline fallback: copy ~/dev/spec-*/<snake> dirs into " +
          `${join(SEED_FILAMENT, "modules")} and synthesize registry.json.\n` +
          `stderr:\n${out.stderr ?? ""}`,
      );
    }
    const tmpFilament = join(tmpHome, "filament");
    if (!existsSync(join(tmpFilament, "registry.json"))) {
      throw new Error(
        `seed reconcile produced no ${join(tmpFilament, "registry.json")}; ` +
          `catalog output:\n${out.stdout ?? ""}`,
      );
    }
    rmSync(SEED_CACHE, { recursive: true, force: true });
    mkdirSync(SEED_CACHE, { recursive: true });
    cpSync(tmpFilament, SEED_FILAMENT, { recursive: true });
    writeFileSync(SEED_HASH, `${manifestHash()}\n`);
    log(`seed: cached at ${SEED_FILAMENT}`);
    return seedPaths(true);
  } finally {
    rmSync(tmpHome, { recursive: true, force: true });
  }
}

function seedPaths(rebuilt) {
  return {
    seedDir: SEED_CACHE,
    filamentDir: SEED_FILAMENT,
    modulesDir: join(SEED_FILAMENT, "modules"),
    rebuilt,
  };
}

/** Copy the cached seed `filament/` into a scenario's IX_HOME. Returns its modules dir. */
export function snapshotInto(ixHome) {
  if (!existsSync(join(SEED_FILAMENT, "registry.json"))) {
    throw new Error("seed not built; call buildSeedOnce() first");
  }
  const dest = join(ixHome, "filament");
  cpSync(SEED_FILAMENT, dest, { recursive: true });
  return join(dest, "modules");
}
