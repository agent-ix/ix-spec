# EU GDPR 2016/679

**Version**: 2016/679  
**Scope**: Personal data protection  
**Region**: EU/EEA (applies globally to EU data subjects)

## When to Apply

Apply GDPR when your component:
- Processes personal data of EU residents
- Stores user information
- Logs user activity
- Handles consent or preferences

## Chapter Selection Guide

**Use this to decide which chapter to investigate:**

| If your component... | Read Chapter |
|---------------------|--------------|
| Handles ANY personal data | [ChIV-ControllerProcessor](ChIV-ControllerProcessor.md) |
| Needs to implement data subject requests | [ChIII-DataSubjectRights](ChIII-DataSubjectRights.md) |
| Transfers data outside EU | [ChV-DataTransfers](ChV-DataTransfers.md) |
| Defines data processing principles | [ChII-Principles](ChII-Principles.md) |

## Chapter Overview

| Chapter | Articles | Primary Focus | Read When |
|---------|----------|---------------|-----------|
| [ChII-Principles](ChII-Principles.md) | 5-11 | Lawfulness, purpose limitation | Defining data model, processing rules |
| [ChIII-DataSubjectRights](ChIII-DataSubjectRights.md) | 12-23 | Access, erasure, portability | User-facing data APIs |
| [ChIV-ControllerProcessor](ChIV-ControllerProcessor.md) | 24-43 | Security, DPIA, breach notification | **Any data processing** |
| [ChV-DataTransfers](ChV-DataTransfers.md) | 44-50 | International transfers | Cross-border data flow |

## Key Articles for Software

Most software maps primarily to Chapter IV (Controller/Processor):

| Article | Name | Apply When |
|---------|------|------------|
| Art. 25 | Data Protection by Design/Default | Any new feature design |
| Art. 30 | Records of Processing | Any data processing |
| Art. 32 | Security of Processing | **All components** |
| Art. 33-34 | Breach Notification | Incident handling |
| Art. 35 | DPIA | High-risk processing |

## Common Out-of-Scope Assignments

| Article | Responsibility | Assign To |
|---------|---------------|-----------|
| Art. 15-18 | Data access/rectification/restriction | Data Service |
| Art. 17 | Right to erasure | Data Service |
| Art. 20 | Data portability | Data Service |
| Art. 37-39 | DPO | Legal/Compliance |
