# CC9 - Risk Mitigation

**Category**: Common Criteria  
**Focus**: Risk mitigation and vendor management

## When to Apply

Apply CC9 when your component:
- Uses third-party libraries or services
- Integrates with external vendors
- Depends on other services

## Controls

| Control | Name | Description |
|---------|------|-------------|
| CC9.1 | Risk Mitigation | Entity identifies, selects, and develops risk mitigation activities |
| CC9.2 | Vendor Risk | Entity assesses and manages risks associated with vendors and business partners |

## Mapping Guidance

For software components:
- **Dependency scanning** → CC9.1, CC9.2
- **Vendor security reviews** → CC9.2
- **Fallback mechanisms** → CC9.1
- **Circuit breakers** → CC9.1
- **Supply chain verification** → CC9.2

### Example Mappings

| Control | Typical NFR |
|---------|-------------|
| CC9.1 | NFR-XXX (fail-safe), NFR-XXX (graceful degradation) |
| CC9.2 | NFR-XXX (dependency policy), NFR-XXX (vendout security) |
