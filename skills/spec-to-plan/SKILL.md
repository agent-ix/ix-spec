---
name: spec-to-plan
description: Convert ISO spec requirements (StR, FR, NFR) into a TDD-based project plan with dependency analysis, parallel execution tracks, quality gates, and task decomposition. Creates /plan/plan.md and /plan/tasks/.
---

# Spec to Plan

This skill provides a structured workflow for converting ISO/IEC/IEEE 29148 compliant specifications into an executable, dependency-aware project plan with parallel execution tracks and quality gates.

## Purpose

Use this skill when:
- You are starting a new implementation task based on an existing Spec.
- You need to generate a Test Plan before writing code (TDD).
- You want to ensure full traceability from Requirements (StR/FR/NFR) to Tests.
- You need to identify what can be parallelized vs what must be serial.
- You want quality gates to catch fundamental problems before downstream work is wasted.

## Pre-conditions (Readiness Gate)

Task generation MAY begin only when ALL of the following are true:

- All requirements are atomic and testable.
- Ownership is assigned (see `spec-scope-boundary-analysis`).
- Dependencies are known (see `spec-dependency-analysis`).
- Risks are classified (see `spec-risk-complexity-analysis`).
- Verification strategy is defined (see `spec-evidence-analysis`).
- Failure-domain analysis is complete (see `spec-failure-domain-analysis`).

Failure to meet these conditions WILL result in unstable tasking. If any condition is unmet, stop and complete the corresponding analysis skill first.

## Steps
All steps required!

1.  **[Analysis](references/step-1-analysis.md)**: Analyze the spec structure and map dependencies.
2.  **[Test Plan](references/step-2-test-plan.md)**: Generate the list of required tests.
3.  **[Execution Plan](references/step-3-execution-plan.md)**: Derive dependency graph, critical path, parallel tracks, quality gates, and task decomposition.

## Output

This skill produces or updates:
-   `<project_root>/plan/plan.md`: The central living document containing requirements summary, dependency graph, execution tracks, quality gates, and test plan.
-   `<project_root>/plan/tasks/`: Individual task files for distribution and tracking, with status, dependencies, and subtask breakdowns.
-   `<project_root>/plan/tasks/README.md`: Task index showing completed work, active tracks, and coordination rules.
