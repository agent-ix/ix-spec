---
id: StR-001
title: "Operators need tamper-evident artifact imports"
artifact_type: StR
relationships:
  - target: "ix://agent-ix/example/FR-001"
    type: "satisfied_by"
---
<!-- StR authoring skeleton (spec-artifacts-iso). Fill every section with
     substantive content. Contract (manifest body_extraction asserts):
     - Description, Body, Dependencies are required H2 sections (level 2).
     - Keep headings unique per level; nest ≤2 levels below the H1 title (through H3). -->
# [StR-001] Operators need tamper-evident artifact imports

## Description

This stakeholder requirement captures the operations team's need to detect any
corruption or tampering of artifacts as they enter the platform.

## Body

As platform operators, we require that every imported artifact be verified
against a declared cryptographic digest so that silent corruption or malicious
substitution is detected and rejected before the artifact is trusted by any
downstream system.

## Dependencies

- **Upstream**: platform security policy
- **Downstream**: FR-001 checksum verification on import
