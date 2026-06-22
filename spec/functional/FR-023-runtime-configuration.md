---
id: FR-023
title: "quoin runtime configuration surface"
type: FR
object: configuration
relationships:
  - target: "ix://agent-ix/quoin/StR-001"
    type: "traces_to"
  - target: "ix://agent-ix/quoin/FR-004"
    type: "specifies"
  - target: "ix://agent-ix/quoin/FR-007"
    type: "specifies"
---

# [FR-023] quoin runtime configuration surface

## Description

`quoin` SHALL read its configuration from a defined surface of environment
variables and command-line flags that select the config root, the module search
paths, the workflow skill root, and per-invocation output and registry options.
This document defines that configuration surface; the behavior that consumes it
is specified by [FR-004](./FR-004-resolve-config-root.md) and
[FR-007](./FR-007-assemble-module-roots.md).

## Configuration

| Name                   | Scope   | Type    | Default              | Description                                                                            |
| ---------------------- | ------- | ------- | -------------------- | -------------------------------------------------------------------------------------- |
| IX_HOME                | runtime | string  | ~/.ix                | Config root and parent of the shared module store, used when `--config-root` is absent |
| QUOIN_MODULE_PATHS     | runtime | string  | (unset)              | Colon-separated module roots assembled before the installed store                      |
| IX_SPEC_WORKFLOWS_ROOT | runtime | string  | (unset)              | First candidate root searched when resolving a workflow skill                          |
| --config-root          | session | string  | IX_HOME or ~/.ix     | Config root for a single invocation                                                    |
| --no-project-config    | session | boolean | false                | Disables the `<cwd>/.ix` project config root for the invocation                        |
| --json                 | session | boolean | false                | Renders command output as JSON                                                         |
| --registry             | session | string  | (ambient npm config) | Registry used by `update` to query and install                                         |

## Behavior

The CLI reads each environment variable on every invocation, so a change takes
effect on the next run. A `--config-root` flag overrides `IX_HOME` for that
invocation; the resolved root is exported to `IX_HOME` so downstream resolution
is consistent. Flag values apply only to the invocation that carries them.

## Acceptance Criteria

| ID          | Criteria                                                                                | Verification                        |
| ----------- | --------------------------------------------------------------------------------------- | ----------------------------------- |
| FR-023-AC-1 | `--config-root`, then `IX_HOME`, then `~/.ix` select the config root in that precedence | Test (cli.test.ts, catalog.test.ts) |
| FR-023-AC-2 | `QUOIN_MODULE_PATHS` roots are assembled before the installed store                     | Test (catalog.test.ts)              |
| FR-023-AC-3 | `IX_SPEC_WORKFLOWS_ROOT` is the first candidate when resolving a workflow skill         | Test (flows.test.ts)                |

## Dependencies

- **Upstream**: [StR-001](../stakeholder/StR-001-standalone-cli.md) standalone CLI.
- **Downstream**: consumed by [FR-004](./FR-004-resolve-config-root.md),
  [FR-007](./FR-007-assemble-module-roots.md), and
  [FR-020](./FR-020-resolve-workflow-skills.md).
