---
id: AUDIT-001
title: "user.login.succeeded audit event"
artifact_type: audit_event
---
<!-- audit_event authoring skeleton (spec-objects-security). Fill every part
     with substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type:
       audit_event).
     - An "Event Schema" section MUST carry a ```json code block with the
       event's payload schema. -->
# [AUDIT-001] user.login.succeeded audit event

Emitted by the auth service when AUTHFLOW-001 completes and a session is
established. Appended to the tenant's immutable audit stream and queryable by
ROLE-001 (Tenant Auditor) holders.

## Event Schema

```json
{
  "type": "object",
  "required": ["event", "occurred_at", "tenant_id", "user_id", "source_ip"],
  "properties": {
    "event": { "const": "user.login.succeeded" },
    "occurred_at": { "type": "string", "format": "date-time" },
    "tenant_id": { "type": "string", "format": "uuid" },
    "user_id": { "type": "string", "format": "uuid" },
    "source_ip": { "type": "string" },
    "idp_issuer": { "type": "string", "format": "uri" },
    "mfa_method": { "type": "string", "enum": ["totp", "webauthn", "none"] }
  }
}
```
