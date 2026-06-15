# V11 - Business Logic

**Area**: Business Logic Verification  
**Focus**: Application-specific security logic

## When to Apply

**V11 is for complex workflows.** Apply when your component:
- Implements financial transactions
- Has multi-step workflows
- Enforces business rules
- Manages quotas or limits

## Requirements

| Req | Name | Description | L1 | L2 | L3 |
|-----|------|-------------|----|----|-----|
| 11.1.1 | Sequential Processing | Multi-step processes in correct order | ✓ | ✓ | ✓ |
| 11.1.2 | Business Limits | Business logic limits enforced | ✓ | ✓ | ✓ |
| 11.1.3 | Anti-Automation | Business-critical functions protected | ✓ | ✓ | ✓ |
| 11.1.4 | Unusual Activity | Detection of unusual activity | | ✓ | ✓ |
| 11.1.5 | Race Conditions | Race conditions prevented | ✓ | ✓ | ✓ |

## Mapping Guidance

```
FR-001 (Workflow) → 11.1.1
FR-002 (Limits) → 11.1.2
FR-003 (Rate Limiting) → 11.1.3
NFR-001 (Concurrency) → 11.1.5
NFR-002 (Monitoring) → 11.1.4
```
