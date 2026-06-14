---
id: AC-001
title: "Mismatched digest is rejected"
artifact_type: AC
relationships:
  - target: "ix://agent-ix/example/FR-001"
    type: "verifies"
---
<!-- AC authoring skeleton (spec-artifacts-iso). Fill every section with
     substantive content. Contract (manifest body_extraction asserts):
     - Description, Body, Dependencies are required H2 sections (level 2).
     - Keep headings unique per level; nest ≤2 levels below the H1 title (through H3). -->
# [AC-001] Mismatched digest is rejected

## Description

A standalone acceptance criterion asserting the rejection behavior for an
artifact whose declared digest does not match its bytes.

## Body

Given an imported artifact whose computed SHA-256 digest differs from its
declared digest, the system rejects the import and surfaces a digest-mismatch
error to the caller.

## Dependencies

- **Upstream**: FR-001 checksum verification on import
- **Downstream**: none
