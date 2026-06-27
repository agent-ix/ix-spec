# Step 1: Requirements Analysis

**Goal**: Analyze the ISO specification to understand what needs to be built, map dependencies, and identify the requirement dependency graph that drives execution planning.

## Process

1.  **Locate References**:
    -   Find the component specification (usually `spec.md` or `specs/`).
    -   Identify `stakeholder/*.md`, `functional/*.md`, and `non-functional/*.md`.

2.  **Order of Analysis**:
    -   **Stakeholder Requirements (StR)**: Understand the "Why" and "Who". Identify normative constraints.
    -   **Functional Requirements (FR)**: Understand the "What". These map directly to logic and Unit/Integration tests.
    -   **Non-Functional Requirements (NFR)**: Understand the "How" (Quality). These map to performance/security constraints and Verification tests.

3.  **Dependency Extraction**:
    -   **Primary source**: YAML `traces:` and `relationships:` frontmatter arrays in each spec file.
    -   **Secondary source**: Normative references in requirement text (e.g., "SHALL use GenericXLog" implies a dependency on the WAL requirement).
    -   **Shared algorithms**: If two FRs describe the same underlying algorithm (e.g., graph traversal used by both scan and insert), note this as a shared dependency even if not explicitly linked in frontmatter.
    -   **Build a DAG**: Express dependencies as directed edges with reasons. This graph drives Step 3 execution planning.

4.  **Traceability Mapping**:
    -   Create or update the target bundle's `plan/<Plan-id>-<slug>/plan.md` (the
        bundle resolved in Step 0) with a requirements checklist.
    -   Include the full dependency graph with edge labels.
    -   Ensure the plan's frontmatter `relationships:` carries one `references` edge
        per requirement the plan covers (see the frontmatter block below); this is
        the machine-readable trace.

## Output Format (plan/<Plan-id>-<slug>/plan.md)

The file is a `type: Plan` artifact. Frontmatter is the machine contract; the body
below is the human-facing plan. `<org>`/`<component>` come from `spec.md`
frontmatter (`org`, `name`).

```markdown
---
id: Plan-001
title: "[Component] — [plan title]"
type: Plan
status: active
relationships:
  - target: ix://<org>/<component>/FR-001
    type: references
  - target: ix://<org>/<component>/NFR-001
    type: references
  # …one `references` edge per covered requirement
---
# Implementation Plan: [Plan title]

## Requirements Summary

### Stakeholder Requirements
- [ ] **StR-001**: [Summary]

### Functional Requirements
- [ ] **FR-001**: [Summary]
- [ ] **FR-002**: [Summary]

### Non-Functional Requirements
- [ ] **NFR-001**: [Summary]

## Dependency Graph

### Core dependency edges
- `FR-001 -> FR-002, FR-003`
  Reason: [why FR-002 and FR-003 depend on FR-001]
- `FR-004 + FR-005 -> FR-006`
  Reason: [why FR-006 needs both]

### Shared dependencies
- [Algorithm/component X] is needed by FR-007, FR-008, and FR-009.
  Extract as a discrete deliverable before any of them start.

### Cross-cutting constraints
- `NFR-001` applies to [which code paths].
- `NFR-002` applies to [which merge points].

### The seams (optional)
One short paragraph grounding the plan in the existing code — the concrete files,
functions, or boundaries each track attaches to (e.g. "FR-021 widens the write guard in
`authorize.ts`; FR-022 reuses the existing `chokidar-change-source.ts`"). Keep it to a
few sentences; omit if the spec is greenfield.
```

This is the **single** dependency-graph representation for the bundle. Step 3 references
it — it does not re-emit a "Remaining Dependency Graph" or a separate "Execution Tracks"
section.
