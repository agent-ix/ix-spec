# AU - Audit and Accountability

**Family**: Audit and Accountability  
**Controls**: 16  
**Focus**: Logging, audit trails, accountability

## When to Apply

**AU is PRIMARY for audit logging.** Apply when your component:
- Generates security-relevant events
- Makes access control decisions
- Processes sensitive data
- Runs in production

## Controls

| Control | Name | Description | Software Relevance |
|---------|------|-------------|-------------------|
| AU-1 | Policy and Procedures | Document audit policies | LOW - Docs |
| AU-2 | Audit Events | Define auditable events | **HIGH** - Event list |
| AU-3 | Content of Audit Records | Required log content | **HIGH** - Log format |
| AU-4 | Audit Storage Capacity | Storage allocation | MEDIUM - Retention |
| AU-5 | Response to Audit Processing Failures | Handle failures | **HIGH** - Fail-safe |
| AU-6 | Audit Review, Analysis, and Reporting | Review/analyze logs | MEDIUM - Analysis |
| AU-7 | Audit Reduction and Report Generation | Log aggregation | MEDIUM - Tooling |
| AU-8 | Time Stamps | Reliable timestamps | **HIGH** - NTP |
| AU-9 | Protection of Audit Information | Protect logs | **HIGH** - Integrity |
| AU-10 | Non-repudiation | Prove actions occurred | **HIGH** - Evidence |
| AU-11 | Audit Record Retention | Retain logs | **HIGH** - Retention |
| AU-12 | Audit Generation | Generate audit records | **HIGH** - Logging |
| AU-13 | Monitoring for Information Disclosure | Monitor disclosure | MEDIUM - DLP |
| AU-14 | Session Audit | Audit sessions | MEDIUM - Session logs |
| AU-16 | Cross-Organizational Auditing | Cross-org audit | LOW - Federation |

## Mapping Guidance

### Core Audit (AU-2, AU-3, AU-12)
```
FR-013 (Audit Logging) → AU-2, AU-3, AU-12
FR-013-AC-1 (Log Content) → AU-3
FR-013-AC-2 (Log Generation) → AU-12
```

### Log Protection (AU-5, AU-9, AU-11)
```
NFR-XXX (Log Integrity) → AU-9
NFR-XXX (Retention) → AU-11
NFR-XXX (Fail-Safe Logging) → AU-5
```
