---
id: FR-020
title: "Expose workflow launchers and resolve their skills"
type: FR
relationships:
  - target: "ix://agent-ix/quoin/StR-004"
    type: "traces_to"
  - target: "ix://agent-ix/quoin/US-005"
    type: "implements"
---

# [FR-020] Expose workflow launchers and resolve their skills

## Description

The CLI SHALL expose the `review`, `matrix`, and `to-plan` workflow launchers,
and for each SHALL resolve the workflow's skill path across, in order, the
`IX_SPEC_WORKFLOWS_ROOT` environment variable, the packaged skills, a sibling
`ix-spec-workflows` checkout, and `~/.ix/plugins`, raising an error when no
candidate root contains the skill.

## Inputs

- A `review`, `matrix`, or `to-plan` invocation, and the candidate skill roots.

## Outputs

- The resolved skill path, or a raised error naming the workflow.

## Behavior

- The CLI SHALL recognize `review`, `matrix`, and `to-plan` as workflow
  launchers.
- The CLI SHALL search the candidate roots in order and SHALL use the first that
  contains the workflow's skill.
- The CLI SHALL raise an error directing the user to set `IX_SPEC_WORKFLOWS_ROOT`
  when no candidate contains the skill.

## Acceptance Criteria

| ID          | Criteria                                                                                                      | Verification                  |
| ----------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| FR-020-AC-1 | `review`, `matrix`, and `to-plan` are recognized as the bundled workflow launchers                            | Test (flows.test.ts)          |
| FR-020-AC-2 | An unknown workflow name raises an error                                                                      | Test (flows.test.ts)          |
| FR-020-AC-3 | When no candidate root contains the skill, an error names the workflow and points to `IX_SPEC_WORKFLOWS_ROOT` | Test (flows-notfound.test.ts) |

## Dependencies

- **Upstream**: [StR-004](../stakeholder/StR-004-governed-workflows.md);
  [US-005](../usecase/US-005-start-gated-spec-workflow.md).
- **Downstream**: the resolved skill is launched by
  [FR-021](./FR-021-launch-ix-flow-runs.md).
