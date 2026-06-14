---
id: RISK-001
title: "Tenant account takeover via token theft"
artifact_type: risk
likelihood: medium
impact: high
---
<!-- risk authoring skeleton (spec-objects-security). Fill every part with
     substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type: risk),
       likelihood and impact (qualitative ratings driving the risk score). -->
# [RISK-001] Tenant account takeover via token theft

Business risk that an attacker realizes THREAT-001 and operates inside a
tenant with the victim's permissions, exposing Confidential PII (CLASS-001)
and enabling data exfiltration through the public API. Likelihood is rated
medium given commodity infostealer malware; impact is high because a single
takeover crosses into regulated personal data. Primary treatment is CTRL-001;
residual risk after rotation and reuse detection is accepted at low/high and
reviewed quarterly by the security council.
