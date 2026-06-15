# Chapter V - Transfers of Personal Data

**Articles**: 44-50  
**Focus**: International data transfers

## When to Read This Chapter

Read this chapter when your component:
- Transfers data to non-EU countries
- Uses cloud services outside EU
- Integrates with US-based services
- Replicates data across regions

## Key Articles

### Art. 44 - General Principle for Transfers

**Read this when**: Any data leaves EU/EEA

| Obligation | Description |
|------------|-------------|
| Art. 44 | Transfers only with appropriate safeguards |

### Art. 45 - Adequacy Decisions

**Read this when**: Transferring to countries with EU adequacy

Adequacy countries (data can flow freely): UK, Switzerland, Japan, South Korea, Canada (commercial), etc.

### Art. 46 - Appropriate Safeguards

**Read this when**: Transferring to non-adequate countries (e.g., US)

| Mechanism | Description |
|-----------|-------------|
| SCCs | Standard Contractual Clauses |
| BCRs | Binding Corporate Rules |
| Codes | Approved codes of conduct |

### Art. 49 - Derogations

**Read this when**: No other transfer mechanism available

| Derogation | When Allowed |
|------------|--------------|
| Explicit Consent | User explicitly consents to transfer |
| Contract | Necessary for contract with user |
| Public Interest | Important public interest reasons |

## Mapping Guidance

Chapter V is typically **Infrastructure/Legal** responsibility.

For software components, document:
```
Art. 44-49 (International Transfers) → Infrastructure/Legal
```

However, software should support:
- Data residency configuration
- Region selection for storage
- Transfer logging
