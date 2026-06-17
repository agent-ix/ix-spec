---
type: master-requirements
name: ix-spec
org: agent-ix
component_type: cli
title: "ix-spec Phase 0 Spec"
---

# Master Requirements Specification

## Purpose

`ix-spec` SHALL provide a standalone installable CLI for spec-domain catalog,
plugin, authoring-contract, Quire, and review/planning flow operations without
requiring the broader `ix` umbrella CLI.

## Scope

### In Scope

- The `ix-spec` CLI surface: catalog list/show/validate, `write` authoring
  packs, plugin install, and the launch of review/matrix/to-plan workflows.
- The committed default Filament module set and its lazy reconciliation into
  `~/.ix/filament/modules`, plus user/community plugin install records in
  `~/.ix/filament/registry.json`.

### Out of Scope

- Workflow lifecycle control (resume/advance/gate/status), which `ix-flow`
  owns after launch.
- Frontmatter-driven validation of authored spec files, which `quire` owns;
  `ix-spec` authors, quire validates.

## System Overview

`ix-spec` is a standalone CLI that assembles a Filament catalog from module
roots, authors artifact/object files from catalog skeletons, installs
user/community modules through `@agent-ix/ts-plugin-kit`, and hands lifecycle
control of review/matrix/planning workflows to `ix-flow`. It does not vendor the
default modules; the committed `default-modules.yaml` declares them as pinned
`git-subdir` sources that are reconciled on first catalog access into the shared
`~/.ix/filament/modules` store also read by quire-rs.

## Requirements Architecture

The requirement classes that make up this specification — Functional
Requirements, Non-Functional Requirements, and User Stories — and how they trace
to one another are listed below. Functional and Non-Functional Requirements are
enumerated in the Requirements table; User Stories that drive them are listed in
Use Cases and authored under `spec/usecase/`.

### Requirements

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

### Use Cases

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

## References

- ISO/IEC/IEEE 29148 — Requirements engineering.
- `@agent-ix/ix-cli-core` — runtime context/config root.
- `@agent-ix/ts-plugin-kit` — marketplace install, reconcile, and registry
  primitives for the default set and user/community plugins.
- `ix-flow` — workflow lifecycle (resume/advance/gate/status) after launch.
- `quire-cli` — frontmatter-driven validation over authored spec files.
