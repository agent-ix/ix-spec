# V6 - Cryptography

**Area**: Cryptographic Verification  
**Focus**: Cryptographic implementation and key management

## When to Apply

**V6 is PRIMARY for encryption.** Apply when your component:
- Encrypts data at rest or in transit
- Generates or manages cryptographic keys
- Uses digital signatures
- Implements hashing for security purposes

## Requirements

| Req | Name | Description | L1 | L2 | L3 |
|-----|------|-------------|----|----|-----|
| 6.1.1 | Key Management | Secrets managed securely | ✓ | ✓ | ✓ |
| 6.1.2 | Key Rotation | Key rotation procedures exist | | ✓ | ✓ |
| 6.2.1 | Approved Algorithms | Only approved algorithms used | ✓ | ✓ | ✓ |
| 6.2.2 | Key Length | Adequate key lengths (≥2048 RSA, ≥256 EC) | ✓ | ✓ | ✓ |
| 6.2.3 | Random Generation | Cryptographically secure random | ✓ | ✓ | ✓ |
| 6.3.1 | Initialization Vectors | Unique IVs/nonces per operation | ✓ | ✓ | ✓ |
| 6.4.1 | Key Storage | Keys stored separately from data | ✓ | ✓ | ✓ |

## Mapping Guidance

```
FR-001 (Encryption) → 6.2.1, 6.2.2
FR-002 (Key Management) → 6.1.1, 6.1.2
FR-003 (Secure Random) → 6.2.3
NFR-001 (Algorithm Standards) → 6.2.1
NFR-002 (Key Protection) → 6.4.1
```
