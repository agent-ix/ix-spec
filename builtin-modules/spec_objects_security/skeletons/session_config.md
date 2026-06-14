---
id: SESSION-001
title: "Atlas web session configuration"
artifact_type: session_config
---
<!-- session_config authoring skeleton (spec-objects-security). Fill every part
     with substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type:
       session_config).
     - A "Settings" section MUST enumerate the effective session parameters. -->
# [SESSION-001] Atlas web session configuration

Server-side session established after AUTHFLOW-001 completes. Session state
lives in the session store (ASSET-001); the browser holds only an opaque
identifier.

## Settings

- Cookie name: `__Host-atlas_session` (Secure, HttpOnly, SameSite=Lax, Path=/)
- Idle timeout: 30 minutes, sliding on authenticated requests
- Absolute lifetime: 12 hours, after which re-authentication is required
- Session identifier: 256-bit random value, regenerated on login and on
  privilege elevation
- Concurrent session cap: 5 per user; the oldest session is evicted on overflow
