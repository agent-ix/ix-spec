#!/usr/bin/env node
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { performance } from "node:perf_hooks";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const ixSpecBin = join(root, "bin", "ix-spec.js");
const reportsDir = join(root, "evals", "reports");
const builtinModules = join(root, "builtin-modules");
const quireBin = findQuire();

const scenarios = [
  ["EV-001", "US-001", ev001],
  ["EV-002", "US-002", ev002],
  ["EV-003", "US-003", ev003],
  ["EV-004", "US-004", ev004],
  ["EV-005", "US-005", ev005],
  ["EV-006", "US-001,US-004", ev006],
  ["EV-007", "US-002", ev007],
  ["EV-008", "US-004", ev008],
  ["EV-009", "US-003", ev009],
  ["EV-010", "US-003", ev010],
  ["EV-011", "US-002", ev011],
  ["EV-012", "US-004", ev012],
  ["EV-013", "US-005", ev013],
  ["EV-014", "US-001,US-002", ev014],
  ["EV-015", "US-001,US-004", ev015],
];

function main() {
  mkdirSync(reportsDir, { recursive: true });
  const filter = argValue("--filter");
  const selected = filter
    ? scenarios.filter(([id]) => id.includes(filter))
    : scenarios;
  if (selected.length === 0) throw new Error(`no eval matched ${filter}`);

  const results = [];
  for (const [id, useCase, fn] of selected) {
    const ctx = createContext(id);
    const started = performance.now();
    let result;
    try {
      const details = fn(ctx) ?? {};
      result = finish(ctx, id, useCase, true, started, details);
      console.log(`PASS ${id} ${result.latencyMs}ms`);
    } catch (error) {
      result = finish(ctx, id, useCase, false, started, {
        error: error instanceof Error ? error.message : String(error),
      });
      console.error(`FAIL ${id} ${result.latencyMs}ms ${result.error}`);
    }
    results.push(result);
  }

  const report = {
    ok: results.every((result) => result.ok),
    generatedAt: new Date().toISOString(),
    quireBin,
    results,
  };
  const reportPath = join(reportsDir, "latest.json");
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(
    report.ok
      ? `ix-spec evals ok (${results.length}) report=${reportPath}`
      : `ix-spec evals FAILED (${results.filter((r) => !r.ok).length}/${results.length}) report=${reportPath}`,
  );
  process.exit(report.ok ? 0 : 1);
}

function createContext(id) {
  const work = mkdtempSync(join(tmpdir(), `ix-spec-${id.toLowerCase()}-`));
  const repo = join(work, "repo");
  const ixHome = join(work, "ix-home");
  mkdirSync(join(repo, "spec"), { recursive: true });
  mkdirSync(ixHome, { recursive: true });
  return {
    id,
    work,
    repo,
    ixHome,
    toolCalls: 0,
    validationAttempts: 0,
    contextFetches: 0,
    commandTranscript: [],
    tokenUsage: null,
  };
}

function finish(ctx, id, useCase, ok, started, details) {
  return {
    id,
    useCase,
    ok,
    latencyMs: Math.round(performance.now() - started),
    toolCalls: ctx.toolCalls,
    validationAttempts: ctx.validationAttempts,
    contextFetches: ctx.contextFetches,
    tokenUsage: ctx.tokenUsage,
    workdir: ctx.work,
    commands: ctx.commandTranscript,
    ...details,
  };
}

function ev001(ctx) {
  const pack = ixSpecJson(ctx, [
    "write",
    ctx.repo,
    "--types",
    "FR,domain,entity",
  ]);
  assertEqual(pack.types.length, 3, "expected three authoring contracts");
  copyContract(pack, "FR", join(ctx.repo, "spec", "FR-001.md"));
  copyContract(pack, "domain", join(ctx.repo, "spec", "domain-001.md"));
  copyContract(pack, "entity", join(ctx.repo, "spec", "entity-001.md"));
  validate(ctx, ["spec/**/*.md"]);
  return { expectedFiles: 3 };
}

function ev002(ctx) {
  cpSkeleton(
    "spec_artifacts_iso",
    "fr.md",
    join(ctx.repo, "spec", "FR-002.md"),
  );
  replaceInFile(
    join(ctx.repo, "spec", "FR-002.md"),
    "Verify checksums on artifact import",
    "Verify signed release manifest",
  );
  ixSpec(ctx, ["catalog", "show", "FR"]);
  const pack = ixSpecJson(ctx, ["write", ctx.repo, "--types", "FR"]);
  assert(pack.types[0].schemaPath, "FR authoring pack should include schema");
  validate(ctx, ["spec/FR-002.md"]);
}

function ev003(ctx) {
  const plugin = makePlugin(ctx.work, "spec-objects-local", "local-widget");
  ixSpecJson(ctx, ["plugin", "install", `path:${plugin}`]);
  const list = ixSpecJson(ctx, ["plugin", "list"]);
  assert(
    list.plugins.some((entry) => entry.name === "spec-objects-local"),
    "installed plugin missing from plugin list",
  );
  const pack = ixSpecJson(ctx, ["write", ctx.repo, "--types", "local-widget"]);
  copyContract(pack, "local-widget", join(ctx.repo, "spec", "local-widget.md"));
  validate(ctx, ["spec/local-widget.md"], {
    IX_SCHEMA_PATH: `${builtinModules}:${join(ctx.ixHome, "modules")}`,
  });
}

function ev004(ctx) {
  cpSkeleton(
    "spec_artifacts_iso",
    "fr.md",
    join(ctx.repo, "spec", "FR-004.md"),
  );
  cpSkeleton(
    "spec_objects_business",
    "domain.md",
    join(ctx.repo, "spec", "domain-004.md"),
  );
  validate(ctx, ["spec/FR-*.md", "spec/domain-*.md"]);
}

function ev005(ctx) {
  const created = ixSpecJson(ctx, [
    "review",
    "--json",
    "--id",
    "eval-review",
    "--target",
    "spec/",
  ]);
  assert(created.ok === true, "review flow did not start");
  const status = ixFlowJson(ctx, ["status", "eval-review"]);
  assertEqual(status.summary?.defName, "review", "review status mismatch");
}

function ev006(ctx) {
  const pack = ixSpecJson(ctx, ["write", ctx.repo, "--types", "FR,domain"]);
  copyContract(pack, "domain", join(ctx.repo, "spec", "domain-006.md"));
  copyContract(pack, "FR", join(ctx.repo, "spec", "FR-006-a.md"));
  copyContract(pack, "FR", join(ctx.repo, "spec", "FR-006-b.md"));
  validate(ctx, ["spec/**/*.md"]);
  return { contextFetchesObserved: ctx.contextFetches };
}

function ev007(ctx) {
  const pack = ixSpecJson(ctx, ["write", ctx.repo, "--types", "fr,domain"]);
  assertEqual(pack.types[0].name, "FR", "lowercase fr did not resolve to FR");
  assertEqual(pack.types[1].name, "domain", "domain did not resolve");
}

function ev008(ctx) {
  cpSkeleton(
    "spec_artifacts_iso",
    "fr.md",
    join(ctx.repo, "spec", "FR-008.md"),
  );
  removeSection(join(ctx.repo, "spec", "FR-008.md"), "Acceptance Criteria");
  const first = validate(ctx, ["spec/FR-008.md"], {}, { expectFailure: true });
  assert(
    first.stderr.includes("Acceptance Criteria") ||
      first.stderr.includes("missing"),
    "expected useful validation diagnostic",
  );
  appendAcceptanceCriteria(join(ctx.repo, "spec", "FR-008.md"), "FR-001");
  validate(ctx, ["spec/FR-008.md"]);
}

function ev009(ctx) {
  const plugin = makePlugin(
    ctx.work,
    "spec-objects-lifecycle",
    "lifecycle-object",
  );
  ixSpecJson(ctx, ["plugin", "install", `path:${plugin}`]);
  assertPlugin(ctx, "spec-objects-lifecycle", true);
  ixSpec(ctx, ["plugin", "remove", "spec-objects-lifecycle"]);
  assertPlugin(ctx, "spec-objects-lifecycle", false);
  ixSpecJson(ctx, ["plugin", "install", `path:${plugin}`]);
  assertPlugin(ctx, "spec-objects-lifecycle", true);
}

function ev010(ctx) {
  const moduleRoot = makePlugin(
    ctx.work,
    "spec-objects-package-mock",
    "package-object",
  );
  const installedRoot = join(
    ctx.ixHome,
    "modules",
    "spec-objects-package-mock",
  );
  mkdirSync(join(ctx.ixHome, "modules"), { recursive: true });
  symlinkSync(moduleRoot, installedRoot, "dir");
  mkdirSync(join(ctx.ixHome, "plugins"), { recursive: true });
  writeFileSync(
    join(ctx.ixHome, "plugins", "registry.json"),
    `${JSON.stringify(
      {
        plugins: [
          {
            name: "spec-objects-package-mock",
            source: "package:@agent-ix/spec-objects-package-mock",
            moduleRoot,
            installedAt: new Date().toISOString(),
          },
        ],
      },
      null,
      2,
    )}\n`,
  );
  const pack = ixSpecJson(ctx, [
    "write",
    ctx.repo,
    "--types",
    "package-object",
  ]);
  assertEqual(pack.types[0].moduleName, "spec-objects-package-mock");
}

function ev011(ctx) {
  const result = ixSpec(ctx, ["write", ctx.repo, "--types", "no-such-type"], {
    expectFailure: true,
  });
  assert(result.stderr.includes("catalog type not found: no-such-type"));
}

function ev012(ctx) {
  mkdirSync(join(ctx.repo, "spec", "good"), { recursive: true });
  mkdirSync(join(ctx.repo, "spec", "bad"), { recursive: true });
  cpSkeleton(
    "spec_artifacts_iso",
    "fr.md",
    join(ctx.repo, "spec", "good", "FR-012.md"),
  );
  cpSkeleton(
    "spec_artifacts_iso",
    "fr.md",
    join(ctx.repo, "spec", "bad", "FR-012.md"),
  );
  removeSection(
    join(ctx.repo, "spec", "bad", "FR-012.md"),
    "Acceptance Criteria",
  );
  const result = validate(
    ctx,
    ["spec/good/*.md", "spec/bad/*.md"],
    {},
    { expectFailure: true },
  );
  assert(result.stderr.includes("spec/bad/FR-012.md"));
}

function ev013(ctx) {
  const matrix = ixSpecJson(ctx, [
    "matrix",
    "--json",
    "--id",
    "eval-matrix",
    "--target",
    "spec/",
  ]);
  const plan = ixSpecJson(ctx, [
    "to-plan",
    "--json",
    "--id",
    "eval-to-plan",
    "--target",
    "spec/",
  ]);
  assert(matrix.ok === true, "matrix flow did not start");
  assert(plan.ok === true, "to-plan flow did not start");
  assertEqual(
    ixFlowJson(ctx, ["status", "eval-matrix"]).summary?.defName,
    "matrix",
  );
  assertEqual(
    ixFlowJson(ctx, ["status", "eval-to-plan"]).summary?.defName,
    "to-plan",
  );
}

function ev014(ctx) {
  cpSkeleton(
    "spec_artifacts_iso",
    "spec.md",
    join(ctx.repo, "spec", "spec.md"),
  );
  cpSkeleton(
    "spec_artifacts_iso",
    "us.md",
    join(ctx.repo, "spec", "US-014.md"),
  );
  writePlan(ctx, join(ctx.repo, "spec", "plan.md"));
  writeMatrix(ctx, join(ctx.repo, "spec", "matrix.md"));
  writeEvalMatrix(ctx, join(ctx.repo, "spec", "evals.md"));
  ixSpecJson(ctx, [
    "write",
    ctx.repo,
    "--types",
    "master-requirements,US,Plan,TestMatrix",
  ]);
  validate(ctx, ["spec/**/*.md"]);
}

function ev015(ctx) {
  const devModule = makePlugin(
    join(ctx.work, "spec-objects-business"),
    "spec-objects-business",
    "domain",
    "DEV DOMAIN SKELETON MARKER",
  );
  const pack = ixSpecJson(ctx, ["write", ctx.repo, "--types", "domain"], {
    IX_SPEC_MODULE_PATHS: devModule,
  });
  assertEqual(pack.types[0].moduleRoot, devModule);
  assert(
    readFileSync(pack.types[0].skeletonPath, "utf8").includes("DEV DOMAIN"),
  );
}

function ixSpecJson(ctx, args, extraEnv = {}) {
  const result = ixSpec(ctx, [...args, "--json"], { extraEnv });
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    throw new Error(
      `failed to parse ix-spec JSON for ${args.join(" ")}: ${result.stdout}`,
    );
  }
}

function ixSpec(ctx, args, opts = {}) {
  const env = {
    IX_HOME: ctx.ixHome,
    ...opts.extraEnv,
  };
  const result = run(ctx, process.execPath, [ixSpecBin, ...args], {
    cwd: ctx.repo,
    env,
    expectFailure: opts.expectFailure,
  });
  if (args[0] === "write") ctx.contextFetches += 1;
  return result;
}

function ixFlowJson(ctx, args) {
  const result = run(
    ctx,
    "ix-flow",
    [...args, "--json", "--config-root", ctx.ixHome],
    { cwd: ctx.repo, env: { IX_HOME: ctx.ixHome } },
  );
  return JSON.parse(result.stdout);
}

function validate(ctx, globs, extraEnv = {}, opts = {}) {
  ctx.validationAttempts += 1;
  return run(ctx, quireBin, ["validate", "--scope", ctx.repo, ...globs], {
    cwd: ctx.repo,
    env: {
      IX_SCHEMA_PATH: builtinModules,
      ...extraEnv,
    },
    expectFailure: opts.expectFailure,
  });
}

function run(ctx, command, args, opts = {}) {
  ctx.toolCalls += 1;
  const started = performance.now();
  const child = spawnSync(command, args, {
    cwd: opts.cwd ?? ctx.repo,
    env: { ...process.env, ...opts.env },
    encoding: "utf8",
  });
  const durationMs = Math.round(performance.now() - started);
  const result = {
    command: [command, ...args].join(" "),
    exitCode: child.status ?? 1,
    stdout: child.stdout ?? "",
    stderr: child.stderr ?? "",
    durationMs,
  };
  ctx.commandTranscript.push(result);
  const failed = result.exitCode !== 0;
  if (opts.expectFailure) {
    if (!failed) throw new Error(`expected command to fail: ${result.command}`);
  } else if (failed) {
    throw new Error(
      `command failed (${result.exitCode}): ${result.command}\n${result.stderr}`,
    );
  }
  return result;
}

function copyContract(pack, name, target) {
  const contract = pack.types.find((type) => type.name === name);
  assert(contract, `missing authoring contract for ${name}`);
  assert(contract.skeletonPath, `missing skeleton for ${name}`);
  mkdirSync(dirname(target), { recursive: true });
  cpSync(contract.skeletonPath, target);
}

function cpSkeleton(moduleName, file, target) {
  mkdirSync(dirname(target), { recursive: true });
  cpSync(join(builtinModules, moduleName, "skeletons", file), target);
}

function makePlugin(parent, moduleName, typeName, marker = "") {
  const rootDir =
    moduleName === "spec-objects-business" ? parent : join(parent, moduleName);
  mkdirSync(join(rootDir, "skeletons"), { recursive: true });
  writeFileSync(
    join(rootDir, "manifest.yaml"),
    `manifest_version: 1.0.0
name: ${moduleName}
version: 0.0.1
artifact_types: []
object_types:
  - name: ${typeName}
    data_schema:
      type: object
    body_extraction:
      yield_pattern:
        match:
          id:
            from: frontmatter_field
            path: [id]
            required: true
          title:
            from: frontmatter_field
            path: [title]
            required: true
          artifact_type:
            from: frontmatter_field
            path: [artifact_type]
            required: true
          summary:
            from: section_body
            after_heading: Summary
            required: true
`,
  );
  writeFileSync(
    join(rootDir, "skeletons", `${typeName}.md`),
    `---
id: ${typeName}-001
title: "${typeName} fixture"
artifact_type: ${typeName}
---
# [${typeName}-001] ${typeName} fixture

## Summary

${marker || `This ${typeName} fixture provides a deterministic plugin object.`}
`,
  );
  return rootDir;
}

function assertPlugin(ctx, name, present) {
  const list = ixSpecJson(ctx, ["plugin", "list"]);
  const found = list.plugins.some((entry) => entry.name === name);
  assertEqual(found, present, `plugin ${name} presence mismatch`);
}

function replaceInFile(path, from, to) {
  writeFileSync(path, readFileSync(path, "utf8").replace(from, to));
}

function removeSection(path, heading) {
  const text = readFileSync(path, "utf8");
  const pattern = new RegExp(
    `\\n## ${escapeRegExp(heading)}\\n[\\s\\S]*?(?=\\n## |$)`,
  );
  writeFileSync(path, text.replace(pattern, "\n"));
}

function appendAcceptanceCriteria(path, id) {
  writeFileSync(
    path,
    `${readFileSync(path, "utf8").trimEnd()}

## Acceptance Criteria

| ID | Criteria | Verification |
|----|----------|--------------|
| ${id}-AC-1 | The repaired artifact validates successfully | Inspection |
`,
  );
}

function writePlan(ctx, target) {
  writeFileSync(
    target,
    `---
id: PLAN-014
title: "Phase 0 implementation plan"
artifact_type: Plan
---
# Phase 0 implementation plan

## Tasks

| ID | Task | Status |
|----|------|--------|
| Task-001 | Author the root spec artifacts. | Done |
`,
  );
}

function writeMatrix(ctx, target) {
  writeFileSync(
    target,
    `---
id: MAT-014
title: "Phase 0 test matrix"
artifact_type: TestMatrix
---
# Phase 0 test matrix

| Requirement | Coverage | Evidence |
|-------------|----------|----------|
| FR-014 | Covered | EV-014 validates the authored spec set |
`,
  );
}

function writeEvalMatrix(ctx, target) {
  writeFileSync(
    target,
    `---
id: MAT-015
title: "Phase 0 eval matrix"
artifact_type: TestMatrix
---
# Phase 0 eval matrix

| Eval | Use Case | Expected Outcome |
|------|----------|------------------|
| EV-014 | US-001 | Spec set validates |
`,
  );
}

function findQuire() {
  const candidates = [
    resolve(root, "..", "quire-cli", "target", "debug", "quire"),
    resolve(root, "..", "quire-cli", "target", "release", "quire"),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return "quire";
}

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function assert(condition, message = "assertion failed") {
  if (!condition) throw new Error(message);
}

function assertEqual(actual, expected, message = "values differ") {
  if (actual !== expected) {
    throw new Error(
      `${message}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

main();
