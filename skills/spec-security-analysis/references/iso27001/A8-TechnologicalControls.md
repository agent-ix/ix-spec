# A.8 - Technological Controls

**Theme**: Technological  
**Controls**: 34  
**Focus**: Technical security controls for systems and development

## When to Apply

**A.8 is the PRIMARY theme for software components.** Most software FRs and NFRs map here.

## Controls

| Control | Name | Description | Software Relevance |
|---------|------|-------------|-------------------|
| A.8.1 | User Endpoint Devices | Endpoint security | MEDIUM - Client SDKs |
| A.8.2 | Privileged Access Rights | Privileged access management | **HIGH** - Admin roles |
| A.8.3 | Information Access Restriction | Access restriction | **HIGH** - Authorization |
| A.8.4 | Access to Source Code | Source code access | MEDIUM - SCM policy |
| A.8.5 | Secure Authentication | Authentication mechanisms | **HIGH** - Auth |
| A.8.6 | Capacity Management | Capacity monitoring | MEDIUM - Scaling |
| A.8.7 | Protection Against Malware | Malware protection | MEDIUM - Input validation |
| A.8.8 | Management of Technical Vulnerabilities | Vulnerability management | **HIGH** - Patching, deps |
| A.8.9 | Configuration Management | Secure configuration | **HIGH** - Config mgmt |
| A.8.10 | Information Deletion | Secure deletion | **HIGH** - Data lifecycle |
| A.8.11 | Data Masking | Data masking | **HIGH** - PII masking |
| A.8.12 | Data Leakage Prevention | DLP | **HIGH** - Output filtering |
| A.8.13 | Information Backup | Backup procedures | MEDIUM - Recovery |
| A.8.14 | Redundancy of Information Processing Facilities | Redundancy | MEDIUM - HA |
| A.8.15 | Logging | Security logging | **HIGH** - Audit logs |
| A.8.16 | Monitoring Activities | Security monitoring | **HIGH** - Observability |
| A.8.17 | Clock Synchronization | Time sync | MEDIUM - NTP |
| A.8.18 | Use of Privileged Utility Programs | Privileged utilities | LOW - Admin tools |
| A.8.19 | Installation of Software on Operational Systems | Software installation | LOW - Deployment |
| A.8.20 | Networks Security | Network security | MEDIUM - Network config |
| A.8.21 | Security of Network Services | Network service security | MEDIUM - Service mesh |
| A.8.22 | Segregation of Networks | Network segregation | MEDIUM - Network policy |
| A.8.23 | Web Filtering | Web access control | LOW - Proxy |
| A.8.24 | Use of Cryptography | Cryptographic controls | **HIGH** - Encryption |
| A.8.25 | Secure Development Life Cycle | Secure SDLC | **HIGH** - Dev process |
| A.8.26 | Application Security Requirements | Security requirements | **HIGH** - FR/NFR |
| A.8.27 | Secure System Architecture and Engineering Principles | Secure architecture | **HIGH** - Design |
| A.8.28 | Secure Coding | Secure coding practices | **HIGH** - Code quality |
| A.8.29 | Security Testing in Development and Acceptance | Security testing | **HIGH** - Testing |
| A.8.30 | Outsourced Development | Vendor development | MEDIUM - Third-party |
| A.8.31 | Separation of Development, Test and Production Environments | Environment separation | **HIGH** - Env isolation |
| A.8.32 | Change Management | Change control | **HIGH** - Version control |
| A.8.33 | Test Information | Test data protection | MEDIUM - Test data |
| A.8.34 | Protection of Information Systems During Audit Testing | Audit protection | LOW - Audit |

## Mapping Guidance

### Access Control Cluster (A.8.2-5)
- Map to: FR for authentication, authorization, role management
- Example: FR-001 (Permission Check) → A.8.3, A.8.5

### Data Protection Cluster (A.8.10-12, A.8.24)
- Map to: FR/NFR for data handling, encryption, masking
- Example: NFR-002 (Encryption) → A.8.24

### Logging/Monitoring Cluster (A.8.15-16)
- Map to: FR for audit logging, NFR for observability
- Example: FR-013 (Audit Logging) → A.8.15, A.8.16

### Development Cluster (A.8.25-32)
- Map to: NFR for SDLC, testing, deployment
- Example: NFR-001 (Verification) → A.8.29
