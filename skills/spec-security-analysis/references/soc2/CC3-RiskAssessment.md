# CC3 - Risk Assessment

**Category**: Common Criteria  
**Focus**: Identifying and analyzing risks

## When to Apply

Apply CC3 when your component:
- Has security-sensitive functionality
- Handles sensitive data
- Integrates with external systems
- Has failure modes that could impact security

## Controls

| Control | Name | Description |
|---------|------|-------------|
| CC3.1 | Objectives Specification | Entity specifies objectives with sufficient clarity |
| CC3.2 | Risk Identification | Entity identifies and analyzes risks to achieving objectives |
| CC3.3 | Fraud Risk | Entity considers potential for fraud in assessing risks |
| CC3.4 | Change Identification | Entity identifies and assesses changes that could impact controls |

## Mapping Guidance

For software components:
- **Threat modeling** → CC3.2
- **Failure domain analysis** → CC3.2, CC3.4
- **Security requirements** → CC3.1
- **Input validation (fraud prevention)** → CC3.3
