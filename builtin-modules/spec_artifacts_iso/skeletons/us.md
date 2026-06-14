---
id: US-001
title: "Import an artifact with integrity verification"
artifact_type: US
relationships:
  - target: "ix://agent-ix/example/StR-001"
    type: "traces_to"
---
<!-- US authoring skeleton (spec-artifacts-iso). Fill every section with
     substantive content. Contract (manifest body_extraction asserts):
     - Description, Body, Dependencies are required H2 sections (level 2).
     - Keep headings unique per level; nest ≤2 levels below the H1 title (through H3). -->
# [US-001] Import an artifact with integrity verification

## Description

A user story describing an operator importing an artifact and relying on the
platform to verify its integrity automatically.

## Body

As an operator, I want the platform to verify the SHA-256 digest of an artifact
I import, so that I am confident the stored artifact exactly matches the bytes I
intended to upload and any corruption is surfaced immediately.

## Dependencies

- **Upstream**: StR-001 tamper-evident imports
- **Downstream**: FR-001 checksum verification on import
