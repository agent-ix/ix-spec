# V9 - Communication

**Area**: Communication Verification  
**Focus**: Network and transport layer security

## When to Apply

**V9 is PRIMARY for network apps.** Apply when your component:
- Communicates over networks
- Uses TLS/SSL
- Connects to external services
- Handles WebSocket or real-time connections

## Requirements

| Req | Name | Description | L1 | L2 | L3 |
|-----|------|-------------|----|----|-----|
| 9.1.1 | TLS Required | TLS used for all connections | ✓ | ✓ | ✓ |
| 9.1.2 | TLS Version | TLS 1.2 or higher only | ✓ | ✓ | ✓ |
| 9.1.3 | Certificate Validation | Server certificates validated | ✓ | ✓ | ✓ |
| 9.2.1 | HSTS | HTTP Strict Transport Security enabled | ✓ | ✓ | ✓ |
| 9.2.2 | Certificate Pinning | Pinning for mobile/critical apps | | | ✓ |
| 9.3.1 | Backend TLS | TLS for all backend connections | ✓ | ✓ | ✓ |

## Mapping Guidance

```
FR-001 (TLS) → 9.1.1, 9.1.2
FR-002 (Certificate) → 9.1.3
NFR-001 (HSTS) → 9.2.1
NFR-002 (Internal TLS) → 9.3.1
```
