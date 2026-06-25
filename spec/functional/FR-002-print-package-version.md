---
id: FR-002
title: "Report the installed package version"
type: FR
relationships:
  - target: "ix://agent-ix/quoin/StR-001"
    type: "traces_to"
---

# FR-002: Report the installed package version

## Description

The CLI SHALL print its own package version — read from the package's
`package.json` — in response to the `version` command, the `--version` flag, or
the `-v` flag, and SHALL raise an error when the package version is missing or
not a string.

## Inputs

- The `version` command, or the `--version` / `-v` flag.

## Outputs

- The version string on standard output, or a raised error when the version is
  unreadable.

## Behavior

- The CLI SHALL resolve its `package.json` relative to the installed package and
  read the `version` field.
- The CLI SHALL print that version and return before any other dispatch.
- The CLI SHALL raise an explicit error when the `version` field is absent or is
  not a string.

## Acceptance Criteria

| ID          | Criteria                                                        | Verification                        |
| ----------- | --------------------------------------------------------------- | ----------------------------------- |
| FR-002-AC-1 | `version`, `--version`, and `-v` each print the package version | Test (cli.test.ts, scripts.test.ts) |
| FR-002-AC-2 | The reported value is a non-empty string                        | Test (cli.test.ts)                  |
| FR-002-AC-3 | A missing or non-string version field raises an error           | Test (cli-version-missing.test.ts)  |

## Dependencies

- **Upstream**: [StR-001](../stakeholder/StR-001-standalone-cli.md) standalone CLI.
- **Downstream**: [FR-022](./FR-022-self-update.md) compares this running version
  against the latest published version.
