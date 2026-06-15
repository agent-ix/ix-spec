# Chapter II - Principles

**Articles**: 5-11  
**Focus**: Core data processing principles

## When to Read This Chapter

Read this chapter when:
- Defining what data to collect
- Determining processing purposes
- Establishing legal basis for processing
- Setting data retention policies

## Key Articles

### Art. 5 - Principles Relating to Processing

**Read this when**: Defining data model or processing rules

| Principle | Article | Description |
|-----------|---------|-------------|
| Lawfulness | 5(1)(a) | Process lawfully, fairly, transparently |
| Purpose Limitation | 5(1)(b) | Collect for specified purposes only |
| Data Minimization | 5(1)(c) | Collect only what's necessary |
| Accuracy | 5(1)(d) | Keep data accurate and current |
| Storage Limitation | 5(1)(e) | Retain only as long as needed |
| Integrity/Confidentiality | 5(1)(f) | Process securely |

**Map to**: 
- NFR for data minimization → 5(1)(c)
- NFR for retention → 5(1)(e)
- FR for access control → 5(1)(f)

### Art. 6 - Lawfulness of Processing

**Read this when**: Determining legal basis

| Basis | Article | When to Use |
|-------|---------|-------------|
| Consent | 6(1)(a) | User explicitly agrees |
| Contract | 6(1)(b) | Necessary for service |
| Legal Obligation | 6(1)(c) | Required by law |
| Vital Interests | 6(1)(d) | Life-threatening situations |
| Public Interest | 6(1)(e) | Public authority functions |
| Legitimate Interest | 6(1)(f) | Balanced with user rights |

### Art. 9 - Special Categories (Sensitive Data)

**Read this when**: Processing health, biometric, racial, political, religious data

Requires explicit consent or specific legal basis.

## Mapping Guidance

Chapter II principles are primarily **organizational/policy** but software should enforce:
- Data minimization via schema design
- Storage limitation via retention policies
- Integrity/confidentiality via access control
