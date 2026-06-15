# SOC 2 Trust Services Criteria

**Version**: 2017 TSC  
**Scope**: Service organization controls  
**Region**: Global (primarily US-focused)

## When to Apply

Apply SOC 2 when your component:
- Provides services to other businesses (B2B)
- Handles customer data on behalf of others
- Is part of a service organization's control environment
- Needs to demonstrate security controls to customers/auditors

## Category Selection Guide

**Use this to decide which category to investigate:**

| If your component... | Read Category |
|---------------------|---------------|
| Implements authentication | [CC6-LogicalPhysicalAccess](CC6-LogicalPhysicalAccess.md) |
| Implements authorization/RBAC/ABAC | [CC6-LogicalPhysicalAccess](CC6-LogicalPhysicalAccess.md) |
| Uses encryption or TLS | [CC6-LogicalPhysicalAccess](CC6-LogicalPhysicalAccess.md) |
| Produces audit logs or metrics | [CC7-SystemOperations](CC7-SystemOperations.md) |
| Has configuration changes | [CC8-ChangeManagement](CC8-ChangeManagement.md) |
| Uses third-party dependencies | [CC9-RiskMitigation](CC9-RiskMitigation.md) |
| Communicates with external systems | [CC2-CommunicationInformation](CC2-CommunicationInformation.md) |

## Criteria Categories

| Category | Primary For | Skip If |
|----------|-------------|---------|
| [CC1-ControlEnvironment](CC1-ControlEnvironment.md) | Governance | Always organizational |
| [CC2-CommunicationInformation](CC2-CommunicationInformation.md) | External APIs, docs | Internal-only |
| [CC3-RiskAssessment](CC3-RiskAssessment.md) | Threat modeling | Already documented |
| [CC4-MonitoringActivities](CC4-MonitoringActivities.md) | Health checks | Pre-production only |
| [CC5-ControlActivities](CC5-ControlActivities.md) | Control implementation | Covered in CC6 |
| [CC6-LogicalPhysicalAccess](CC6-LogicalPhysicalAccess.md) | **Auth, authz, crypto** | No access control |
| [CC7-SystemOperations](CC7-SystemOperations.md) | Logging, monitoring | No security events |
| [CC8-ChangeManagement](CC8-ChangeManagement.md) | Version control, CI/CD | All software |
| [CC9-RiskMitigation](CC9-RiskMitigation.md) | Dependencies, vendors | No external deps |

## Quick Reference

**Most software components**: Focus on CC6, CC7, CC8
**Physical controls (CC6.4-6.5)**: Assign to Infrastructure
