# V4 - Access Control

**Area**: Access Control Verification  
**Focus**: Authorization and privilege management

## When to Apply

**V4 is PRIMARY for authorization.** Apply when your component:
- Controls access to resources
- Implements RBAC or ABAC
- Has admin functionality
- Protects sensitive operations

## Requirements

| Req | Name | Description | L1 | L2 | L3 |
|-----|------|-------------|----|----|-----|
| 4.1.1 | Access Control Model | Application enforces access control at a trusted service layer | ✓ | ✓ | ✓ |
| 4.1.2 | Access Enforcement | All access control decisions logged | | ✓ | ✓ |
| 4.1.3 | Least Privilege | Principle of least privilege enforced | ✓ | ✓ | ✓ |
| 4.1.4 | Deny by Default | Access denied by default | ✓ | ✓ | ✓ |
| 4.1.5 | Attribute-Based Access | Support for attribute/feature-based access | | ✓ | ✓ |
| 4.2.1 | Sensitive Data Access | Sensitive data access limited | ✓ | ✓ | ✓ |
| 4.2.2 | Attribute Access | Protected attributes require authorization | ✓ | ✓ | ✓ |
| 4.3.1 | Administrative Functions | Admin functions protected | ✓ | ✓ | ✓ |
| 4.3.2 | Directory Access | Directory traversal prevented | ✓ | ✓ | ✓ |
| 4.3.3 | File Access | File access authorization enforced | ✓ | ✓ | ✓ |

## Mapping Guidance

```
FR-001 (Permission Check) → 4.1.1, 4.1.3, 4.1.4
FR-002 (Enforcement) → 4.1.1
FR-005 (Resource-Level) → 4.2.1, 4.2.2
FR-008 (RBAC) → 4.1.1, 4.1.3
FR-009 (ABAC) → 4.1.5
FR-010 (Admin) → 4.3.1
NFR-002 (Fail-Safe) → 4.1.4
```
