---
id: FR-022
title: "Upgrade quoin to the latest published release"
type: FR
relationships:
  - target: "ix://agent-ix/quoin/StR-006"
    type: "traces_to"
  - target: "ix://agent-ix/quoin/FR-002"
    type: "references"
---

# FR-022: Upgrade quoin to the latest published release

## Description

The CLI SHALL expose an `update` command that upgrades `quoin` to the latest
published `@agent-ix/quoin` by delegating to `ix-cli-core`'s self-update
(querying the registry, comparing against the running version, and installing
globally), supporting a `--check` mode that reports availability without
installing and a `--registry <url>` option that selects the registry; with no
`--registry`, the ambient npm configuration resolves the package.

## Inputs

- An `update` invocation with optional `--check` and `--registry <url>` flags.

## Outputs

- An in-place upgrade, or an availability report under `--check`.

## Behavior

- The CLI SHALL delegate to `ix-cli-core`'s self-update with the `@agent-ix/quoin`
  package coordinates and the running version (see
  [FR-002](./FR-002-print-package-version.md)).
- The CLI SHALL report availability without installing when `--check` is given.
- The CLI SHALL pass a `--registry` value through, and SHALL otherwise let the
  ambient npm configuration resolve the package.

## Acceptance Criteria

| ID          | Criteria                                                                                                         | Verification          |
| ----------- | ---------------------------------------------------------------------------------------------------------------- | --------------------- |
| FR-022-AC-1 | `update` delegates to the self-update with `@agent-ix/quoin`, the running version, and the `quoin update` header | Test (update.test.ts) |
| FR-022-AC-2 | `--check` is passed through to report availability without installing                                            | Test (update.test.ts) |
| FR-022-AC-3 | `--registry <url>` is passed through, and its absence leaves resolution to the ambient npm config                | Test (update.test.ts) |

## Dependencies

- **Upstream**: [StR-006](../stakeholder/StR-006-current-via-self-update.md). The
  version comparison and install are provided by `@agent-ix/ix-cli-core`.
- **Downstream**: external-process invocation is constrained by
  [NFR-007](../non-functional/NFR-007-external-tool-invocation.md).
