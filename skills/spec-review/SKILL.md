---
name: spec-review
description: Review requirements for quality, consistency, and completeness.
---

# Review Requirements

Use this skill to validate requirements artefacts before implementation.

## Checklist

See **[references/checklist.md](references/checklist.md)** for the detailed quality gates.

## Process

1.  Automated Checks:
    -   Validate ID formats (US/FR/TC/AC/CON).
    -   Detect duplicates or gaps.
    -   Validation link integrity.
2.  Manual Review:
    -   Read each artifact.
    -   Verify against the **Checklist**.
    -   Verify Test Coverage (6 Rules).
    -   Run Analysis Skills:
        -   `spec-failure-domain-analysis`
        -   `spec-integrity-analysis`
        -   `spec-dependency-analysis`
        -   `spec-evidence-analysis`
        -   `spec-risk-complexity-analysis`
        -   `spec-scope-boundary-analysis`
3.  Findings:
    -   Document issues or gaps.
    -   Assign action items.
    -   Do not proceed to implementation until reviewed.

## Common Issues

-   Vague Criteria: "Fast", "User-friendly". -> Make measurable.
-   Missing Errors: Only happy path. -> Add error modes.
-   No Coverage: AC without TC. -> Add tests.
-   Inconsistent IDs: `US-1` instead of `US-001`. -> Fix formatting.
