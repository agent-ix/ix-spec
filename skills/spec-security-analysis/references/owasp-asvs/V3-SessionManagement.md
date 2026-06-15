# V3 - Session Management

**Area**: Session Management Verification  
**Focus**: Session lifecycle and token security

## When to Apply

**V3 is PRIMARY for stateful apps.** Apply when your component:
- Creates or manages sessions
- Issues JWT or session tokens
- Handles logout/session termination
- Implements remember-me functionality

## Requirements

| Req | Name | Description | L1 | L2 | L3 |
|-----|------|-------------|----|----|-----|
| 3.1.1 | Session Security | Sessions use secure random tokens | ✓ | ✓ | ✓ |
| 3.2.1 | Session Binding | Sessions bound to user identity | ✓ | ✓ | ✓ |
| 3.2.2 | Session Invalidation | Sessions invalidated on logout | ✓ | ✓ | ✓ |
| 3.2.3 | Session Timeout | Inactivity timeout enforced | ✓ | ✓ | ✓ |
| 3.3.1 | Token Refresh | Secure token refresh mechanism | ✓ | ✓ | ✓ |
| 3.4.1 | Cookie Security | HttpOnly and Secure flags set | ✓ | ✓ | ✓ |
| 3.4.2 | Cookie Prefix | __Host- or __Secure- prefixes used | | ✓ | ✓ |
| 3.5.1 | JWT Validation | JWT signature and claims verified | ✓ | ✓ | ✓ |

## Mapping Guidance

```
FR-001 (Session Creation) → 3.1.1, 3.2.1
FR-002 (Logout) → 3.2.2
FR-003 (Timeout) → 3.2.3
FR-004 (Token Refresh) → 3.3.1
NFR-001 (Cookie Security) → 3.4.1, 3.4.2
```
