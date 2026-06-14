---
id: BOUND-001
title: "Edge to auth-service trust boundary"
artifact_type: trust_boundary
---
<!-- trust_boundary authoring skeleton (spec-objects-security). Fill every part
     with substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type:
       trust_boundary).
     - A "Boundary" section MUST carry a ```mermaid code block drawing the
       boundary between zones. -->
# [BOUND-001] Edge to auth-service trust boundary

Separates the untrusted internet, the DMZ-hosted API gateway, and the trusted
private subnet where the Atlas auth service and session store run. Everything
crossing inward is re-authenticated: the gateway terminates TLS and the auth
service only accepts mTLS connections from the gateway.

## Boundary

```mermaid
flowchart LR
    Browser["Tenant browser (untrusted)"] -->|HTTPS| Gateway["API gateway (DMZ)"]
    Gateway -->|mTLS| AuthSvc["Auth service (trusted subnet)"]
    AuthSvc -->|private VPC peering| SessionDB[("Session store")]
```
