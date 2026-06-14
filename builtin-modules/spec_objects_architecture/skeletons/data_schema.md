---
id: data-schema-001
title: "Artifact record"
artifact_type: data_schema
---
<!-- data_schema authoring skeleton (spec-objects-architecture). Fill every
     section with substantive content. Contract (manifest body_extraction
     asserts):
     - Frontmatter MUST carry id, title, artifact_type; artifact_type is
       data_schema (quire resolves the archetype from it).
     - "## Schema" (H2, required): MUST contain a fenced ```json code block
       holding the JSON Schema for the record.
     - Keep headings unique per level. -->
# [data-schema-001] Artifact record

## Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Artifact",
  "type": "object",
  "required": ["artifact_id", "digest", "size_bytes", "created_at"],
  "properties": {
    "artifact_id": { "type": "string", "format": "uuid" },
    "digest": { "type": "string", "pattern": "^[a-f0-9]{64}$" },
    "size_bytes": { "type": "integer", "minimum": 0 },
    "content_type": { "type": "string" },
    "created_at": { "type": "string", "format": "date-time" }
  },
  "additionalProperties": false
}
```
