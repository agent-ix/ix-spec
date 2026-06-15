# V14 - Configuration

**Area**: Secure Configuration  
**Focus**: Build, deploy, and runtime configuration

## When to Apply

**V14 is PRIMARY for deployment.** Apply when your component:
- Has configuration files
- Exposes HTTP endpoints
- Uses dependencies
- Runs in production

## Requirements

| Req | Name | Description | L1 | L2 | L3 |
|-----|------|-------------|----|----|-----|
| 14.1.1 | Build Pipeline | Secure build process | ✓ | ✓ | ✓ |
| 14.1.2 | Dependency Integrity | Dependency verification | ✓ | ✓ | ✓ |
| 14.1.3 | Source Removed | Source/debug info removed | ✓ | ✓ | ✓ |
| 14.2.1 | Dependencies | Up-to-date dependencies | ✓ | ✓ | ✓ |
| 14.2.2 | Vulnerability Scanning | Dependency scanning | ✓ | ✓ | ✓ |
| 14.3.1 | No Sensitive Disclosure | No sensitive info in errors | ✓ | ✓ | ✓ |
| 14.3.2 | Debug Disabled | Debug features disabled | ✓ | ✓ | ✓ |
| 14.4.1 | Security Headers | Proper HTTP security headers | ✓ | ✓ | ✓ |
| 14.4.2 | Content-Security-Policy | CSP implemented | ✓ | ✓ | ✓ |
| 14.5.1 | Header Validation | Request header validation | ✓ | ✓ | ✓ |

## Mapping Guidance

```
NFR-XXX (Secure Build) → 14.1.1, 14.1.2, 14.1.3
NFR-XXX (Dependencies) → 14.2.1, 14.2.2
NFR-XXX (Security Headers) → 14.4.1, 14.4.2
```
