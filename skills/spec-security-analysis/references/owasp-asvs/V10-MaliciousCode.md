# V10 - Malicious Code

**Area**: Malicious Code Verification  
**Focus**: Protection against malware and malicious logic

## When to Apply

**V10 is a general requirement.** Apply when:
- Reviewing third-party code
- Auditing for backdoors
- Implementing integrity checks
- Managing software supply chain

## Requirements

| Req | Name | Description | L1 | L2 | L3 |
|-----|------|-------------|----|----|-----|
| 10.1.1 | Code Integrity | Source code integrity verified | | ✓ | ✓ |
| 10.2.1 | Anti-Malware | No malicious functionality | ✓ | ✓ | ✓ |
| 10.2.2 | Time Bombs | No time-based malicious triggers | ✓ | ✓ | ✓ |
| 10.2.3 | Backdoors | No hidden backdoors | ✓ | ✓ | ✓ |
| 10.3.1 | Unverified Code | No loading of unverified code | ✓ | ✓ | ✓ |

## Mapping Guidance

```
NFR-001 (Supply Chain) → 10.1.1
NFR-002 (Code Review) → 10.2.1, 10.2.2, 10.2.3
NFR-003 (Dynamic Loading) → 10.3.1
```

> [!NOTE]
> This area often maps to organizational controls rather than specific FRs.
