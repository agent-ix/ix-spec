# Chapter IV - Controller and Processor

**Articles**: 24-43  
**Focus**: Security obligations and accountability

## When to Read This Chapter

Read this chapter when your component:
- Processes personal data in any way
- Implements security controls
- Logs user actions
- Could be involved in a data breach
- Requires privacy impact assessment

**This is the PRIMARY chapter for most software components.**

## Key Articles

### Art. 25 - Data Protection by Design and Default

**Read this when**: Designing new features or data models

| Obligation | Description | Software Implementation |
|------------|-------------|------------------------|
| Art. 25(1) | Protection by design | Build privacy into architecture |
| Art. 25(2) | Protection by default | Minimize data collection by default |

**Map to**: NFR for privacy-by-design, FR for default settings

### Art. 30 - Records of Processing

**Read this when**: Documenting what data you process

| Obligation | Description | Software Implementation |
|------------|-------------|------------------------|
| Art. 30(1) | Maintain processing records | Document data flows |

**Map to**: Documentation requirements, data flow diagrams

### Art. 32 - Security of Processing

**Read this when**: Implementing any security control

| Obligation | Description | Software Implementation |
|------------|-------------|------------------------|
| Art. 32(1)(a) | Pseudonymization/Encryption | Encrypt PII |
| Art. 32(1)(b) | Confidentiality/Integrity | Access control, data integrity |
| Art. 32(1)(c) | Availability/Resilience | Recovery, failover |
| Art. 32(1)(d) | Testing/Evaluation | Security testing |
| Art. 32(4) | Authorized Processing | Access control enforcement |

**Map to**: 
- FR for access control → Art. 32(1)(b), 32(4)
- NFR for encryption → Art. 32(1)(a)
- NFR for testing → Art. 32(1)(d)
- NFR for availability → Art. 32(1)(c)

### Art. 33-34 - Breach Notification

**Read this when**: Implementing incident response

| Obligation | Description | Software Implementation |
|------------|-------------|------------------------|
| Art. 33 | Notify authority within 72 hours | Incident detection, alerting |
| Art. 34 | Notify data subjects | User notification capability |

**Map to**: FR/NFR for incident detection, alerting

### Art. 35 - Data Protection Impact Assessment

**Read this when**: High-risk processing (profiling, large-scale, sensitive data)

Usually organizational, but software should support DPIA requirements.

## Mapping Guidance

```
FR-001 (Permission Check) → Art. 32(1)(b), Art. 32(4)
FR-002 (Enforcement) → Art. 32(4)
FR-007 (Org Tenancy) → Art. 32(1)(b) (data isolation)
FR-013 (Audit) → Art. 32(1)(b), Art. 30
NFR-002 (Fail-Safe) → Art. 32(1)(c)
```
