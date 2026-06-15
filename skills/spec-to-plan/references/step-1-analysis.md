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
    -   Create or update `/plan/plan.md` with a requirements checklist.
    -   Include the full dependency graph with edge labels.

## Output Format (/plan/plan.md)

```markdown
# Implementation Plan: [Component Name]

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
```
