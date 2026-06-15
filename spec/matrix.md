---
id: Matrix-001
title: ix-spec Phase 0 Matrix
artifact_type: TestMatrix
---

# ix-spec Phase 0 Matrix

Tests live in `tests/` and run under vitest (`make test` → `vitest run`).
`tests/index.test.ts` covers catalog/install/write library surface;
`tests/scripts.test.ts` covers CLI help/version surface.

> Coverage gate note: `vite.config.ts` declares 100% v8 thresholds, but the
> repo's **actual** coverage is ~47% statements / ~50% lines (pre-existing).
> `make test` (`vitest run`) does NOT enforce the threshold and passes;
> `pnpm run test:coverage` enforces it and currently fails. `flows.ts` (FR-006)
> and the CLI `runCatalog`/`runPlugin`/`runWrite` dispatch paths are the main
> uncovered regions. Markers below reflect the real test set, not the gate.

| Requirement | Coverage   | Test (file :: name)                                                                                                                                                                                                                                                                                         |
| ----------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-001      | ✅ Covered | `index.test.ts` :: "lazily installs the default module set, then loads its artifacts and objects"                                                                                                                                                                                                           |
| FR-002      | ✅ Covered | `index.test.ts` :: "installs, lists, and removes a plugin from a local path source" (registry + `~/.ix/filament/modules`)                                                                                                                                                                                   |
| FR-003      | ⚠️ Partial | `scripts.test.ts` :: "catalog help…"; `index.test.ts` `loadCatalog`/`findCatalogEntry`. CLI `list/show/validate` dispatch and `duplicates` branch in `runCatalog` are untested.                                                                                                                             |
| FR-004      | ✅ Covered | `index.test.ts` :: "creates authoring packs for case-insensitive artifact and object types"                                                                                                                                                                                                                 |
| FR-005      | ✅ Covered | `index.test.ts` :: "creates authoring packs…" (asserts `["fr","DOMAIN"]` → `["FR","domain"]`)                                                                                                                                                                                                               |
| FR-006      | ❌ Missing | No test exercises `startSpecFlow`/`specFlowNames`; `flows.ts` is ~3% covered. Workflow launch is verified only via the eval harness (`spec/evals.md` EV-005/EV-013), not a unit test.                                                                                                                       |
| FR-007      | ✅ Covered | `index.test.ts` :: "creates authoring packs…" (asserts `validation.command` contains `quire validate --scope`)                                                                                                                                                                                              |
| FR-008      | ✅ Covered | `spec/evals.md` (Matrix-002) maps EV-001…EV-015 to US-001…US-005                                                                                                                                                                                                                                            |
| FR-009      | ✅ Covered | `index.test.ts` :: "ships the committed default module set" (asserts `default-modules.yaml` has 8 entries incl. `spec-objects-business`)                                                                                                                                                                    |
| FR-010      | ⚠️ Partial | `index.test.ts` :: "parseSourceArg maps CLI prefixes to typed sources" covers `path:`/`github:`/`package:`→npm mapping and the bare-path default. The "`package:`/npm **unsupported at install** → error" behavior is delegated to ts-plugin-kit and is NOT asserted here.                                  |
| FR-011      | ⚠️ Partial | `index.test.ts` uses `defaultModuleRoots(home)` + `filamentModulesDir(home)`, proving installed-module discovery and the shared dir path. The `IX_SPEC_MODULE_PATHS`-first **ordering** and the quire-rs shared-store contract are not directly asserted.                                                   |
| NFR-001     | ⚠️ Review  | Workflow launchers reference catalog modules via `flows.ts`; no automated assertion. Verified by review.                                                                                                                                                                                                    |
| NFR-002     | ⚠️ Review  | `pnpm run test:evals` (deterministic harness) records latency, tool calls, validation attempts, context fetches; token fields are `null` for deterministic runs. Verified by review.                                                                                                                        |
| NFR-003     | ✅ Covered | `index.test.ts` :: "lazily installs the default module set…" runs `ensureDefaultModules` against path-source fixtures (no network); reconcile is `mode: "lazy"`. Re-run idempotence is exercised indirectly across tests sharing fixtures; a dedicated double-call assertion is not present (see findings). |

## Use Case Coverage

| Use Case | Coverage   | Test / Evidence                                                                                                                                                                                         |
| -------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| US-001   | ✅ Covered | `index.test.ts` authoring-pack test; EV-001/EV-006/EV-014 in `spec/evals.md`                                                                                                                            |
| US-002   | ✅ Covered | `scripts.test.ts` catalog/write help; `index.test.ts` case-insensitive lookup; EV-002/EV-007/EV-011                                                                                                     |
| US-003   | ⚠️ Partial | `index.test.ts` plugin install/list/remove (path source only). GitHub/package install is not unit-tested (network-hermetic fixtures use `path:` only); EV-003/EV-009/EV-010 cover it at the eval layer. |
| US-004   | ✅ Covered | `index.test.ts` validation-command assertion; EV-004/EV-008/EV-012                                                                                                                                      |
| US-005   | ❌ Missing | No unit test; `flows.ts` workflow launch is exercised only by EV-005/EV-013 in the eval harness.                                                                                                        |

## Eval Coverage

The agent-facing eval set (EV-001…EV-015) and its pass status are tracked in
`spec/evals.md` (Matrix-002) and `evals/reports/latest.json` via
`pnpm run test:evals`. This unit-test matrix does not duplicate that table.

## Backsync Notes

- FR-001/FR-002 were rewritten from the old "discover bundled modules" /
  "install records under `~/.ix`" wording to match the current lazy-install +
  `~/.ix/filament/{modules,registry.json}` + ts-plugin-kit delegation model.
- FR-009/FR-010/FR-011 and NFR-003 are new and trace to existing tests.
- FR-006 and US-005 are honestly marked Missing at the unit level: `flows.ts`
  has no unit test (only eval coverage). Adding a `specFlowNames()` /
  `resolveSkillPath` test would close this without invoking `ix-flow`.
