# V13 - API and Web Service

**Area**: API Security  
**Focus**: Secure API design and implementation

## When to Apply

**V13 is PRIMARY for APIs.** Apply when your component:
- Exposes REST, GraphQL, or SOAP APIs
- Consumes external APIs
- Has service-to-service communication

## Requirements

| Req | Name | Description | L1 | L2 | L3 |
|-----|------|-------------|----|----|-----|
| 13.1.1 | Generic Security | General web service hardening | ✓ | ✓ | ✓ |
| 13.1.2 | URL Encoding | Proper URL encoding | ✓ | ✓ | ✓ |
| 13.1.3 | Content-Type | Content-Type validation | ✓ | ✓ | ✓ |
| 13.2.1 | RESTful Protection | RESTful API protection | ✓ | ✓ | ✓ |
| 13.2.2 | JSON Schema | JSON schema validation | | ✓ | ✓ |
| 13.2.3 | Rate Limiting | Rate limiting implemented | ✓ | ✓ | ✓ |
| 13.2.4 | HTTP Methods | Proper HTTP method handling | ✓ | ✓ | ✓ |
| 13.3.1 | SOAP Hardening | SOAP service hardening | ✓ | ✓ | ✓ |
| 13.4.1 | GraphQL Security | GraphQL-specific protections | ✓ | ✓ | ✓ |
| 13.4.2 | Query Depth | GraphQL query depth limits | ✓ | ✓ | ✓ |

## Mapping Guidance

```
FR-XXX (API Security) → 13.1.1, 13.2.1
NFR-XXX (Rate Limiting) → 13.2.3
NFR-XXX (Input Validation) → 13.1.3, 13.2.2
```
