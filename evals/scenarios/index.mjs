// Declarative eval scenarios (EV-001..EV-015 from spec/evals.md).
//
// Each scenario: { id, useCase, prompt, expect, setup?(ctx), env?(ctx) }.
//  - prompt:  task text for the agent (string or (ctx)=>string). The EV "Prompt" column.
//  - setup:   optional pre-seed of brownfield/broken/plugin/dev-module fixtures into ctx.
//             May stash data on ctx.data for prompt(ctx)/env(ctx).
//  - env:     optional (ctx)=>extra env for BOTH the agent run and the ground-truth
//             assertion (e.g. QUOIN_MODULE_PATHS).
//  - expect:  ground-truth success checks (see lib/assert.mjs):
//             files, validate, flow, cliRejects, plugin, resolvesTo, sentinel.
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
