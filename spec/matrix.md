---
id: Matrix-001
title: ix-spec Phase 0 Matrix
artifact_type: TestMatrix
---

# ix-spec Phase 0 Matrix

| Requirement | Coverage | Evidence                                                            |
| ----------- | -------- | ------------------------------------------------------------------- |
| FR-001      | Covered  | catalog unit test and `catalog validate` smoke                      |
| FR-002      | Covered  | plugin registry implementation in `src/plugins.ts`                  |
| FR-003      | Covered  | command surface in `src/cli.ts`                                     |
| FR-004      | Covered  | `write-fr` smoke starts a workflow run                              |
| FR-005      | Partial  | catalog records owning module roots; Quire calls are next increment |
| NFR-001     | Covered  | workflow launchers use catalog module discovery                     |
