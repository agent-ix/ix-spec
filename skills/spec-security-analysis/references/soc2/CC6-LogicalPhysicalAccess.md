# CC6 - Logical and Physical Access Controls

**Category**: Common Criteria  
**Focus**: Protection against unauthorized access

## When to Apply

**CC6 is the PRIMARY category for most software components.**

Apply CC6 when your component:
- Authenticates users or services
- Authorizes actions or access
- Protects data in transit
- Has network boundaries
- Handles credentials

## Controls

| Control | Name | Description | Software Relevance |
|---------|------|-------------|-------------------|
| CC6.1 | Logical Access Security | Entity implements logical access security to protect against unauthorized access | **HIGH** - Auth, RBAC, ABAC |
| CC6.2 | Registration/Authorization | Entity prior to registration/authorization verifies identity | **HIGH** - User/service identity |
| CC6.3 | Access Modification | Entity manages access rights appropriately when changes occur | **HIGH** - Access lifecycle |
| CC6.4 | Physical Access | Entity restricts physical access to facilities | LOW - Infrastructure |
| CC6.5 | Asset Disposal | Entity disposes of assets securely | LOW - Infrastructure |
| CC6.6 | Boundary Protection | Entity protects system boundaries from unauthorized connections | **HIGH** - API security |
| CC6.7 | Data Transmission | Entity restricts data transmission to authorized channels | **HIGH** - TLS, encryption |
| CC6.8 | Malicious Software | Entity prevents or detects malicious software | MEDIUM - Input validation |

## Mapping Guidance

### High-Priority Mappings

| Control | Typical FR/NFR |
|---------|----------------|
| CC6.1 | FR-XXX (permission check), FR-XXX (enforcement) |
| CC6.2 | FR-XXX (auth context), FR-XXX (identity verification) |
| CC6.3 | FR-XXX (access modification), FR-XXX (role management) |
| CC6.6 | FR-XXX (API boundary), NFR-XXX (network security) |
| CC6.7 | NFR-XXX (TLS), NFR-XXX (encryption) |

### Out of Scope for Software

- CC6.4 (Physical Access) → Infrastructure team
- CC6.5 (Asset Disposal) → Infrastructure team
