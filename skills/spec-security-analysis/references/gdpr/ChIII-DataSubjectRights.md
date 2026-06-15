# Chapter III - Rights of the Data Subject

**Articles**: 12-23  
**Focus**: User rights over their data

## When to Read This Chapter

Read this chapter when your component:
- Provides user-facing data APIs
- Allows users to view their data
- Implements data export functionality
- Handles data deletion requests
- Manages user consent/preferences

## Key Articles

### Art. 15 - Right of Access

**Read this when**: Users can view their stored data

| Obligation | Description | Assign To |
|------------|-------------|-----------|
| Art. 15(1-3) | Provide copy of personal data | Data Service |

### Art. 16 - Right to Rectification

**Read this when**: Users can modify their data

| Obligation | Description | Assign To |
|------------|-------------|-----------|
| Art. 16 | Correct inaccurate data | Data Service |

### Art. 17 - Right to Erasure ("Right to be Forgotten")

**Read this when**: Users can delete their data

| Obligation | Description | Assign To |
|------------|-------------|-----------|
| Art. 17(1) | Delete data on request | Data Service |
| Art. 17(2) | Inform other controllers | Data Service |

### Art. 18 - Right to Restriction

**Read this when**: Users can limit processing

| Obligation | Description | Assign To |
|------------|-------------|-----------|
| Art. 18 | Restrict processing | Data Service |

### Art. 20 - Right to Data Portability

**Read this when**: Users can export their data

| Obligation | Description | Assign To |
|------------|-------------|-----------|
| Art. 20(1) | Provide data in portable format | Data Service |
| Art. 20(2) | Transfer to another controller | Data Service |

### Art. 21 - Right to Object

**Read this when**: Users can opt-out of processing

| Obligation | Description | Assign To |
|------------|-------------|-----------|
| Art. 21 | Stop processing on objection | Business Logic |

### Art. 22 - Automated Decision-Making

**Read this when**: Using algorithms/ML for decisions affecting users

| Obligation | Description | Assign To |
|------------|-------------|-----------|
| Art. 22(1) | Right not to be subject to automated decisions | ML/AI Service |
| Art. 22(3) | Right to human intervention | ML/AI Service |

## Mapping Guidance

Most Chapter III rights are assigned to **Data Service** components, not authorization or infrastructure components.

**For auth/permissions components**: Chapter III is typically **OUT OF SCOPE** - document as:
```
Art. 15-20 (Data Subject Rights) → Data Service Layer
Art. 22 (Automated Decisions) → ML/AI Service
```
