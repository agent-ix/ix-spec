---
id: action-001
title: "Verify artifact checksum"
artifact_type: action
---
<!-- action authoring skeleton (spec-objects-architecture). Fill every section
     with substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type; artifact_type is
       action (quire resolves the archetype from it).
     - "## Inputs" (H2, required): every input the action consumes, with type
       and source.
     - Keep headings unique per level. -->
# [action-001] Verify artifact checksum

## Inputs

- `artifact_id` (uuid) — identifies the uploaded artifact to verify; supplied
  by the `artifact.uploaded` queue message.
- `declared_digest` (hex SHA-256 string) — the digest the uploader claimed;
  read from the artifact's import manifest.
- `content_stream` (bytes) — the stored artifact bytes, streamed from the
  object store so verification never buffers the whole artifact in memory.
