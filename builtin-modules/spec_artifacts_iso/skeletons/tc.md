---
id: TC-001
title: "Reject artifact with mismatched digest"
artifact_type: TC
relationships:
  - target: "ix://agent-ix/example/FR-001"
    type: "verifies"
---
<!-- TC authoring skeleton (spec-artifacts-iso). Fill every section with
     substantive content. Contract (manifest body_extraction asserts):
     - Description, Body, Dependencies are required H2 sections (level 2).
     - Keep headings unique per level; nest ≤2 levels below the H1 title (through H3). -->
# [TC-001] Reject artifact with mismatched digest

## Description

A test case verifying that importing an artifact with a mismatched digest yields
a rejection and leaves the store unchanged.

## Body

Preconditions: the import service is running and the store is empty. Steps:
submit an artifact whose declared digest differs from its computed SHA-256 digest.
Expected result: the request is rejected with a digest-mismatch error and the
store contains zero artifacts.

## Dependencies

- **Upstream**: FR-001 checksum verification on import
- **Downstream**: none
