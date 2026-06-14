---
id: SCOPE-001
title: "documents:read OAuth scope"
artifact_type: scope
---
<!-- scope authoring skeleton (spec-objects-security). Fill every part with
     substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type: scope).
     - A "Grants" section MUST list the permissions this scope confers. -->
# [SCOPE-001] documents:read OAuth scope

OAuth 2.0 scope requested by third-party integrations that need read-only
access to a tenant's document library through the Atlas public API.

## Grants

- PERM-001 — read tenant documents (`document:read`)
- Listing document metadata via `GET /api/documents`
- Downloading rendered document content via `GET /api/documents/{id}/content`
- Excludes all write verbs; mutations require the separate `documents:write` scope
