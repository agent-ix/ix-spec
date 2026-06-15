# CC4 - Monitoring Activities

**Category**: Common Criteria  
**Focus**: Ongoing evaluation and deficiency communication

## When to Apply

Apply CC4 when your component:
- Runs in production
- Has security controls that need verification
- Produces observable outputs (logs, metrics)

## Controls

| Control | Name | Description |
|---------|------|-------------|
| CC4.1 | Ongoing Evaluation | Entity selects, develops, and performs ongoing and/or separate evaluations |
| CC4.2 | Deficiency Response | Entity evaluates and communicates internal control deficiencies timely |

## Mapping Guidance

For software components:
- **Health checks** → CC4.1
- **Automated testing in CI/CD** → CC4.1
- **Alerting on failures** → CC4.2
- **Security scanning** → CC4.1
- **Error rate monitoring** → CC4.1, CC4.2
