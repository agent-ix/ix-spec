---
id: CTRL-001
title: "Refresh token rotation with reuse detection"
artifact_type: control
---
<!-- control authoring skeleton (spec-objects-security). Fill every part with
     substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type: control).
     - A "Mappings" section MUST map the control to threats, risks and
       standards it addresses. -->
# [CTRL-001] Refresh token rotation with reuse detection

Every refresh-token exchange invalidates the presented token and issues a new
one bound to the same grant family. Presenting an already-rotated token marks
the whole family compromised: all descendants are revoked, the session is
terminated, and a `token.reuse.detected` audit event fires.

## Mappings

- Mitigates THREAT-001 (stolen refresh token replay)
- Reduces RISK-001 likelihood from medium to low
- Implements OAuth 2.0 Security BCP (RFC 9700) refresh-token rotation guidance
- Maps to OWASP ASVS v4 §3.5.2 and NIST SP 800-63B §7.1 session binding
- Verified by integration test IT-001 (manifest activation roundtrip suite)
