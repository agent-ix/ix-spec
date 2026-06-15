---
artifact_type: master-requirements
name: ix-spec
org: agent-ix
component_type: cli
---

# ix-spec Phase 0 Spec

## Description

`ix-spec` SHALL provide a standalone installable CLI for spec-domain catalog,
plugin, authoring-contract, Quire, and review/planning flow operations without
requiring the broader `ix` umbrella CLI.

## Requirements

| ID      | Requirement                                                                                                    | Verification |
| ------- | -------------------------------------------------------------------------------------------------------------- | ------------ |
| FR-001  | The CLI SHALL discover base first-party `spec-artifacts-*` and `spec-objects-*` modules.                       | Test         |
| FR-002  | The CLI SHALL support user/community plugin install records under `~/.ix`.                                     | Test         |
| FR-003  | The CLI SHALL expose catalog list/show/validate commands.                                                      | Test         |
| FR-004  | The CLI SHALL expose `write <repo_dir> --types <types>` authoring packs from catalog entries.                  | Test         |
| FR-005  | Type lookup for authoring packs SHALL be case-insensitive.                                                     | Test         |
| FR-006  | The CLI SHALL keep review/matrix/to-plan workflows and hand lifecycle control to `ix-flow`.                    | Test         |
| FR-007  | The CLI SHALL describe scope-based Quire validation for changed spec files.                                    | Review       |
| FR-008  | The spec SHALL define use-case-matched eval scenarios for authoring, validation, plugins, and workflows.       | Test         |
| NFR-001 | Workflow definitions SHOULD avoid redefining doc/object type vocabularies.                                     | Review       |
| NFR-002 | Authoring evals SHOULD record latency, token usage, tool-call count, validation attempts, and context fetches. | Review       |

## Use Cases

| ID     | Summary                                         |
| ------ | ----------------------------------------------- |
| US-001 | Author a root artifact with supporting objects. |
| US-002 | Discover an authoring contract before editing.  |
| US-003 | Install and use a community spec module.        |
| US-004 | Validate changed spec files.                    |
| US-005 | Start a gated spec workflow.                    |

## Evals

The minimum agent-facing eval set is defined in `spec/evals.md`. Evals SHALL
match the use cases above and SHOULD capture success, latency, token usage,
tool-call count, validation attempts, and repeated context fetches.

## Dependencies

- `@agent-ix/ix-cli-core`
- `ix-flow`
- `quire-cli`
