---
id: SURF-001
title: "Atlas authentication attack surface"
artifact_type: attack_surface
---
<!-- attack_surface authoring skeleton (spec-objects-security). Fill every part
     with substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type:
       attack_surface).
     - An "Entry Points" section MUST enumerate the externally reachable
       entry points. -->
# [SURF-001] Atlas authentication attack surface

Internet-reachable surface of the Atlas authentication subsystem, reviewed
whenever a new route crosses BOUND-001 outward.

## Entry Points

- `GET /login`, `GET /callback` — browser OIDC endpoints (AUTHFLOW-001)
- `POST /api/token` — public API token exchange for integrations (SCOPE-001)
- `POST /auth/local` — break-glass local login, gated by PASSPOL-001 and
  MFA-001
- `POST /webhooks/idp` — IdP back-channel logout receiver, HMAC-verified
- Session cookie and `X-Atlas-CSRF` header parsing in the gateway middleware
  (CSRF-001), reachable from any authenticated page
