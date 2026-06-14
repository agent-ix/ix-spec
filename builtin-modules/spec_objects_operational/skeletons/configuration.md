---
id: CFG-001
title: "Artifact-store service configuration"
artifact_type: configuration
---
<!-- configuration authoring skeleton (spec-objects-operational). Fill every
     section with substantive content. Contract (manifest body_extraction):
     - Frontmatter MUST carry id, title, and artifact_type: configuration.
     - "## Configuration" (H2) is REQUIRED: a table with headers exactly
       Name | Scope | Type | Default | Description and at least one data
       row. Scope carries the semantic as data:
         creation — fixed when the instance/object is created (reloptions,
                    deploy values); changing it means rebuild/redeploy.
         runtime  — tunable on a running system (GUCs, admin toggles).
         session  — per-session/per-request overrides.
       Scope values are checked by the `configuration-scope` lint rule
       (`quire lint`).
     - "## Behavior" (H2, optional): load/reload semantics, validation,
       precedence rules.
     - Keep headings unique per level; never leave a section empty. -->
# [CFG-001] Artifact-store service configuration

## Configuration

| Name | Scope | Type | Default | Description |
|------|-------|------|---------|-------------|
| storage_root | creation | string | /var/lib/artifact-store | Filesystem root for blob storage |
| max_upload_size_mb | runtime | integer | 512 | Reject uploads larger than this size |
| checksum_algorithm | creation | string | sha256 | Digest algorithm used to verify imports |
| retention_days | runtime | integer | 90 | Days before unreferenced blobs are pruned |
| log_level | session | string | info | Per-connection log verbosity override |

## Behavior

The service loads its configuration once at startup and re-reads it on
`SIGHUP`. A reload that fails validation is rejected atomically: the previous
configuration stays active and the failure is logged at `error` with the
offending parameter name. Changing any `creation`-scoped value requires a
full restart because open blob handles cannot be migrated in place.
