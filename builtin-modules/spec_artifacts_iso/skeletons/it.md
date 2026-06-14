---
id: IT-001
title: "Checksum mismatch rejects the import"
artifact_type: IT
relationships:
  - target: "ix://agent-ix/example/FR-001"
    type: "verifies"
---
<!-- IT authoring skeleton (spec-artifacts-iso). Fill every section with
     substantive content. Contract (manifest body_extraction asserts):
     - Description, Body, Dependencies are required H2 sections (level 2).
     - Keep headings unique per level; nest ≤2 levels below the H1 title (through H3). -->
# [IT-001] Checksum mismatch rejects the import

## Description

An integration test that imports an artifact whose declared digest does not match
its bytes and asserts the platform rejects the import end to end.

## Body

Given a running import service and an artifact whose declared SHA-256 digest is
deliberately wrong, when the artifact is submitted to the import endpoint, then
the service responds with a rejection error carrying both the declared and
computed digests, and no artifact row is persisted to the store.

## Dependencies

- **Upstream**: FR-001 checksum verification on import
- **Downstream**: none
