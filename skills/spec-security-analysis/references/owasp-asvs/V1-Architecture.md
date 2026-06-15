# V1 - Architecture

**Area**: Architecture Verification  
**Focus**: Security architecture requirements

## When to Apply

**V1 is foundational.** Apply when:
- Designing new components or systems
- Performing threat modeling
- Establishing security requirements
- Documenting trust boundaries

## Requirements

| Req | Name | Description | L1 | L2 | L3 |
|-----|------|-------------|----|----|-----|
| 1.1.1 | Secure SDLC | Secure development lifecycle in place | | ✓ | ✓ |
| 1.1.2 | Threat Modeling | Threat modeling performed | | ✓ | ✓ |
| 1.1.3 | Component Security | Security of each component documented | | ✓ | ✓ |
| 1.2.1 | Trust Boundaries | Trust boundaries identified | | ✓ | ✓ |
| 1.2.2 | Input Validation | Centralized input validation approach | ✓ | ✓ | ✓ |
| 1.2.3 | Output Encoding | Centralized output encoding approach | ✓ | ✓ | ✓ |
| 1.4.1 | Cryptography | Cryptographic design documented | | ✓ | ✓ |

## Mapping Guidance

```
NFR-001 (Security Architecture) → 1.1.1, 1.1.3
NFR-002 (Threat Model) → 1.1.2
NFR-003 (Input Validation) → 1.2.2
NFR-004 (Output Encoding) → 1.2.3
```
