---
id: Matrix-001
title: ix-spec Phase 0 Matrix
type: TestMatrix
---

# ix-spec Phase 0 Matrix

Tests live in `tests/` and run under vitest (`make test` → `vitest run`):
`index.test.ts` covers the catalog/install/write library surface;
`cli.test.ts` and `cli-version-missing.test.ts` cover the full `main()`
dispatch; `flows.test.ts` and `flows-notfound.test.ts` cover the workflow
launchers; `write.test.ts`, `catalog.test.ts`, and `plugins.test.ts` cover those
modules; `scripts.test.ts` covers the CLI help/version surface.

> Coverage gate: `vite.config.ts` declares 100% v8 thresholds
> (branches/functions/lines/statements). `pnpm run test:coverage` now **passes
> at 100%** — the previously-uncovered `flows.ts` and the
> `runCatalog`/`runPlugin`/`runWrite` dispatch paths are now fully tested.

| Requirement | Coverage   | Test (file :: name)                                                                                                                                                                                                                                                                                                                      |
| ----------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-001      | ✅ Covered | `index.test.ts` :: "lazily installs the default module set, then loads its artifacts and objects"                                                                                                                                                                                                                                        |
| FR-002      | ✅ Covered | `index.test.ts` :: "installs, lists, and removes a plugin from a local path source" (registry + `~/.ix/filament/modules`)                                                                                                                                                                                                                |
| FR-003      | ✅ Covered | `cli.test.ts` `runCatalog` suite — list/undefined/`--json`/show/show-missing/show-not-found/validate-ok/`--json`/duplicates→exit 1/unknown-subcommand; `catalog.test.ts` exercises `loadCatalog`/`findCatalogEntry`.                                                                                                                     |
| FR-004      | ✅ Covered | `index.test.ts` :: "creates authoring packs for case-insensitive artifact and object types"                                                                                                                                                                                                                                              |
| FR-005      | ✅ Covered | `index.test.ts` :: "creates authoring packs…" (asserts `["fr","DOMAIN"]` → `["FR","domain"]`)                                                                                                                                                                                                                                            |
| FR-006      | ✅ Covered | `flows.test.ts` exercises `specFlowNames`/`startSpecFlow`/`resolveSkillPath`/`runIxFlow` (real fake `ix-flow` binary: exit 0 / non-zero / signal / spawn-error, `workflow-assets` layout); `cli.test.ts` covers spec-flow dispatch through `main`.                                                                                       |
| FR-007      | ✅ Covered | `index.test.ts` :: "creates authoring packs…" (asserts `validation.command` contains `quire validate --scope`)                                                                                                                                                                                                                           |
| FR-008      | ✅ Covered | `spec/evals.md` (Matrix-002) maps EV-001…EV-015 to US-001…US-005                                                                                                                                                                                                                                                                         |
| FR-009      | ✅ Covered | `index.test.ts` :: "ships the committed default module set" (asserts `default-modules.yaml` has 8 entries incl. `spec-objects-business`)                                                                                                                                                                                                 |
| FR-010      | ✅ Covered | `plugins.test.ts` :: "parseSourceArg" covers `path:`/`github:`(±`@ref`)/`package:`→npm/bare-path; `cli.test.ts` covers `plugin install` dispatch. The npm-unsupported-at-resolve error is owned + tested by ts-plugin-kit.                                                                                                               |
| FR-011      | ✅ Covered | `catalog.test.ts` :: `defaultModuleRoots` asserts the `IX_SPEC_MODULE_PATHS`-first ordering + the `~/.ix/filament/modules` installed dir. The quire-rs shared-store contract is cross-repo (asserted in quire-rs).                                                                                                                       |
| NFR-001     | ⚠️ Review  | Workflow launchers reference catalog modules via `flows.ts`; no automated assertion. Verified by review.                                                                                                                                                                                                                                 |
| NFR-002     | ✅ Covered | The agent-pty-driven harness (`evals/run.mjs`) drives the real agent and records the metrics (latency, tokens, tool calls, validation attempts, context fetches) **for real** from the Claude Code transcript; defined in `spec/evals.md`, implemented in `evals/`. Canaries EV-001/EV-008 verified live; full set via `make evals-all`. |
| NFR-003     | ✅ Covered | `index.test.ts` :: "lazily installs the default module set…" runs `ensureDefaultModules` against path-source fixtures (no network); reconcile is `mode: "lazy"`. Re-run idempotence is exercised indirectly across tests sharing fixtures; a dedicated double-call assertion is not present (see findings).                              |

## Use Case Coverage

| Use Case | Coverage   | Test / Evidence                                                                                                                                                                                         |
| -------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| US-001   | ✅ Covered | `index.test.ts` authoring-pack test; EV-001/EV-006/EV-014 in `spec/evals.md`                                                                                                                            |
| US-002   | ✅ Covered | `scripts.test.ts` catalog/write help; `index.test.ts` case-insensitive lookup; EV-002/EV-007/EV-011                                                                                                     |
| US-003   | ⚠️ Partial | `index.test.ts` plugin install/list/remove (path source only). GitHub/package install is not unit-tested (network-hermetic fixtures use `path:` only); EV-003/EV-009/EV-010 cover it at the eval layer. |
| US-004   | ✅ Covered | `index.test.ts` validation-command assertion; EV-004/EV-008/EV-012                                                                                                                                      |
| US-005   | ✅ Covered | `flows.test.ts` exercises the workflow launchers end-to-end (fake `ix-flow`); `cli.test.ts` covers `review`/`matrix` dispatch via `main`. EV-005/EV-013 add eval coverage.                              |

## Eval Coverage

The agent-facing eval set (EV-001…EV-015) is defined in `spec/evals.md`
(Matrix-002) and implemented by the agent-pty-driven harness in `evals/` (run with
`make evals` for the canaries or `make evals-all` for the full set). The harness
drives the real agent through this CLI + the `/spec-*` skills and records real
metrics from the Claude Code transcript. This unit-test matrix does not duplicate
that table.

## Backsync Notes

- FR-001/FR-002 were rewritten from the old "discover bundled modules" /
  "install records under `~/.ix`" wording to match the current lazy-install +
  `~/.ix/filament/{modules,registry.json}` + ts-plugin-kit delegation model.
- FR-009/FR-010/FR-011 and NFR-003 are new and trace to existing tests.
- FR-006 and US-005 are now unit-covered: `flows.test.ts` tests the launchers
  (incl. a real fake `ix-flow` binary for the exit-code / signal / spawn-error
  paths), closing the prior eval-only gap. The repo now passes
  `pnpm run test:coverage` at 100% (branches/functions/lines/statements).
