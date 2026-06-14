---
id: PASSPOL-001
title: "Atlas local-account password policy"
artifact_type: password_policy
---
<!-- password_policy authoring skeleton (spec-objects-security). Fill every part
     with substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type:
       password_policy).
     - A "Rules" section MUST enumerate the enforced password rules. -->
# [PASSPOL-001] Atlas local-account password policy

Applies to break-glass local accounts only; regular tenant users authenticate
through their IdP (AUTHFLOW-001). Aligned with NIST SP 800-63B: length over
composition, breach screening over forced rotation.

## Rules

- Minimum length 12 characters, maximum 128; all printable Unicode accepted
- Candidate passwords are checked against the haveibeenpwned k-anonymity API
  and rejected when previously breached
- No mandatory periodic rotation; rotation is forced only on suspected
  compromise
- Hashing: argon2id with memory 64 MiB, iterations 3, parallelism 4
- Rate limiting: 10 failed attempts per account per 15 minutes, then lockout
  with audit event emission
