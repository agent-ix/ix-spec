---
id: SECRET-001
title: "Atlas OIDC client secret"
artifact_type: secret
---
<!-- secret authoring skeleton (spec-objects-security). Fill every part with
     substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type: secret).
     - A "Rotation" section MUST describe how and how often the secret rotates. -->
# [SECRET-001] Atlas OIDC client secret

Confidential client secret used by the Atlas backend to authenticate at the
tenant IdP token endpoint during the authorization code exchange. Stored in
Vault at `secret/atlas/oidc/client-secret`; never present in environment files
or images.

## Rotation

- Rotated every 90 days by the `secret-rotator` job, which registers a new
  secret with the IdP before revoking the old one.
- Dual-secret overlap window of 24 hours so in-flight token exchanges complete
  against either value.
- Emergency rotation is triggered manually via `atlasctl secrets rotate
  oidc-client` and completes in under 5 minutes.
- Every rotation emits an `secret.rotated` audit event (AUDIT-001 family).
