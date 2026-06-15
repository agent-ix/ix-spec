# V8 - Data Protection

**Area**: Data Protection Verification  
**Focus**: Sensitive data handling and privacy

## When to Apply

**V8 is PRIMARY for sensitive data.** Apply when your component:
- Handles PII or sensitive data
- Stores user credentials
- Processes financial information
- Manages health or legal data

## Requirements

| Req | Name | Description | L1 | L2 | L3 |
|-----|------|-------------|----|----|-----|
| 8.1.1 | Data Classification | Sensitive data identified and classified | ✓ | ✓ | ✓ |
| 8.1.2 | Data Minimization | Only necessary data collected | ✓ | ✓ | ✓ |
| 8.2.1 | Encryption at Rest | Sensitive data encrypted at rest | | ✓ | ✓ |
| 8.2.2 | Encryption in Transit | All data encrypted in transit | ✓ | ✓ | ✓ |
| 8.3.1 | Log Sanitization | Sensitive data excluded from logs | ✓ | ✓ | ✓ |
| 8.3.2 | Cache Protection | Sensitive data not cached insecurely | ✓ | ✓ | ✓ |
| 8.3.3 | Backup Security | Backups encrypted | | ✓ | ✓ |

## Mapping Guidance

```
FR-001 (Data Classification) → 8.1.1
FR-002 (Encryption) → 8.2.1, 8.2.2
FR-003 (Logging) → 8.3.1
NFR-001 (Privacy) → 8.1.2
NFR-002 (Data Retention) → 8.3.3
```
