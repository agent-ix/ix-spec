# CC8 - Change Management

**Category**: Common Criteria  
**Focus**: Authorization and control of changes

## When to Apply

Apply CC8 when your component:
- Has code or configuration changes
- Impacts production systems
- Requires testing before deployment

## Controls

| Control | Name | Description |
|---------|------|-------------|
| CC8.1 | Change Authorization | Entity authorizes, designs, develops, configures, documents, tests, approves, and implements changes |

## Mapping Guidance

CC8.1 is comprehensive and maps to:
- **Code review requirements** → NFR-XXX
- **CI/CD pipeline** → NFR-XXX
- **Testing requirements** → NFR-XXX
- **Approval workflows** → Process documentation
- **Rollback capability** → NFR-XXX

For software components, CC8 is typically satisfied by:
- Git-based version control
- Pull request reviews
- Automated testing
- Deployment pipelines
