---
id: AUTHFLOW-001
title: "Tenant user login via OIDC authorization code flow"
artifact_type: auth_flow
---
<!-- auth_flow authoring skeleton (spec-objects-security). Fill every part with
     substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type: auth_flow).
     - A "Flow" section MUST carry a ```mermaid code block describing the flow. -->
# [AUTHFLOW-001] Tenant user login via OIDC authorization code flow

Interactive browser login for Atlas tenant users. The platform delegates
authentication to the tenant's OIDC identity provider using the authorization
code flow with PKCE, then establishes a first-party session cookie.

## Flow

```mermaid
sequenceDiagram
    participant Browser
    participant AtlasApp
    participant IdP
    Browser->>AtlasApp: GET /login
    AtlasApp->>Browser: 302 to IdP authorize endpoint with PKCE challenge
    Browser->>IdP: GET /authorize with client_id and code_challenge
    IdP->>Browser: 302 back with authorization code
    Browser->>AtlasApp: GET /callback with code and state
    AtlasApp->>IdP: POST /token with code and code_verifier
    IdP->>AtlasApp: ID token plus access and refresh tokens
    AtlasApp->>Browser: Set __Host-atlas_session cookie and redirect
```
