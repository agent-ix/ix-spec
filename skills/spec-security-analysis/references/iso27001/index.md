# ISO/IEC 27001:2022 Annex A Controls

**Version**: 2022  
**Scope**: Information Security Management System  
**Region**: Global (international standard)

## When to Apply

Apply ISO 27001 when your component:
- Is part of an organization seeking/maintaining ISO 27001 certification
- Serves enterprise customers requiring certified security
- Operates internationally
- Needs a comprehensive, auditable security framework

## Theme Selection Guide

**Use this to decide which theme to investigate:**

| If your component... | Read Theme |
|---------------------|------------|
| Implements authentication | [A8-TechnologicalControls](A8-TechnologicalControls.md) |
| Implements authorization/RBAC | [A8-TechnologicalControls](A8-TechnologicalControls.md) |
| Produces audit logs | [A8-TechnologicalControls](A8-TechnologicalControls.md) |
| Uses encryption | [A8-TechnologicalControls](A8-TechnologicalControls.md) |
| Has development practices | [A8-TechnologicalControls](A8-TechnologicalControls.md) |
| Uses third-party dependencies | [A5-OrganizationalControls](A5-OrganizationalControls.md) |
| Handles classified data | [A5-OrganizationalControls](A5-OrganizationalControls.md) |

## Control Themes

| Theme | Controls | Primary For | Skip If |
|-------|----------|-------------|---------|
| [A5-OrganizationalControls](A5-OrganizationalControls.md) | 37 | Policies, suppliers, data classification | Pure technical component |
| [A6-PeopleControls](A6-PeopleControls.md) | 8 | Personnel security | Assign to HR |
| [A7-PhysicalControls](A7-PhysicalControls.md) | 14 | Physical security | Assign to Infrastructure |
| [A8-TechnologicalControls](A8-TechnologicalControls.md) | 34 | **ALL software** | Never skip |

## Quick Reference

**Most software components**: Focus on A8 (Technological)
**Supply chain concerns**: Also check A5.19-A5.23
**Physical security (A7)**: Assign to Infrastructure
**Personnel security (A6)**: Assign to HR
