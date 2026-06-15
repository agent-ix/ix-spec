# A.5 - Organizational Controls

**Theme**: Organizational  
**Controls**: 37  
**Focus**: Policies, roles, asset management, supplier relations, incident management

## When to Apply

A.5 controls are organizational-level but many have direct software implications:
- Information classification affects data handling
- Supplier controls affect dependency management
- Incident management affects logging and response

## Controls

| Control | Name | Description | Software Relevance |
|---------|------|-------------|-------------------|
| A.5.1 | Policies for Information Security | Management-approved policies | LOW - Policy docs |
| A.5.2 | Information Security Roles | Define security responsibilities | LOW - Organizational |
| A.5.3 | Segregation of Duties | Separate conflicting duties | **HIGH** - RBAC |
| A.5.4 | Management Responsibilities | Require security compliance | LOW - Organizational |
| A.5.5 | Contact with Authorities | Maintain authority contacts | LOW - Organizational |
| A.5.6 | Contact with Special Interest Groups | Security group contacts | LOW - Organizational |
| A.5.7 | Threat Intelligence | Collect threat intelligence | MEDIUM - Vuln scanning |
| A.5.8 | Security in Project Management | Integrate security in projects | MEDIUM - SDLC |
| A.5.9 | Inventory of Information Assets | Maintain asset inventory | MEDIUM - SBOM |
| A.5.10 | Acceptable Use of Information Assets | Define acceptable use | LOW - Policy |
| A.5.11 | Return of Assets | Return on termination | LOW - HR process |
| A.5.12 | Classification of Information | Classify information | **HIGH** - Data classification |
| A.5.13 | Labeling of Information | Label per classification | MEDIUM - Metadata |
| A.5.14 | Information Transfer | Secure information transfer | **HIGH** - API security |
| A.5.15 | Access Control | Define access requirements | **HIGH** - Authz |
| A.5.16 | Identity Management | Manage identity lifecycle | **HIGH** - Identity |
| A.5.17 | Authentication Information | Manage credentials | **HIGH** - Secrets |
| A.5.18 | Access Rights | Assign per policy | **HIGH** - RBAC/ABAC |
| A.5.19 | Information Security in Supplier Relationships | Supplier security | MEDIUM - Dependencies |
| A.5.20 | Addressing Information Security Within Supplier Agreements | Security clauses | LOW - Contracts |
| A.5.21 | Managing Information Security in the ICT Supply Chain | Supply chain security | **HIGH** - SBOM, deps |
| A.5.22 | Monitoring, Review, and Change Management of Supplier Services | Monitor suppliers | LOW - Vendor mgmt |
| A.5.23 | Information Security for Use of Cloud Services | Cloud security | **HIGH** - Cloud config |
| A.5.24 | Information Security Incident Management Planning | Incident planning | MEDIUM - Response |
| A.5.25 | Assessment and Decision on Information Security Events | Event assessment | MEDIUM - Triage |
| A.5.26 | Response to Information Security Incidents | Incident response | MEDIUM - Response |
| A.5.27 | Learning from Information Security Incidents | Post-incident learning | LOW - Process |
| A.5.28 | Collection of Evidence | Evidence collection | **HIGH** - Audit logs |
| A.5.29 | Information Security During Disruption | Continuity security | MEDIUM - Graceful degradation |
| A.5.30 | ICT Readiness for Business Continuity | ICT continuity | MEDIUM - Recovery |
| A.5.31 | Legal, Statutory, Regulatory, and Contractual Requirements | Compliance | LOW - Legal |
| A.5.32 | Intellectual Property Rights | IP protection | LOW - Legal |
| A.5.33 | Protection of Records | Record protection | **HIGH** - Data retention |
| A.5.34 | Privacy and Protection of PII | PII protection | **HIGH** - Privacy |
| A.5.35 | Independent Review of Information Security | Security audits | LOW - Audit |
| A.5.36 | Compliance with Policies, Rules and Standards | Policy compliance | LOW - Audit |
| A.5.37 | Documented Operating Procedures | Document procedures | MEDIUM - Runbooks |

## Mapping Guidance

High-priority mappings for software:
- **A.5.3** (Segregation) → FR for role separation
- **A.5.12-18** (Access) → FR/NFR for auth/authz
- **A.5.21** (Supply Chain) → NFR for dependency management
- **A.5.23** (Cloud) → NFR for cloud security config
- **A.5.28** (Evidence) → FR for audit logging
- **A.5.33-34** (Records/PII) → FR/NFR for data protection
