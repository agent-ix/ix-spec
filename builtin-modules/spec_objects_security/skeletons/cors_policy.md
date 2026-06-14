---
id: CORS-001
title: "Atlas public API CORS policy"
artifact_type: cors_policy
---
<!-- cors_policy authoring skeleton (spec-objects-security). Fill every part
     with substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type:
       cors_policy).
     - An "Origins" section MUST enumerate the allowed origins and rules. -->
# [CORS-001] Atlas public API CORS policy

Browser cross-origin policy enforced by the API gateway for `api.atlas.example`.
Credentials are only honored for first-party app origins; integration origins
get token-based access without cookies.

## Origins

- `https://app.atlas.example` — first-party web client; credentials allowed
- `https://admin.atlas.example` — operator console; credentials allowed
- `https://*.integrations.atlas.example` — sandboxed integration iframes;
  credentials disallowed, `Authorization` header only
- All other origins are denied; no wildcard `*` is ever emitted, and preflight
  responses are capped at `Access-Control-Max-Age: 600`
