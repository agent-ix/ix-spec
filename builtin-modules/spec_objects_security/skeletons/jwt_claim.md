---
id: CLAIM-001
title: "tenant_id access-token claim"
artifact_type: jwt_claim
---
<!-- jwt_claim authoring skeleton (spec-objects-security). Fill every part with
     substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type:
       jwt_claim).
     - A "Schema" section MUST carry a ```json code block with the claim's
       JSON Schema. -->
# [CLAIM-001] tenant_id access-token claim

Custom claim stamped into every Atlas access token at issuance. The policy
engine uses it for row-level tenant isolation (see PERM-001); tokens without a
valid `tenant_id` are rejected at the gateway before reaching any service.

## Schema

```json
{
  "title": "tenant_id",
  "type": "string",
  "format": "uuid",
  "description": "UUID of the tenant the subject is acting within; immutable for the token lifetime"
}
```
