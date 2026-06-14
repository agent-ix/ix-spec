---
id: FR-001
title: "Verify checksums on artifact import"
artifact_type: FR
relationships:
  - target: "ix://agent-ix/example/US-001"
    type: "implements"
---
<!-- FR authoring skeleton (spec-artifacts-iso). Fill every section with
     substantive content. Contract (manifest body_extraction asserts):
     - REQUIRED (level 2): Description, Acceptance Criteria (with table).
     - OPTIONAL (level 2): Inputs, Outputs, Behavior, Constraints,
       Dependencies. There is NO `## Specification` umbrella — all
       sections sit at level 2. Include Inputs/Outputs only when the FR
       genuinely has operational I/O; object FRs (`object:` frontmatter,
       e.g. data_schema/process/configuration/interface) carry their
       kind's anchor sections instead.
     - Constraints, when present: table headers exactly
       ID | Constraint | Type | Validation, ≥1 data row, ID column
       matching ^<this-doc-id>-CON-\d+$. Omit the section rather than
       inventing filler constraints.
     - Acceptance Criteria table headers MUST be exactly:
       ID | Criteria | Verification with ≥1 data row; the ID column
       matches ^<this-doc-id>-AC-\d+$. The table is the canonical index;
       an AC needing block content MAY add a `### FR-XXX-AC-N`
       subsection that SUPPLEMENTS its row (structure + prose).
     - Verification cells use the ISO 29148 methods — Inspection |
       Analysis | Demonstration | Test — optionally annotated with test
       refs, e.g. `Test (TC-035)` (lint rule `ac-verification-method`).
     - Relationships: author the explicit `relationships:` array (the
       only form carrying a typed verb, incl. `specifies` for object FR
       → behavioral FR); bare-ID sugar fields like `depends_on:` are
       read-side tolerance only — do not author them.
     - Keep headings unique per level; nest ≤2 levels below the H1 title
       (through H3). -->
# [FR-001] Verify checksums on artifact import

## Description

The system SHALL verify the SHA-256 checksum of every imported artifact before
persisting it, rejecting any artifact whose computed digest does not match the
declared digest.

## Inputs

- Imported artifact bytes
- Declared SHA-256 digest from the import manifest

## Outputs

- Accepted artifact persisted to the store
- Rejection error carrying the declared/computed digest pair

## Behavior

- The system SHALL compute the SHA-256 digest of the artifact bytes on import.
- The system SHALL reject the artifact when the computed digest differs from the
  declared digest.
- The system SHALL persist the artifact only after a successful digest match.

## Constraints

| ID | Constraint | Type | Validation |
|----|------------|------|------------|
| FR-001-CON-1 | Digest computation SHALL use SHA-256 only | Security | Integration Test |

## Acceptance Criteria

| ID | Criteria | Verification |
|----|----------|--------------|
| FR-001-AC-1 | Given a matching digest, the artifact is persisted | Test (TC-001) |
| FR-001-AC-2 | Given a mismatched digest, the import is rejected | Test (TC-002) |

## Dependencies

- **Upstream**: US-001 artifact import
- **Downstream**: IT-001 checksum rejection coverage
