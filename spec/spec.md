---
type: master-requirements
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

| ID      | Requirement                                                                                                                                                                                                                                                                                                                        | Verification |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| FR-001  | The CLI SHALL lazily install the committed default Filament module set into `~/.ix/filament/modules` on first catalog access, idempotently and with zero git once each module is installed and pinned.                                                                                                                             | Test         |
| FR-002  | The CLI SHALL maintain user/community plugin install records in `~/.ix/filament/registry.json` and materialize installed modules under `~/.ix/filament/modules`, delegating install/registry mechanics to `@agent-ix/ts-plugin-kit`.                                                                                               | Test         |
| FR-003  | The CLI SHALL expose catalog list/show/validate commands.                                                                                                                                                                                                                                                                          | Test         |
| FR-004  | The CLI SHALL expose `write <repo_dir> --types <types>` authoring packs from catalog entries.                                                                                                                                                                                                                                      | Test         |
| FR-005  | Type lookup for authoring packs SHALL be case-insensitive.                                                                                                                                                                                                                                                                         | Test         |
| FR-006  | The CLI SHALL keep review/matrix/to-plan workflows and hand lifecycle control to `ix-flow`.                                                                                                                                                                                                                                        | Test         |
| FR-007  | The CLI SHALL describe scope-based Quire validation for changed spec files.                                                                                                                                                                                                                                                        | Test         |
| FR-008  | The spec SHALL define use-case-matched eval scenarios for authoring, validation, plugins, and workflows.                                                                                                                                                                                                                           | Test         |
| FR-009  | The CLI SHALL ship `default-modules.yaml` as the committed, canonical-ready default module set, declaring each module as a `git-subdir` source pinned to the same tag its Python wheel is built from where a release tag exists (a module without a release tag MAY pin to its default branch).                                    | Test         |
| FR-010  | The CLI SHALL map `path:`, `github:`, and `package:` plugin-install source arguments to typed `ts-plugin-kit` sources (`path`/`github`/`npm`), and SHALL hand them to `ts-plugin-kit` for install; the `package:`/npm source is not yet supported and `ts-plugin-kit` rejects it with an unsupported-source error at install time. | Test         |
| FR-011  | The CLI SHALL assemble the catalog from module roots in order: `IX_SPEC_MODULE_PATHS` (colon-separated), then modules installed under `~/.ix/filament/modules`; the same directory is the shared module store read by quire-rs.                                                                                                    | Test         |
| NFR-001 | Workflow definitions SHOULD avoid redefining doc/object type vocabularies.                                                                                                                                                                                                                                                         | Review       |
| NFR-002 | Authoring evals SHOULD record latency, token usage, tool-call count, validation attempts, and context fetches.                                                                                                                                                                                                                     | Review       |
| NFR-003 | Default-module reconciliation SHALL be idempotent and perform no network/git work once each module is installed and pinned, so repeated catalog/write invocations stay offline-safe.                                                                                                                                               | Test         |

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

## Module Store

`ix-spec` does not vendor the default `spec-artifacts-*` / `spec-objects-*`
modules. The committed `default-modules.yaml` declares the default set as pinned
`git-subdir` sources; `ensureDefaultModules()` lazily reconciles that set into
`~/.ix/filament/modules/<name>/` on first catalog access (triggered from
`catalog` and `write`). The plugin registry lives at
`~/.ix/filament/registry.json`. The same `~/.ix/filament/modules` directory is
the shared module store also read by quire-rs, so installs and validation see an
identical catalog.

## Dependencies

- `@agent-ix/ix-cli-core` — runtime context/config root.
- `@agent-ix/ts-plugin-kit` — marketplace install, reconcile, and registry
  primitives for the default set and user/community plugins.
- `ix-flow` — workflow lifecycle (resume/advance/gate/status) after launch.
- `quire-cli` — frontmatter-driven validation over authored spec files.
