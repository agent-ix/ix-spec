# CC7 - System Operations

**Category**: Common Criteria  
**Focus**: Detection, response, and recovery

## When to Apply

Apply CC7 when your component:
- Runs in production
- Produces security-relevant events
- Has incident response requirements
- Is critical to service availability

## Controls

| Control | Name | Description | Software Relevance |
|---------|------|-------------|-------------------|
| CC7.1 | Security Monitoring | Entity detects configuration changes and security events | **HIGH** - Config audit |
| CC7.2 | Event Monitoring | Entity monitors for security incidents and anomalies | **HIGH** - Audit logging |
| CC7.3 | Incident Response | Entity responds to, remediates, and recovers from incidents | MEDIUM - Error handling |
| CC7.4 | Business Continuity | Entity implements business continuity plans | LOW - Infrastructure |
| CC7.5 | Disaster Recovery | Entity recovers systems and data | LOW - Infrastructure |

## Mapping Guidance

### High-Priority Mappings

| Control | Typical FR/NFR |
|---------|----------------|
| CC7.1 | FR-XXX (configuration audit), NFR-XXX (change detection) |
| CC7.2 | FR-XXX (audit logging), FR-XXX (security events) |
| CC7.3 | NFR-XXX (error handling), NFR-XXX (graceful degradation) |

### Typically Infrastructure

- CC7.4 (Business Continuity) → Platform team
- CC7.5 (Disaster Recovery) → Platform team

However, software components should support:
- Graceful shutdown
- State recovery
- Idempotent operations
