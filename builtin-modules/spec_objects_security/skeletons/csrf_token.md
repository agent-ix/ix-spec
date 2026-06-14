---
id: CSRF-001
title: "Atlas web CSRF token"
artifact_type: csrf_token
rotation_window: 30m
---
<!-- csrf_token authoring skeleton (spec-objects-security). Fill every part with
     substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type:
       csrf_token) and rotation_window (how often a fresh token is issued). -->
# [CSRF-001] Atlas web CSRF token

Double-submit CSRF token protecting all state-changing requests from the Atlas
web client. The server issues an HMAC-signed token bound to the session id
(SESSION-001); the client echoes it in the `X-Atlas-CSRF` header and the
middleware rejects any mutation where header and cookie values disagree. A
fresh token is minted every `30m` rotation window and on every login or
privilege elevation, with the previous token honored for one overlapping
window to avoid breaking in-flight forms.
