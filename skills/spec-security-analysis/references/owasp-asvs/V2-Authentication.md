# V2 - Authentication

**Area**: Authentication Verification  
**Focus**: Identity verification and credential management

## When to Apply

**V2 is PRIMARY for authentication.** Apply when your component:
- Handles user login/logout
- Manages passwords or credentials
- Implements MFA
- Issues or validates tokens

## Requirements

| Req | Name | Description | L1 | L2 | L3 |
|-----|------|-------------|----|----|-----|
| 2.1.1 | Password Length | Minimum 12 characters enforced | ✓ | ✓ | ✓ |
| 2.1.2 | Password Complexity | No arbitrary complexity rules | ✓ | ✓ | ✓ |
| 2.1.3 | Credential Storage | Passwords hashed with approved algorithms | ✓ | ✓ | ✓ |
| 2.1.4 | Breached Passwords | Check against known breached passwords | | ✓ | ✓ |
| 2.2.1 | Anti-Automation | Rate limiting on auth endpoints | ✓ | ✓ | ✓ |
| 2.2.2 | Brute Force | Account lockout/delay mechanisms | ✓ | ✓ | ✓ |
| 2.4.1 | Credential Recovery | Secure password reset | ✓ | ✓ | ✓ |
| 2.5.1 | MFA | Multi-factor authentication available | | ✓ | ✓ |
| 2.7.1 | OTP Security | One-time passwords have limited lifetime | ✓ | ✓ | ✓ |

## Mapping Guidance

```
FR-001 (Login) → 2.1.1, 2.1.2, 2.2.1
FR-002 (Password Storage) → 2.1.3
FR-003 (MFA) → 2.5.1
FR-004 (Password Reset) → 2.4.1
NFR-001 (Rate Limiting) → 2.2.1, 2.2.2
```
