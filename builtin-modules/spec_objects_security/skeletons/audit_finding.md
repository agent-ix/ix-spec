---
id: FIND-001
title: "Session store reachable with eval privileges"
artifact_type: audit_finding
---
<!-- audit_finding authoring skeleton (spec-objects-security). Fill every part
     with substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type:
       audit_finding).
     - A "Recommendation" section MUST state the remediation recommendation. -->
# [FIND-001] Session store reachable with eval privileges

Q2 security audit finding: the auth service connects to the session store
(ASSET-001) with a credential that retains `EVAL`/`SCRIPT` privileges,
unnecessarily exposing the Lua sandbox surface of VULN-001 to any service
compromise. Severity high; affected component is the shared Redis ACL profile.

## Recommendation

Upgrade the session store to a release patched for CVE-2024-31449, then
replace the shared ACL profile with a least-privilege profile that removes
`EVAL`, `EVALSHA` and `SCRIPT` for application credentials. Verify with an
integration test that script commands are rejected, and re-scan the cluster.
Target closure within 30 days; interim compensating control is the mTLS
restriction at BOUND-001.
