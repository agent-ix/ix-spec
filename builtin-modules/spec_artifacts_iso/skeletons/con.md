---
id: CON-001
title: "Digest algorithm is fixed to SHA-256"
artifact_type: CON
relationships:
  - target: "ix://agent-ix/example/FR-001"
    type: "constrains"
---
<!-- CON authoring skeleton (spec-artifacts-iso). Fill every section with
     substantive content. Contract (manifest body_extraction asserts):
     - Description, Body, Dependencies are required H2 sections (level 2).
     - Keep headings unique per level; nest ≤2 levels below the H1 title (through H3). -->
# [CON-001] Digest algorithm is fixed to SHA-256

## Description

A constraint fixing the cryptographic digest algorithm used for artifact
integrity verification.

## Body

The import path SHALL compute and compare digests using SHA-256 exclusively.
Alternative or configurable digest algorithms are out of scope; this constraint
exists to keep the integrity contract unambiguous and auditable across all
deployments.

## Dependencies

- **Upstream**: platform security policy
- **Downstream**: FR-001 checksum verification on import
