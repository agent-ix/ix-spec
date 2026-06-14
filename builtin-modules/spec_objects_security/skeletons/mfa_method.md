---
id: MFA-001
title: "TOTP authenticator app"
artifact_type: mfa_method
kind: totp
factor: possession
---
<!-- mfa_method authoring skeleton (spec-objects-security). Fill every part with
     substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type:
       mfa_method) and kind (the method kind); factor names the auth factor
       class it provides. -->
# [MFA-001] TOTP authenticator app

Time-based one-time password second factor (RFC 6238) for Atlas operator and
break-glass accounts. Secrets are 160-bit, provisioned via QR code over an
authenticated session, and stored encrypted under KEY-001. Codes are 6 digits
on a 30-second step with one step of clock skew accepted; ten single-use
recovery codes are issued at enrollment for device-loss fallback.
