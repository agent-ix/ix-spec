# IA - Identification and Authentication

**Family**: Identification and Authentication  
**Controls**: 12  
**Focus**: Identity management and authentication

## When to Apply

**IA is PRIMARY for auth components.** Apply when your component:
- Authenticates users or services
- Manages identities
- Issues or validates credentials

## Controls

| Control | Name | Description | Software Relevance |
|---------|------|-------------|-------------------|
| IA-1 | Policy and Procedures | Document IA policies | LOW - Docs |
| IA-2 | Identification and Authentication (Org Users) | Authenticate users | **HIGH** - Auth |
| IA-3 | Device Identification and Authentication | Authenticate devices | MEDIUM - Device auth |
| IA-4 | Identifier Management | Manage identifiers | **HIGH** - Identity |
| IA-5 | Authenticator Management | Manage authenticators | **HIGH** - Credentials |
| IA-6 | Authentication Feedback | Obscure feedback | **HIGH** - UX security |
| IA-7 | Cryptographic Module Authentication | Crypto auth | MEDIUM - HSM |
| IA-8 | Identification and Authentication (Non-Org Users) | External users | **HIGH** - External auth |
| IA-9 | Service Identification and Authentication | Service-to-service | **HIGH** - mTLS |
| IA-10 | Adaptive Authentication | Risk-based auth | MEDIUM - MFA |
| IA-11 | Re-authentication | Force re-auth | **HIGH** - Sensitive ops |
| IA-12 | Identity Proofing | Verify identity | MEDIUM - Onboarding |

## Mapping Guidance

### Core Auth (IA-2, IA-4, IA-5, IA-8)
```
FR-XXX (Authentication) → IA-2, IA-8
FR-XXX (Identity Management) → IA-4
FR-XXX (Credential Management) → IA-5
```

### Service Auth (IA-9)
```
FR-XXX (Service Auth) → IA-9
NFR-XXX (mTLS) → IA-9
```
