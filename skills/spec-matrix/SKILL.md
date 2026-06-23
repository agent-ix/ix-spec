---
name: spec-matrix
description: Build and maintain the requirements Test Matrix ensuring 100% coverage.
---

# Build Test Matrix

Use this skill to create the requirements Test Matrix and ensure comprehensive coverage.

## Rules (The Six Requirements)

1.  Coverage: Every Acceptance Criterion (AC) must have ≥1 Test Case (TC).
2.  Option Permutation: Test all valid option combinations.
3.  Constraint Boundary: Test min, max, below-min (fail), above-max (fail).
4.  Error Path: Test all documented error conditions.
5.  State Transition: Test all valid state transitions (if applicable).
6.  Edge Case: Identify and test extreme/unusual scenarios.

## EARS precondition (atomic, mappable requirements)

Coverage (Rule 1) is only meaningful when each requirement states **one**
obligation — a statement packing two `shall` clauses cannot map cleanly to one
Acceptance Criterion, so its matrix row is ambiguous. Before building the
matrix, run the EARS requirement-grammar check:

```bash
quire validate --scope . "spec/**/*.md" --summary
```

Treat these `[ears:…]` findings as **un-mappable requirements to fix first**,
not coverage you can claim:

-   `non-singular` — split the statement into one requirement per `shall`, then
    map each to its own AC/TC.
-   `unclassifiable` / `missing-subject` — the obligation is unclear; clarify the
    requirement before authoring a TC against it.

Do not mark the matrix ✅ Complete while non-singular or unclassifiable
requirements remain — the coverage they appear to have is illusory. (The check
is advisory; this skill treats it as a quality gate for the matrix.)

## Process

1.  Initialize:
    -   Use template `assets/test-matrix-template.md`.
    -   Target: Correct location.
        -   Single Repo: `spec/tests.md`
        -   Multi-Repo: `specs/<category>/<component>/spec/tests.md`
2.  Traceability:
    -   Map `StR` -> `TC`.
    -   Map `US` -> `TC`.
    -   Map `FR` -> `TC`.
    -   Map `NFR` -> `TC`.
    -   Map `C` (Constraints) -> `TC`.
3.  Enumerate: List all Test Cases with ID, Title, Type, Priority, Status.
4.  Define Detailed TCs (Optional):
    -   For complex tests, create at:
        -   Single Repo: `spec/test-cases/TC-XXX.md`
        -   Multi-Repo: `specs/<category>/<component>/spec/test-cases/TC-XXX.md`
5.  Verify: Ensure all 6 rules are satisfied.
6.  Status: Mark as ✅ Complete only when all rules are met.

## React Components (Conditional)

For React projects, add a Storybook Test Matrix section.

See `skills/review-react/SKILL.md` for:
- Story file requirements per component
- AC trace code format in story JSDoc
- Coverage matrix template (FR → AC → Story)

## Integration Test Matrix (Conditional)

If ANY requirement specifies integration testing, include this section.

### When Required

- FR/NFR annotation: `integration_test: true` or mentions integration verification
- Cross-project interactions (other services in your org)
- Interactions with local-provided services (Redis, Postgres, message bus)
- UI component browser testing (React → Storybook)

### Section Contents

Use template section `## Integration Test Matrix` with:
1. **Purpose column**: What integration is being tested
2. **Target column**: External system/service/project
3. **Type column**: `service` | `browser` | `event` | `database`
4. **Test Cases**: Extensive functional coverage, not just smoke tests

### Coverage Expectations

- Extensively test functionality (multiple scenarios per integration)
- Include happy path + error conditions + edge cases
- For browser tests: visual verification + interaction flows

## Markers

-   ✅ Complete
-   ⚠️ Partial
-   ❌ Missing
-   🚧 In Progress
