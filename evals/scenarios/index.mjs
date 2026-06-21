// Declarative eval scenarios (EV-001..EV-015 from spec/evals.md).
//
// Each scenario: { id, useCase, prompt, expect, setup?(ctx), env?(ctx) }.
//  - prompt:  task text for the agent (string or (ctx)=>string). The EV "Prompt" column.
//  - setup:   optional pre-seed of brownfield/broken/plugin/dev-module fixtures into ctx.
//             May stash data on ctx.data for prompt(ctx)/env(ctx).
//  - env:     optional (ctx)=>extra env for BOTH the agent run and the ground-truth
//             assertion (e.g. QUOIN_MODULE_PATHS).
//  - expect:  ground-truth success checks (see lib/assert.mjs):
//             files, validate, artifacts, flow, cliRejects, plugin, resolvesTo, sentinel.
//
// EV-021..EV-025 are the artifact-completeness set: they drive `/specify` for
// request shapes (new project / add US / edit FR / add US+FR / backport) and use
// the `artifacts` check to assert the EXACT artifact types were authored as
// discrete files (an FR written only as a row in spec.md's table fails).
//
// The two canaries (EV-001 greenfield, EV-008 repair loop) are the cheapest, highest
// -signal scenarios; `--canary` runs only those.

import {
  copySkeleton,
  removeSection,
  makeLocalPlugin,
  makeDevModule,
  makeRepos,
  removeSeededModule,
  writeRepoFile,
} from "../lib/fixtures.mjs";

export const SCENARIOS = [
  {
    id: "EV-001",
    useCase: "US-001",
    prompt:
      "Create a Functional Requirement (FR) plus a `domain` object and an `entity` " +
      "object for a small feature of your choice (for example: a user can export a " +
      "report). Author one file per type under spec/.",
    expect: {
      files: ["spec/**/*.md"],
      validate: { globs: ["spec/**/*.md"], shouldPass: true },
    },
  },
  {
    id: "EV-002",
    useCase: "US-002",
    setup(ctx) {
      copySkeleton(ctx, "spec-artifacts-iso", "fr.md", "spec/FR-002.md");
    },
    prompt:
      "The repo already contains spec/FR-002.md. Discover its authoring contract " +
      "(e.g. `quoin catalog show FR` or `quoin write`), then edit only the " +
      "sections needed to change the requirement to be about verifying a signed " +
      "release manifest. Keep it valid and re-validate the changed file.",
    expect: {
      files: ["spec/FR-002.md"],
      validate: { globs: ["spec/FR-002.md"], shouldPass: true },
    },
  },
  {
    id: "EV-003",
    useCase: "US-003",
    setup(ctx) {
      ctx.data.pluginPath = makeLocalPlugin(
        ctx.work,
        "spec-objects-local",
        "local-widget",
      );
    },
    prompt: (ctx) =>
      `Install the local plugin at \`path:${ctx.data.pluginPath}\` using ` +
      "`quoin plugin install`, then author one `local-widget` object under spec/ " +
      "and validate it.",
    expect: {
      plugin: { name: "spec-objects-local", present: true },
      files: ["spec/**/*.md"],
      validate: { globs: ["spec/**/*.md"], shouldPass: true },
    },
  },
  {
    id: "EV-004",
    useCase: "US-004",
    setup(ctx) {
      copySkeleton(ctx, "spec-artifacts-iso", "fr.md", "spec/FR-004.md");
      copySkeleton(
        ctx,
        "spec-objects-business",
        "domain.md",
        "spec/domain-004.md",
      );
    },
    prompt:
      "The repo contains a changed set of spec files (spec/FR-004.md and " +
      "spec/domain-004.md). Run scoped Quire validation over just those files and " +
      "report the result clearly.",
    expect: {
      files: ["spec/FR-004.md", "spec/domain-004.md"],
      validate: {
        globs: ["spec/FR-*.md", "spec/domain-*.md"],
        shouldPass: true,
      },
    },
  },
  {
    id: "EV-005",
    useCase: "US-005",
    setup(ctx) {
      copySkeleton(ctx, "spec-artifacts-iso", "fr.md", "spec/FR-005.md");
    },
    prompt:
      "Start a review workflow for the spec/ directory with " +
      "`quoin review --target spec/ --id eval-review`, then inspect it with " +
      "`ix-flow status eval-review`.",
    expect: {
      flow: [{ id: "eval-review", defName: "review" }],
    },
  },
  {
    id: "EV-006",
    useCase: "US-001,US-004",
    prompt:
      "Create two Functional Requirements and one `domain` object that share object " +
      "templates. Fetch each type's authoring contract only ONCE (one `quoin write` " +
      "per type) and reuse it across the files. Validate all of them.",
    expect: {
      files: ["spec/**/*.md"],
      validate: { globs: ["spec/**/*.md"], shouldPass: true },
    },
  },
  {
    id: "EV-007",
    useCase: "US-002",
    prompt:
      "Author one FR and one domain object, requesting them with LOWERCASE type names " +
      "(use `quoin write . --types fr,domain`). The CLI should resolve them to the " +
      "canonical types. Validate the result.",
    expect: {
      files: ["spec/**/*.md"],
      validate: { globs: ["spec/**/*.md"], shouldPass: true },
    },
  },
  {
    id: "EV-008",
    useCase: "US-004",
    prompt:
      "The file spec/FR-008.md currently FAILS validation. Run " +
      '`quire validate --scope . "spec/FR-008.md"`, read the diagnostics, repair the ' +
      "file so it conforms to the FR archetype, and re-validate until it passes.",
    setup(ctx) {
      const target = copySkeleton(
        ctx,
        "spec-artifacts-iso",
        "fr.md",
        "spec/FR-008.md",
      );
      removeSection(target, "Acceptance Criteria");
    },
    expect: {
      files: ["spec/FR-008.md"],
      validate: { globs: ["spec/FR-008.md"], shouldPass: true },
    },
  },
  {
    id: "EV-009",
    useCase: "US-003",
    setup(ctx) {
      ctx.data.pluginPath = makeLocalPlugin(
        ctx.work,
        "spec-objects-lifecycle",
        "lifecycle-object",
      );
    },
    prompt: (ctx) =>
      `Using the local plugin at \`path:${ctx.data.pluginPath}\`: install it, list ` +
      "plugins to confirm, remove it, then reinstall it. Confirm the catalog reflects " +
      "each step. Leave it installed at the end.",
    expect: {
      plugin: { name: "spec-objects-lifecycle", present: true },
    },
  },
  {
    id: "EV-010",
    useCase: "US-003",
    // Local "packaged" plugin stand-in (versioned manifest) for the install→resolve
    // →author→validate path. EV-020 covers a REAL `github:owner/repo//subdir` install
    // that clones from GitHub over the network.
    setup(ctx) {
      ctx.data.pluginPath = makeLocalPlugin(
        ctx.work,
        "spec-objects-package",
        "package-widget",
      );
    },
    prompt: (ctx) =>
      `Install the packaged plugin at \`path:${ctx.data.pluginPath}\`, then request ` +
      "its `package-widget` type via `quoin write` and author one such object under " +
      "spec/. Validate it.",
    expect: {
      plugin: { name: "spec-objects-package", present: true },
      files: ["spec/**/*.md"],
      validate: { globs: ["spec/**/*.md"], shouldPass: true },
    },
  },
  {
    id: "EV-011",
    useCase: "US-002",
    prompt:
      "Attempt to create an authoring pack for an unknown type by running " +
      "`quoin write . --types no-such-type`. The CLI should report the missing type " +
      "and exit non-zero. Confirm that it does, then finish (do not author any file).",
    expect: {
      cliRejects: ["no-such-type"],
    },
  },
  {
    id: "EV-012",
    useCase: "US-004",
    setup(ctx) {
      copySkeleton(ctx, "spec-artifacts-iso", "fr.md", "spec/good/FR-012.md");
      const bad = copySkeleton(
        ctx,
        "spec-artifacts-iso",
        "fr.md",
        "spec/bad/FR-012.md",
      );
      removeSection(bad, "Acceptance Criteria");
    },
    prompt:
      "Validate two globs for a changed-file subset: `spec/good/*.md` and " +
      "`spec/bad/*.md`. Report which files pass and which fail (with their paths). " +
      "One of them is intentionally invalid; do not fix it — just report.",
    expect: {
      files: ["spec/good/FR-012.md", "spec/bad/FR-012.md"],
    },
  },
  {
    id: "EV-013",
    useCase: "US-005",
    setup(ctx) {
      copySkeleton(ctx, "spec-artifacts-iso", "fr.md", "spec/FR-013.md");
    },
    prompt:
      "After requirements are accepted, start a matrix workflow with " +
      "`quoin matrix --target spec/ --id eval-matrix` and a to-plan workflow with " +
      "`quoin to-plan --target spec/ --id eval-to-plan`. Inspect both runs with " +
      "`ix-flow status`.",
    expect: {
      flow: [
        { id: "eval-matrix", defName: "matrix" },
        { id: "eval-to-plan", defName: "to-plan" },
      ],
    },
  },
  {
    id: "EV-014",
    useCase: "US-001,US-002",
    // Stretch scenario: a full early-phase spec set. Some process types (Plan,
    // TestMatrix, master-requirements) ship a schema but no skeleton, so the agent
    // must read the schema/manifest to author a valid body.
    prompt:
      "Author a Phase 0 spec set from a settled idea: a `master-requirements` spec, a " +
      "user story (`US`), a functional requirement (`FR`), a `Plan`, and a " +
      "`TestMatrix` — one file each under spec/. Use `quoin write` to fetch the " +
      "contracts. Validate the whole set.",
    expect: {
      files: ["spec/**/*.md"],
      validate: { globs: ["spec/**/*.md"], shouldPass: true },
    },
  },
  {
    id: "EV-015",
    useCase: "US-001,US-004",
    setup(ctx) {
      ctx.data.devModulePath = makeDevModule(ctx, {
        moduleName: "spec-objects-business-dev",
        type: "domain",
        srcModule: "spec-objects-business",
        marker: "DEV DOMAIN SKELETON MARKER",
      });
    },
    env: (ctx) => ({ QUOIN_MODULE_PATHS: ctx.data.devModulePath }),
    prompt:
      "A sibling development module is present (via QUOIN_MODULE_PATHS) that " +
      "redefines the `domain` object. Author one `domain` object under spec/. The " +
      "catalog should prefer the dev module deterministically. Validate the result.",
    expect: {
      resolvesTo: { type: "domain", moduleNameIncludes: "business-dev" },
      files: ["spec/**/*.md"],
      validate: { globs: ["spec/**/*.md"], shouldPass: true },
    },
  },

  // ---- Extended scenarios (beyond the original spec/evals.md EV-001..EV-015) ----

  {
    id: "EV-016",
    useCase: "US-001,US-004",
    // Multi-repo: author into two sibling repos in one session; cwd + validation
    // scope are repointed to the parent workspace by makeRepos().
    setup(ctx) {
      makeRepos(ctx, ["core", "service"]);
    },
    prompt:
      "This workspace contains TWO repos: `core/` and `service/`. Author a " +
      "Functional Requirement under `core/spec/` and a `domain` object under " +
      "`service/spec/` (use `quoin write <repo> --types ...` per repo). Validate " +
      'both with a single scoped run: `quire validate --scope . "core/spec/**/*.md" ' +
      '"service/spec/**/*.md"`.',
    expect: {
      files: ["core/spec/**/*.md", "service/spec/**/*.md"],
      validate: {
        globs: ["core/spec/**/*.md", "service/spec/**/*.md"],
        shouldPass: true,
      },
    },
  },
  {
    id: "EV-017",
    useCase: "US-001,US-002",
    // Larger, realistic feature spec set with cross-references — sustained authoring.
    prompt:
      'Author a fuller feature spec under spec/ for a settled feature (e.g. "users ' +
      'can schedule reports"): one Stakeholder Requirement (`StR`), two User Stories ' +
      "(`US`), three Functional Requirements (`FR`), one Non-Functional Requirement " +
      "(`NFR`), one `domain` object, and two `entity` objects — each in its own file, " +
      "with sensible cross-references in the bodies. Fetch each type's contract once " +
      "via `quoin write`, then validate the whole set.",
    expect: {
      files: [
        "spec/StR-*.md",
        "spec/US-*.md",
        "spec/FR-*.md",
        "spec/NFR-*.md",
        "spec/domain-*.md",
        "spec/entity-*.md",
      ],
      validate: { globs: ["spec/**/*.md"], shouldPass: true },
    },
  },
  {
    id: "EV-018",
    useCase: "US-001",
    // Objects drawn from THREE different object modules in one spec — exercises
    // multi-module catalog resolution in a single authoring pass.
    prompt:
      "Author three objects that come from different modules, one file each under " +
      "spec/: a `domain` (business), an `api_endpoint` (architecture), and a " +
      "`configuration` (operational). Request them together with " +
      "`quoin write . --types domain,api_endpoint,configuration`, author from the " +
      "skeletons, and validate.",
    expect: {
      files: ["spec/**/*.md"],
      validate: { globs: ["spec/**/*.md"], shouldPass: true },
    },
  },
  {
    id: "EV-020",
    useCase: "US-003",
    // REAL GitHub install: remove the operational module from the seeded home, then
    // the agent installs it from GitHub via the subdir source and authors one of its
    // (skeleton-backed) types. `agentRan` asserts the agent's own github install
    // command succeeded (a later write also lazily reconciles defaults, so the type
    // resolving alone wouldn't prove the agent did the install).
    setup(ctx) {
      removeSeededModule(ctx, "spec-objects-operational");
    },
    prompt:
      "The `spec-objects-operational` module is not installed. Install it FROM GITHUB " +
      "with `quoin plugin install " +
      "github:agent-ix/spec-objects-operational//spec_objects_operational@v0.2.0` " +
      "(this clones the module's subdirectory from GitHub). Then author one " +
      "`configuration` object under spec/ from its skeleton and validate it.",
    expect: {
      agentRan: [
        {
          pattern: "plugin install\\s+[\"']?github:[^\\s\"']*//",
          desc: "github subdir install",
        },
      ],
      files: ["spec/**/*.md"],
      validate: { globs: ["spec/**/*.md"], shouldPass: true },
    },
  },

  // --- EV-021..EV-025: artifact-completeness for spec-change requests ---------
  {
    id: "EV-021",
    useCase: "US-001",
    prompt:
      "Start a new spec for a small URL-shortener service: a user submits a long " +
      "URL and gets back a short code that later redirects to the original. " +
      "Initialize the spec: create the master spec.md (the master-requirements " +
      "root/index) plus the user story and the functional requirement that " +
      "implements it — each as its own file in its OKF directory.",
    expect: {
      files: ["spec/spec.md"],
      artifacts: {
        require: {
          US: { min: 1, dir: "spec/usecase" },
          FR: { min: 1, dir: "spec/functional" },
        },
      },
      validate: { globs: ["spec/**/*.md"], shouldPass: true },
    },
  },
  {
    id: "EV-022",
    useCase: "US-001",
    setup(ctx) {
      copySkeleton(
        ctx,
        "spec-artifacts-iso",
        "us.md",
        "spec/usecase/US-001-existing.md",
      );
    },
    prompt:
      "The repo already contains spec/usecase/US-001-existing.md. Add a SECOND " +
      "user story for a different capability (for example: an administrator " +
      "disables a short code). Author it as its own file. Do not write functional " +
      "or non-functional requirements.",
    expect: {
      artifacts: {
        require: { US: { min: 2, dir: "spec/usecase" } },
        absent: ["FR", "NFR", "IT"],
      },
      validate: { globs: ["spec/**/*.md"], shouldPass: true },
    },
  },
  {
    id: "EV-023",
    useCase: "US-002",
    setup(ctx) {
      copySkeleton(
        ctx,
        "spec-artifacts-iso",
        "fr.md",
        "spec/functional/FR-001-checksums.md",
      );
    },
    prompt:
      "The repo has spec/functional/FR-001-checksums.md. Edit ONLY that file to " +
      "change the requirement to be about verifying a signed release manifest. " +
      "Keep it valid and re-validate. Do not create any new artifacts.",
    expect: {
      artifacts: {
        require: { FR: { min: 1, dir: "spec/functional" } },
        absent: ["US", "NFR", "IT"],
      },
      validate: {
        globs: ["spec/functional/FR-001-checksums.md"],
        shouldPass: true,
      },
    },
  },
  {
    id: "EV-024",
    useCase: "US-001",
    prompt:
      "Add a user story for a user exporting their data as a CSV file, and the " +
      "functional requirement that implements it. Author each as its own artifact " +
      "file and trace the FR back to the user story.",
    expect: {
      artifacts: {
        require: {
          US: { min: 1, dir: "spec/usecase" },
          FR: { min: 1, dir: "spec/functional" },
        },
      },
      validate: { globs: ["spec/**/*.md"], shouldPass: true },
    },
  },
  {
    id: "EV-025",
    useCase: "US-001",
    setup(ctx) {
      writeRepoFile(
        ctx,
        "src/shorten.mjs",
        [
          "// Maps a long URL to a 6-char base62 code and stores the pair.",
          "export function shorten(url, store) {",
          "  if (!/^https?:\\/\\//.test(url)) throw new Error('invalid url');",
          "  const code = Math.abs(hash(url)).toString(36).slice(0, 6);",
          "  store.set(code, url);",
          "  return code;",
          "}",
          "export function resolve(code, store) {",
          "  if (!store.has(code)) throw new Error('unknown code');",
          "  return store.get(code);",
          "}",
          "function hash(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return h; }",
          "",
        ].join("\n"),
      );
    },
    prompt:
      "Backport a spec from the code in src/shorten.mjs. Capture its behavior as " +
      "functional requirement artifacts under spec/functional/ (not just a summary " +
      "table). Validate the spec files.",
    expect: {
      artifacts: { require: { FR: { min: 1, dir: "spec/functional" } } },
      validate: { globs: ["spec/**/*.md"], shouldPass: true },
    },
  },
  {
    // Direct-render spec-review: one validated SpecReview doc per selected
    // analysis, with the coverage gate enforcing the chosen set.
    id: "EV-026",
    useCase: "US-005",
    setup(ctx) {
      copySkeleton(
        ctx,
        "spec-artifacts-iso",
        "fr.md",
        "spec/functional/FR-001.md",
      );
    },
    // The agent runs a subset spec-review and produces one validated SpecReview
    // doc per selected analysis. (EV-005 separately covers the ix-flow workflow
    // lifecycle.) The two `agentRan` guardrails assert the durable behaviors:
    // reference quoin for the template + validate with quire.
    //
    // REQUIRES spec-artifacts-process >= 0.3.0 (the SpecReview archetype +
    // skeleton). Until that release is pinned in default-modules.yaml, the eval
    // seed reconciles v0.2.0 (no SpecReview), so `quoin write --types SpecReview`
    // is "catalog type not found" and the template-fetch guardrail fails.
    prompt:
      "Run a spec review of the spec/ directory using the spec-review skill " +
      "(`quoin review --target spec/ --id eval-specreview`). Choose the `subset` " +
      "review set with exactly the analyses `integrity` and `dependency`. Fetch the " +
      "SpecReview template from quoin first with `quoin write --types SpecReview` and " +
      "author from it. Produce " +
      "ONE SpecReview document per selected analysis under spec/reviews/ " +
      "(spec/reviews/integrity.md and spec/reviews/dependency.md) — each with " +
      "`type: SpecReview` frontmatter, a `## Summary`, and a `## Findings` table " +
      "(columns ID | Severity | Summary | Refs, FND-NNN ids, Severity one of " +
      "low/medium/high). Validate them with quire so they pass.",
    expect: {
      // Guardrails (over many uses, keep deviations rare): the agent MUST
      // reference quoin for the template (not invent the format) and MUST
      // validate its output with quire.
      agentRan: [
        {
          pattern: "quoin\\s+write\\b[\\s\\S]*[Ss]pec[Rr]eview",
          desc: "fetch the SpecReview template from quoin (quoin write --types SpecReview)",
        },
        {
          pattern: "quire\\s+validate\\b",
          desc: "validate the docs with quire",
        },
      ],
      files: ["spec/reviews/integrity.md", "spec/reviews/dependency.md"],
      validate: { globs: ["spec/reviews/*.md"], shouldPass: true },
    },
  },
  {
    // spec-to-plan emits a multi-plan bundle: plan/<Plan-id>-<slug>/ with a
    // type: Plan plan.md, type: Task task files, and the reserved index.md/log.md.
    // The DAG/ownership/test traces live in each Task's `relationships:`
    // (depends_on/references/verifies). This asserts the bundle is authored as
    // discrete Plan + Task artifacts and validates.
    //
    // REQUIRES spec-artifacts-process schemas that accept mixed-case Plan/Task ids
    // (Plan-001/Task-001). Until that release is pinned in default-modules.yaml,
    // the bundle fails `quire validate` on the id pattern.
    id: "EV-027",
    useCase: "US-008",
    setup(ctx) {
      copySkeleton(
        ctx,
        "spec-artifacts-iso",
        "fr.md",
        "spec/functional/FR-001.md",
      );
    },
    prompt:
      "Requirements are accepted in spec/. Use the spec-to-plan skill to create a " +
      "NEW implementation plan as a bundle under plan/ — a directory " +
      "plan/<Plan-id>-<slug>/ containing a `type: Plan` plan.md, an index.md " +
      "(`type: index`), a log.md (`type: log`), and a tasks/ directory of " +
      "`type: Task` files. Decompose into at least 3 tasks and encode the " +
      "dependencies as `relationships: depends_on` edges in the task frontmatter " +
      "(plus `references` to the requirement and `verifies` to its test cases). " +
      "Validate the whole bundle with quire so it passes.",
    expect: {
      artifacts: {
        require: {
          Plan: { min: 1, dir: "plan" },
          Task: { min: 3, dir: "plan" },
        },
      },
      files: ["plan/**/index.md", "plan/**/log.md", "plan/**/tasks/*.md"],
      validate: { globs: ["plan/**/*.md"], shouldPass: true },
    },
  },
  {
    // Step-0 multi-plan selection: a project already holds Plan-001; the agent must
    // start a SECOND, independent plan (Plan-002) without disturbing the first.
    // Asserts >=2 Plan artifacts and a Plan-002 bundle, all validating.
    //
    // REQUIRES spec-artifacts-process schemas that accept mixed-case Plan/Task ids
    // (see EV-027 note).
    id: "EV-028",
    useCase: "US-008",
    setup(ctx) {
      copySkeleton(
        ctx,
        "spec-artifacts-iso",
        "fr.md",
        "spec/functional/FR-001.md",
      );
      // Seed an existing, valid Plan-001 bundle.
      writeRepoFile(
        ctx,
        "plan/Plan-001-seed/plan.md",
        [
          "---",
          "id: Plan-001",
          'title: "Seed plan"',
          "type: Plan",
          "status: active",
          "relationships:",
          "  - target: ix://agent-ix/eval/FR-001",
          "    type: references",
          "---",
          "# Plan-001: Seed plan",
          "",
          "## Scope",
          "Pre-existing plan in this project.",
          "",
        ].join("\n"),
      );
      writeRepoFile(
        ctx,
        "plan/Plan-001-seed/index.md",
        [
          "---",
          "type: index",
          'title: "Plan-001 — Seed plan"',
          'description: "Contents of the Plan-001 bundle."',
          'okf_version: "0.1"',
          "---",
          "# Plan-001 — Seed plan",
          "",
          "## Contents",
          "",
          "* [Plan-001: Seed plan](./plan.md) - Plan overview.",
          "* [Task-001: seed task](./tasks/Task-001-seed.md) - Seed task.",
          "",
        ].join("\n"),
      );
      writeRepoFile(
        ctx,
        "plan/Plan-001-seed/log.md",
        [
          "---",
          "type: log",
          'title: "Plan-001 — Update Log"',
          'description: "Change log for the Plan-001 bundle."',
          "---",
          "# Plan-001 — Update Log",
          "",
          "## History",
          "",
          "* **2026-06-21** — Seed plan created.",
          "",
        ].join("\n"),
      );
      writeRepoFile(
        ctx,
        "plan/Plan-001-seed/tasks/Task-001-seed.md",
        [
          "---",
          "id: Task-001",
          'title: "seed task"',
          "type: Task",
          "status: not_started",
          "track: A",
          "priority: P1",
          "relationships:",
          "  - target: ix://agent-ix/eval/FR-001",
          "    type: references",
          "---",
          "# Task-001: seed task",
          "",
          "## Scope",
          "Seed task in Plan-001.",
          "",
        ].join("\n"),
      );
    },
    prompt:
      "This project ALREADY has a plan at plan/Plan-001-seed/. Use the spec-to-plan " +
      "skill to start a NEW, SECOND plan (do not modify Plan-001) for a follow-up " +
      "effort based on the requirements in spec/. Produce a fresh bundle " +
      "plan/Plan-002-<slug>/ with a `type: Plan` plan.md, index.md, log.md, and a " +
      "tasks/ directory of `type: Task` files. Validate all plans with quire so they " +
      "pass.",
    expect: {
      artifacts: {
        require: {
          Plan: { min: 2, dir: "plan" },
          Task: { min: 2, dir: "plan" },
        },
      },
      files: [
        "plan/Plan-002-*/plan.md",
        "plan/Plan-002-*/index.md",
        "plan/Plan-002-*/log.md",
      ],
      validate: { globs: ["plan/**/*.md"], shouldPass: true },
    },
  },
];

export const CANARY_IDS = ["EV-001", "EV-008"];

export function selectScenarios({ canary, all, filter }) {
  if (filter) {
    const wanted = filter.split(",").map((f) => f.trim());
    return SCENARIOS.filter((s) => wanted.some((f) => s.id.includes(f)));
  }
  if (all) return SCENARIOS;
  if (canary) return SCENARIOS.filter((s) => CANARY_IDS.includes(s.id));
  return [];
}
