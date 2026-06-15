---
id: Matrix-002
title: ix-spec Authoring Eval Matrix
artifact_type: TestMatrix
relationships:
  - target: "ix://agent-ix/ix-spec/US-001"
    type: "covers"
  - target: "ix://agent-ix/ix-spec/US-002"
    type: "covers"
  - target: "ix://agent-ix/ix-spec/US-003"
    type: "covers"
  - target: "ix://agent-ix/ix-spec/US-004"
    type: "covers"
  - target: "ix://agent-ix/ix-spec/US-005"
    type: "covers"
---

# ix-spec Authoring Eval Matrix

## Purpose

This matrix defines the minimum agent-facing eval set for spec creation and
maintenance. Unit tests prove command behavior; these evals measure whether an
agent can use the commands efficiently to produce valid spec artifacts.

## Metrics

| Metric              | Definition                                                      | Target                      |
| ------------------- | --------------------------------------------------------------- | --------------------------- |
| Success             | Eval finishes with valid expected files and passing validation. | 100% for release candidates |
| Latency             | Wall-clock time from first command to final validation result.  | Track p50/p95 by scenario   |
| Tool calls          | Number of shell/CLI/tool invocations used by the agent.         | Track and minimize          |
| Input tokens        | Prompt/context tokens consumed by the agent.                    | Track and minimize          |
| Output tokens       | Agent response/output tokens.                                   | Track and minimize          |
| Validation attempts | Number of Quire validation runs before success.                 | Prefer 1                    |
| Context fetches     | Number of repeated template/catalog fetches for the same type.  | Prefer 1 per type pack      |

## Variation Coverage

| Dimension          | Required Variations                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| Authoring mode     | greenfield repo, brownfield edit, multi-document creation, validation repair loop                             |
| Type source        | bundled artifact, bundled object, installed local plugin, installed GitHub/plugin package, sibling dev module |
| Type lookup        | canonical casing, lowercase input, mixed artifact/object request, unknown type                                |
| Validation scope   | exact module scope, repo search scope, multiple glob arguments, changed-file subset, invalid document         |
| Workflow lifecycle | review launch, matrix launch, to-plan launch, status inspection, human gate handoff                           |
| Config state       | clean isolated `~/.ix`, existing plugin registry, plugin removal/reinstall                                    |
| Agent efficiency   | one authoring pack reused across multiple files, no repeated template fetch for same type                     |

## Scenarios

| Eval   | Use Case       | Prompt                                                                | Expected Outcome                                                                                | Required Measurements                                     |
| ------ | -------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| EV-001 | US-001         | Create an FR plus `domain` and `entity` objects for a small feature.  | Agent uses one `ix-spec write` pack, creates all files, and Quire validates them.               | success, latency, tool calls, tokens, validation attempts |
| EV-002 | US-002         | Edit an existing FR after discovering its authoring contract.         | Agent uses `catalog show` or `write`, edits only needed sections, and validates changed files.  | success, latency, tool calls, tokens                      |
| EV-003 | US-003         | Install a local fixture plugin and author one plugin-defined object.  | Plugin appears in catalog, `write --types` resolves it, created file validates.                 | success, latency, tool calls, tokens                      |
| EV-004 | US-004         | Validate a mixed changed set of artifact and object files.            | Agent runs scoped Quire validation over the changed file set and reports failures clearly.      | success, latency, tool calls, validation attempts         |
| EV-005 | US-005         | Start a review workflow for a spec directory and inspect status.      | `ix-spec` starts the workflow and `ix-flow status` reports the run and gate state.              | success, latency, tool calls                              |
| EV-006 | US-001, US-004 | Create multiple artifacts that share object templates.                | Agent fetches each type contract once, reuses it across files, and validates all changed files. | success, context fetches, tokens, tool calls              |
| EV-007 | US-002         | Use lowercase type names in an authoring request.                     | `ix-spec write . --types fr,domain` resolves canonical types and prints usable contracts.       | success, latency, tool calls                              |
| EV-008 | US-004         | Repair a spec file after Quire reports validation diagnostics.        | Agent interprets diagnostics, edits the failing file, and reaches passing validation.           | success, latency, tool calls, tokens, validation attempts |
| EV-009 | US-003         | Install, list, remove, and reinstall a local plugin fixture.          | Plugin registry changes are isolated to `IX_HOME`; catalog reflects each lifecycle step.        | success, latency, tool calls                              |
| EV-010 | US-003         | Install a GitHub/package plugin fixture and request one of its types. | `write --types` resolves the installed type and prints usable paths.                            | success, latency, tool calls, tokens                      |
| EV-011 | US-002         | Request an unknown type in an authoring pack.                         | CLI reports the missing type clearly and exits non-zero.                                        | success, latency, tool calls                              |
| EV-012 | US-004         | Validate multiple globs for a changed-file subset.                    | Quire validates only matching files and reports each invalid file with a path.                  | success, latency, tool calls, validation attempts         |
| EV-013 | US-005         | Start matrix and to-plan workflows after accepted requirements.       | `ix-spec matrix` and `ix-spec to-plan` create runs that `ix-flow status` can inspect.           | success, latency, tool calls                              |
| EV-014 | US-001, US-002 | Author a Phase 0 spec set from a settled conversation.                | Agent creates spec, use cases, matrix, plan, and eval matrix, then validates all spec files.    | success, latency, tool calls, tokens, context fetches     |
| EV-015 | US-001, US-004 | Author with sibling development modules present.                      | Catalog prefers intended dev modules deterministically and validation uses matching contracts.  | success, latency, tool calls, tokens                      |

## Harness Requirements

The executable harness SHOULD reuse the existing eval layers from
`ix-spec-workflows` and `ix-agent-skills/packages/workflow-evals`:

- static scenario validation for `scenario.yaml`, `user-turns.yaml`, and
  `expect.yaml` shape;
- deterministic pipeline evals for Quire/catalog behavior that can run without
  an LLM;
- opt-in agent evals through `workflow-evals` and `agent-pty` for real
  Claude/Codex sessions in tmux.

The eval harness SHOULD run scenarios in disposable repositories with isolated
`IX_HOME` values. Each run SHOULD record command transcript, wall-clock timing,
agent token usage, and tool-call count in a machine-readable result file. Agent
evals that invoke Claude/Codex require explicit operator approval because they
may send workspace context to an external model provider.

The harness SHOULD store per-scenario fixtures for:

- empty repo with no spec files;
- repo with existing artifact/object files;
- local plugin module fixture;
- GitHub/package plugin fixture or mocked install source;
- sibling development module fixture;
- changed-file manifest for validation-only scenarios.

## Current Harness Inventory

`ix-spec` includes an executable deterministic eval runner at `evals/run.mjs`.
`pnpm run test:evals` builds the CLI, runs EV-001 through EV-015 in disposable
repositories with isolated `IX_HOME` values, and writes the latest metrics to
`evals/reports/latest.json`.

The deterministic runner records latency, tool-call count, validation attempts,
context fetches, command transcripts, and token fields. Token usage is `null`
for deterministic runs because no LLM is invoked.

The reference `agent-pty`/tmux runner pattern remains available in
`ix-agent-skills/packages/workflow-evals` for a future opt-in agent layer. Real
Claude/Codex evals require explicit operator approval because they may send
workspace context to an external model provider.

## Release Gate

Before a stable release, every eval in this matrix SHOULD pass on the target
agent runners. Any scenario without automated token/tool-call instrumentation
MUST still run the functional command transcript and record latency manually.
