---
id: queue-001
title: "Artifact ingest queue"
artifact_type: queue
---
<!-- queue authoring skeleton (spec-objects-architecture). Fill every section
     with substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type; artifact_type is
       queue (quire resolves the archetype from it).
     - "## Message Format" (H2, required): MUST contain a fenced ```json code
       block holding an example message payload (or its schema).
     - Keep headings unique per level. -->
# [queue-001] Artifact ingest queue

## Message Format

Each message announces one uploaded artifact awaiting checksum verification.
Messages are JSON-encoded and keyed by `artifact_id` for partition affinity.

```json
{
  "event": "artifact.uploaded",
  "artifact_id": "7f9c2ba4-e88f-4aa9-a3c1-0d2e6f1b5a90",
  "digest": "a3f5c1d2e6b4980f7c2a1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8091a2b3c4d5e6",
  "size_bytes": 1048576,
  "uploaded_at": "2026-06-10T12:00:00Z"
}
```
