---
id: CLASS-001
title: "Confidential — tenant PII"
artifact_type: data_classification
---
<!-- data_classification authoring skeleton (spec-objects-security). Fill every
     part with substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type:
       data_classification).
     - A "Handling" section MUST state the handling requirements for the class. -->
# [CLASS-001] Confidential — tenant PII

Classification applied to tenant member profile data (names, email addresses,
phone numbers) and any document flagged as containing personal data. Sits one
level below `Restricted` (secrets and key material) in the Atlas scheme.

## Handling

- Encrypted at rest with the tenant DEK (KEY-001) and in transit via TLS 1.3.
- Access requires an explicit permission grant; reads are recorded in the
  audit stream as `pii.accessed` events.
- Never written to application logs; log scrubbing rejects payloads matching
  the PII field allowlist.
- Exported only through the GDPR export pipeline, with tenant-admin approval.
- Retention: deleted within 30 days of tenant offboarding or subject request.
