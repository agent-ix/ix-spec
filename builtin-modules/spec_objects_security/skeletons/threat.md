---
id: THREAT-001
title: "Stolen refresh token replay"
artifact_type: threat
stride_category: Spoofing
vector: "exfiltrated refresh token replayed from attacker infrastructure"
---
<!-- threat authoring skeleton (spec-objects-security). Fill every part with
     substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type: threat),
       stride_category (STRIDE class) and vector (the attack vector). -->
# [THREAT-001] Stolen refresh token replay

An attacker who exfiltrates a refresh token (malware on the user device, log
leakage, or proxy compromise) replays it against the token endpoint to mint
fresh access tokens and impersonate the user across tenant APIs. Detection is
hard because requests are well-formed; mitigation relies on refresh token
rotation with reuse detection (CTRL-001) and the trust boundary controls in
BOUND-001. Realized risk is tracked as RISK-001.
