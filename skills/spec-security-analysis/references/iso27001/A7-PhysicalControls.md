# A.7 - Physical Controls

**Theme**: Physical  
**Controls**: 14  
**Focus**: Physical security of premises and equipment

## When to Apply

A.7 controls are infrastructure-level. Software components typically assign these to Infrastructure team.

## Controls

| Control | Name | Description | Software Relevance |
|---------|------|-------------|-------------------|
| A.7.1 | Physical Security Perimeters | Secure perimeters | LOW - Infrastructure |
| A.7.2 | Physical Entry | Secure entry points | LOW - Infrastructure |
| A.7.3 | Securing Offices, Rooms and Facilities | Secure premises | LOW - Infrastructure |
| A.7.4 | Physical Security Monitoring | Monitor for intrusion | LOW - Infrastructure |
| A.7.5 | Protecting Against Physical and Environmental Threats | Threat protection | LOW - Infrastructure |
| A.7.6 | Working in Secure Areas | Secure area procedures | LOW - Infrastructure |
| A.7.7 | Clear Desk and Clear Screen | Clear desk policy | LOW - Organizational |
| A.7.8 | Equipment Siting and Protection | Equipment placement | LOW - Infrastructure |
| A.7.9 | Security of Assets Off-Premises | Off-site protection | LOW - Infrastructure |
| A.7.10 | Storage Media | Media management | MEDIUM - Data at rest |
| A.7.11 | Supporting Utilities | Utility protection | LOW - Infrastructure |
| A.7.12 | Cabling Security | Cable protection | LOW - Infrastructure |
| A.7.13 | Equipment Maintenance | Equipment maintenance | LOW - Infrastructure |
| A.7.14 | Secure Disposal or Re-Use of Equipment | Equipment disposal | LOW - Infrastructure |

## Mapping Guidance

For software components:
- **A.7.10** (Storage Media) → NFR for encryption at rest if component handles persistent storage

All other A.7 controls → Assign to Infrastructure team.
