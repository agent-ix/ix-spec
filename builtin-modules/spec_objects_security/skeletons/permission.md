---
id: PERM-001
title: "Read tenant documents"
artifact_type: permission
resource: document
verb: read
---
<!-- permission authoring skeleton (spec-objects-security). Fill every part with
     substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type: permission).
     - Frontmatter MUST carry resource and verb (the protected resource kind and
       the action this permission grants on it). -->
# [PERM-001] Read tenant documents

Grants read access to `document` resources within the caller's tenant. Checked
by the Atlas policy engine on every `GET /api/documents/*` request; the
permission is satisfied only when the resource's `tenant_id` matches the
caller's `tenant_id` claim.
