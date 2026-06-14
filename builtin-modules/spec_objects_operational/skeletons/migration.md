---
id: MIG-001
title: "Add checksum column to artifacts table"
artifact_type: migration
---
<!-- migration authoring skeleton (spec-objects-operational). Fill the SQL
     with the real, runnable migration. Contract (manifest body_extraction):
     - Frontmatter MUST carry id, title, and artifact_type: migration.
     - "## Migration" (H2) is REQUIRED and MUST contain a fenced ```sql code
       block; its content is extracted as `sql`.
     - Keep the migration idempotent or guarded so reruns are safe. -->
# [MIG-001] Add checksum column to artifacts table

## Migration

```sql
ALTER TABLE artifacts
    ADD COLUMN IF NOT EXISTS checksum_sha256 CHAR(64);

UPDATE artifacts
   SET checksum_sha256 = encode(digest(payload, 'sha256'), 'hex')
 WHERE checksum_sha256 IS NULL;

ALTER TABLE artifacts
    ALTER COLUMN checksum_sha256 SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_artifacts_checksum
    ON artifacts (checksum_sha256);
```

Backfills the digest for existing rows before tightening the constraint, so
the migration is safe to run against a populated production table.
