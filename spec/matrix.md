---
id: Matrix-001
title: ix-spec Phase 0 Matrix
artifact_type: TestMatrix
---

# ix-spec Phase 0 Matrix

| Requirement | Coverage | Evidence                                                                                                  |
| ----------- | -------- | --------------------------------------------------------------------------------------------------------- |
| FR-001      | Covered  | catalog unit test and `catalog validate` smoke                                                            |
| FR-002      | Covered  | plugin registry implementation in `src/plugins.ts`                                                        |
| FR-003      | Covered  | command surface in `src/cli.ts`                                                                           |
| FR-004      | Covered  | authoring-pack unit test for `FR` and `domain`                                                            |
| FR-005      | Covered  | case-insensitive lookup test for `fr`                                                                     |
| FR-006      | Covered  | review/matrix/to-plan remain flow-backed commands                                                         |
| FR-007      | Covered  | EV-001, EV-004, EV-008, EV-012, and EV-014 run scoped Quire validation                                    |
| FR-008      | Covered  | `spec/evals.md` maps eval scenarios to use cases                                                          |
| NFR-001     | Covered  | workflow launchers use catalog module discovery                                                           |
| NFR-002     | Covered  | `pnpm run test:evals` records latency, tool calls, validation attempts, context fetches, and token fields |

## Use Case Coverage

| Use Case | Coverage | Evidence                                                                                                        |
| -------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| US-001   | Covered  | EV-001, EV-006, EV-014, and EV-015 exercise root artifacts, object reuse, Phase 0 authoring, and dev modules    |
| US-002   | Covered  | EV-002, EV-007, EV-011, and EV-014 exercise contract discovery, casing, unknown types, and Phase 0 authoring    |
| US-003   | Covered  | EV-003, EV-009, and EV-010 exercise local, GitHub/package, and lifecycle plugin flows                           |
| US-004   | Covered  | EV-004, EV-008, EV-012, and EV-014 exercise scoped validation, repair, multiple globs, and full spec validation |
| US-005   | Covered  | EV-005 and EV-013 exercise workflow launch, status, matrix, and to-plan                                         |

## Eval Coverage

| Eval   | Status  | Evidence                                           |
| ------ | ------- | -------------------------------------------------- |
| EV-001 | Passing | `pnpm run test:evals`; `evals/reports/latest.json` |
| EV-002 | Passing | `pnpm run test:evals`; `evals/reports/latest.json` |
| EV-003 | Passing | `pnpm run test:evals`; `evals/reports/latest.json` |
| EV-004 | Passing | `pnpm run test:evals`; `evals/reports/latest.json` |
| EV-005 | Passing | `pnpm run test:evals`; `evals/reports/latest.json` |
| EV-006 | Passing | `pnpm run test:evals`; `evals/reports/latest.json` |
| EV-007 | Passing | `pnpm run test:evals`; `evals/reports/latest.json` |
| EV-008 | Passing | `pnpm run test:evals`; `evals/reports/latest.json` |
| EV-009 | Passing | `pnpm run test:evals`; `evals/reports/latest.json` |
| EV-010 | Passing | `pnpm run test:evals`; `evals/reports/latest.json` |
| EV-011 | Passing | `pnpm run test:evals`; `evals/reports/latest.json` |
| EV-012 | Passing | `pnpm run test:evals`; `evals/reports/latest.json` |
| EV-013 | Passing | `pnpm run test:evals`; `evals/reports/latest.json` |
| EV-014 | Passing | `pnpm run test:evals`; `evals/reports/latest.json` |
| EV-015 | Passing | `pnpm run test:evals`; `evals/reports/latest.json` |
