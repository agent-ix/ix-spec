---
type: master-requirements
name: quoin
org: agent-ix
component_type: cli
implementation_language: typescript
title: "quoin Master Requirements Specification"
---

# Master Requirements Specification

## Purpose

`quoin` SHALL provide a standalone installable CLI that gives a spec-authoring
agent a catalog-driven authoring contract, a user-extensible spec-module store,
and launch points for governed review/matrix/planning workflows — without
requiring the broader `ix` umbrella CLI.

## Scope

### In Scope

- The `quoin` command surface: argument parsing, `version`/help, `catalog`
  list/show/validate, `write` authoring packs, `plugin`
  install/list/remove/ensure-defaults, the `review`/`matrix`/`to-plan`
  workflow launchers, and the `update` self-update command.
- Assembly of a Filament catalog from module roots (`QUOIN_MODULE_PATHS` plus
  the installed module store) and the authoring contract it exposes (skeletons,
  schemas, module roots).
- The committed default Filament module set (`default-modules.yaml`) and its
  lazy, idempotent reconciliation into `~/.ix/filament/modules`, plus
  user/community plugin install records in `~/.ix/filament/registry.json`.
- Construction of the `quire validate` command for authored spec files.

### Out of Scope

- Workflow lifecycle control (resume/advance/gate/status), owned by `ix-flow`
  after a run is launched.
- Frontmatter-driven validation of authored spec files, owned by `quire`;
  `quoin` constructs the validation command and `quire` executes it.
- Install/registry/reconcile mechanics, owned by `@agent-ix/ts-plugin-kit`;
  `quoin` maps CLI source arguments to typed sources and delegates.

## System Overview

`quoin` is a single `main(argv)` dispatcher built on
`@agent-ix/ix-cli-core`. It parses a leading command (and, for `catalog` and
`plugin`, a subcommand), resolves a config root, configures the shared runtime
context, and dispatches to the catalog, authoring, plugin, workflow, or
self-update surface.
It assembles a Filament catalog from module roots, authors nothing itself —
instead returning the local skeletons, schemas, and a `quire validate` command
that the calling agent uses as its authoring contract. It installs
user/community modules through `@agent-ix/ts-plugin-kit` and hands lifecycle
control of review/matrix/planning workflows to `ix-flow`.

It does not vendor the default modules; the committed `default-modules.yaml`
declares them as pinned `git-subdir` sources reconciled on first catalog access
into the shared `~/.ix/filament/modules` store also read by quire-rs, so
authoring and validation see an identical catalog.

## Requirements Architecture

The requirement classes that make up this specification — Functional
Requirements (FR), Non-Functional Requirements (NFR), and User Stories (US) —
and how they trace to one another are listed below. Functional and
Non-Functional Requirements are enumerated in the Requirements table; the User
Stories that drive them are listed under Use Cases and authored in
`spec/usecase/`.

### Functional Requirements — CLI Framework

| ID     | Requirement                                                                                                                                                                                                                                                                                           | Verification |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| FR-001 | The CLI SHALL parse a leading command and (for `catalog`/`plugin`) a subcommand, `--flag=value` and `--flag value` long flags, `-x` short boolean flags, and bare positionals, accumulating repeated `--types` and `--target` flags into ordered lists.                                               | Test         |
| FR-002 | The CLI SHALL print its package version (read from `package.json`) for the `version` command, `--version`, or `-v`, and SHALL fail if the package version is missing or non-string.                                                                                                                   | Test         |
| FR-003 | The CLI SHALL print root usage when invoked with no command, and command-scoped help for `--help`/`-h` on `write`, `catalog`, `plugin`, `update`, and the spec-flow commands, falling back to root usage for unrecognized commands.                                                                   | Test         |
| FR-004 | The CLI SHALL resolve a config root from `--config-root` (defaulting to `~/.ix` via `IX_HOME`), export it to `IX_HOME`, and configure the shared `ix-cli-core` runtime context with namespace `ix` and project config root `<cwd>/.ix`, disabling project config when `--no-project-config` is given. | Test         |
| FR-005 | The CLI SHALL reject an unknown command or an unknown `catalog`/`plugin` subcommand by throwing an error that includes usage, and SHALL exit non-zero.                                                                                                                                                | Test         |

### Functional Requirements — Catalog

| ID     | Requirement                                                                                                                                                                                                                                                                                                                                                             | Verification |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| FR-006 | The catalog loader SHALL treat a candidate path as a module root when it directly contains `manifest.yaml`, or when one of its immediate child directories contains `manifest.yaml`; non-directory and unresolvable candidates SHALL be skipped.                                                                                                                        | Test         |
| FR-007 | The catalog loader SHALL assemble module roots in order: `QUOIN_MODULE_PATHS` (colon-separated) first, then every module directory under `~/.ix/filament/modules`; the latter is the shared module store read by quire-rs.                                                                                                                                              | Test         |
| FR-008 | The catalog loader SHALL ignore duplicate resolved module roots and duplicate module names on a first-wins basis, so a `QUOIN_MODULE_PATHS` module overrides an installed module of the same name.                                                                                                                                                                      | Test         |
| FR-009 | For each module the loader SHALL read `name` (defaulting to the directory basename), optional `version`, and the `artifact_types`/`object_types` entries (ignoring malformed entries); artifact entries SHALL resolve `frontmatter_schema_ref` to a schema path, and every type SHALL resolve a skeleton from `skeletons/<Type>.md` with a lowercase-filename fallback. | Test         |
| FR-010 | Catalog type lookup SHALL be case-insensitive, so `FR` and `fr` resolve to the same entry.                                                                                                                                                                                                                                                                              | Test         |
| FR-011 | `catalog list` SHALL print one `name@version root` line per module (or the full catalog as `--json`), and `catalog show <type>` SHALL print the entry's kind/name/module/root (or the entry as `--json`) and error when the type is unknown or omitted.                                                                                                                 | Test         |
| FR-012 | The loader SHALL flag any type name declared as the same kind by more than one module as a duplicate, and `catalog validate` SHALL exit non-zero emitting `{ok:false,duplicates}` on stderr when duplicates exist, otherwise report the module count (text or `--json`).                                                                                                | Test         |

### Functional Requirements — Authoring

| ID     | Requirement                                                                                                                                                                                                                                                                                               | Verification |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| FR-013 | `quoin write <repo_dir> --types <type[,type...]>` SHALL require at least one type and a `repo_dir` that exists and is a directory, SHALL split type lists on commas (trimming and dropping empties), and SHALL error with the sorted list of available types when a requested type is not in the catalog. | Test         |
| FR-014 | For each resolved type `write` SHALL emit an authoring contract — name, kind, module name, module root, and any skeleton and schema paths — rendered as text (or `--json`), marking a type with neither skeleton nor schema as "manifest only".                                                           | Test         |
| FR-015 | `write` SHALL emit a Quire validation command `quire validate --scope <shell-quoted repo_root> "spec/**/*.md"` scoped to the resolved repo root, shell-quoting paths that need it.                                                                                                                        | Test         |

### Functional Requirements — Module Store & Plugins

| ID     | Requirement                                                                                                                                                                                                                                                                                                                                                                                           | Verification |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| FR-016 | The CLI SHALL ship `default-modules.yaml` as the committed default module set, validated as a `ts-plugin-kit` marketplace manifest, declaring each module as a `git-subdir` source pinned to the tag its Python wheel is built from where a release tag exists (a module without a release tag MAY pin to its default branch).                                                                        | Test         |
| FR-017 | The CLI SHALL lazily reconcile the default module set into `~/.ix/filament/modules` on first `catalog`/`write` access (idempotently, with no git once installed), and SHALL expose `plugin ensure-defaults` as an explicit entry point that performs the install and reports the resulting registry for external tools (e.g. `quire validate`).                                                       | Test         |
| FR-018 | The CLI SHALL map plugin source arguments to typed `ts-plugin-kit` sources: `path:<dir>` → `path`, `github:<owner>/<repo>[@<ref>]` → `github`, `github:<owner>/<repo>//<subdir>[@<ref>]` → `git-subdir`, `package:<pkg>[@<ver>]` → `npm`, and a bare argument → `path`. The `npm` source is not yet supported and `ts-plugin-kit` rejects it at install time.                                         | Test         |
| FR-019 | The CLI SHALL maintain user/community plugin records in `~/.ix/filament/registry.json` and materialize modules (copy) under `~/.ix/filament/modules` via `ts-plugin-kit`, reading each module's name from its `manifest.yaml` (root or single nested dir); `plugin list` SHALL print the registry's plugins and `plugin remove <name>` SHALL delete the module directory and drop its registry entry. | Test         |

### Functional Requirements — Workflows

| ID     | Requirement                                                                                                                                                                                                                                                                                                                               | Verification |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| FR-020 | The CLI SHALL expose the `review`, `matrix`, and `to-plan` workflow launchers, resolving each workflow's skill path across `IX_SPEC_WORKFLOWS_ROOT`, the packaged skills, a sibling `ix-spec-workflows` checkout, and `~/.ix/plugins`, and erroring when no candidate contains the skill.                                                 | Test         |
| FR-021 | On launch the CLI SHALL spawn `ix-flow run <flow> --path <skill> --config-root <home> --state-dir <home>/flows` with optional `--id`/`--json`/`--target` arguments, propagate ix-flow's exit code (defaulting to 1 on signal), surface spawn errors, and hand all subsequent lifecycle control (resume/advance/gate/status) to `ix-flow`. | Test         |

### Functional Requirements — Self-Update

| ID     | Requirement                                                                                                                                                                                                                                                                                                                                                                                        | Verification |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| FR-022 | The CLI SHALL expose an `update` command that upgrades quoin to the latest published `@agent-ix/quoin` by delegating to `ix-cli-core`'s `runSelfUpdate` (npm view → compare to the running version → `npm install -g`), supporting `--check` (report availability without installing) and `--registry <url>` (force a registry); with no `--registry` the ambient npm config resolves the package. | Test         |

### Non-Functional Requirements

| ID      | Requirement                                                                                                                                                                                                                                                                                                                            | Verification |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| NFR-001 | Default-module reconciliation SHALL be idempotent and perform no network or git work once each module is installed and pinned, so repeated `catalog`/`write` invocations stay offline-safe.                                                                                                                                            | Test         |
| NFR-002 | Catalog assembly SHALL be deterministic for a given set of module roots: stable root ordering, first-wins dedup, and sorted duplicate-module lists.                                                                                                                                                                                    | Test         |
| NFR-003 | Command, argument, and lookup failures SHALL surface as thrown errors or non-zero exit codes with actionable messages (available types, usage text, source diagnostics) rather than silent or partial output.                                                                                                                          | Test         |
| NFR-004 | `quoin` SHALL run standalone: its only runtime dependencies are `@agent-ix/ix-cli-core`, `@agent-ix/ts-plugin-kit`, and a YAML parser; `ix-flow` and `quire` are invoked as external processes, not linked.                                                                                                                            | Review       |
| NFR-005 | Workflow definitions SHOULD reference catalog-defined artifact/object types rather than redefining the doc/object type vocabulary.                                                                                                                                                                                                     | Review       |
| NFR-006 | The agent-facing eval set SHALL record latency, token usage, tool-call count, validation attempts, and repeated context fetches per scenario.                                                                                                                                                                                          | Review       |
| NFR-007 | The external tools `ix-flow` and `quire` SHALL be invoked by name from `PATH` and are not version-pinned (a known limitation); `ix-flow` unavailability or a non-zero exit SHALL surface as a non-zero `quoin` exit, and the `quire` validation command SHALL be emitted for the calling agent to run rather than executed by `quoin`. | Test         |
| NFR-008 | A candidate module path without a `manifest.yaml` SHALL be skipped during catalog assembly, but a present-but-unparseable `manifest.yaml` SHALL abort assembly (strict) rather than be silently dropped, so a corrupt installed module is surfaced rather than hidden.                                                                 | Review       |

### Use Cases

| ID     | Summary                                             |
| ------ | --------------------------------------------------- |
| US-001 | Author a root artifact with supporting objects.     |
| US-002 | Discover an authoring contract before editing.      |
| US-003 | Install and use a community spec module.            |
| US-004 | Validate changed spec files.                        |
| US-005 | Start a gated spec workflow.                        |
| US-006 | Detect conflicting type definitions across modules. |

## Evals

The minimum agent-facing eval set is defined in `spec/evals.md` (Matrix-002) and
implemented by the agent-pty-driven harness in `evals/`. Evals SHALL match the
use cases above and record the metrics required by NFR-006.

## Module Store

`quoin` does not vendor the default `spec-artifacts-*` / `spec-objects-*`
modules. The committed `default-modules.yaml` declares the default set as pinned
`git-subdir` sources; `ensureDefaultModules()` lazily reconciles that set into
`~/.ix/filament/modules/<name>/` on first catalog access (triggered from
`catalog` and `write`, and on demand via `quoin plugin ensure-defaults` — the
explicit entry point external tools such as `quire validate` shell out to for
lazy init). The plugin registry lives at `~/.ix/filament/registry.json`. The
same `~/.ix/filament/modules` directory is the shared module store read by
quire-rs, so installs and validation see an identical catalog.

## References

- ISO/IEC/IEEE 29148 — Requirements engineering.
- `@agent-ix/ix-cli-core` — runtime context/config root.
- `@agent-ix/ts-plugin-kit` — marketplace install, reconcile, and registry
  primitives for the default set and user/community plugins.
- `ix-flow` — workflow lifecycle (resume/advance/gate/status) after launch.
- `quire` — frontmatter-driven validation over authored spec files.
