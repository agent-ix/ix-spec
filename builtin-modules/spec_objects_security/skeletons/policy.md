---
id: POL-001
title: "Access token lifetime policy"
artifact_type: policy
---
<!-- policy authoring skeleton (spec-objects-security). Fill every part with
     substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type: policy).
     - A "Policy" section MUST state the normative policy text. -->
# [POL-001] Access token lifetime policy

Platform-wide policy governing bearer token lifetimes for Atlas first-party
and integration clients, owned by the security council.

## Policy

- Access tokens SHALL expire no later than 15 minutes after issuance.
- Refresh tokens SHALL be single-use and rotated on every exchange (CTRL-001),
  with an absolute family lifetime of 30 days.
- Integration tokens issued for SCOPE-001 SHALL be bound to the requesting
  client via DPoP or mTLS sender constraint.
- Token lifetimes SHALL NOT be extended per tenant without a documented risk
  acceptance referencing the affected risk register entries (e.g. RISK-001).
- Violations surface as audit findings (FIND-001 family) and block release
  until remediated or formally accepted.
