---
id: ROLE-001
title: "Tenant Auditor role"
artifact_type: role
---
<!-- role authoring skeleton (spec-objects-security). Fill every part with
     substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type: role).
     - A "Permissions" section MUST list the permissions bound to the role. -->
# [ROLE-001] Tenant Auditor role

Read-only compliance role assigned to external auditors invited into a tenant.
Members can inspect configuration and audit trails but can never mutate state
or read secret material.

## Permissions

- PERM-001 — `document:read` within the tenant
- `audit_log:read` — query the tenant's audit event stream
- `policy:read` — view security policies in effect for the tenant
- `member:list` — enumerate tenant members and their role bindings
