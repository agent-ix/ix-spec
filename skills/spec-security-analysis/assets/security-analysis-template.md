# Section 19: Compliance Standards Traceability Template

Use this template to generate the security compliance traceability section for `spec/spec.md`.

---

## 19. Compliance Standards Traceability

This specification targets alignment with the following industry security and privacy standards.

### 19.1 Targeted Standards

| Standard | Version | Scope | Region |
|----------|---------|-------|--------|
| AICPA SOC 2 | 2017 TSC (2024 updates) | [Applicable CC categories] | Global |
| ISO/IEC 27001 | 2022 (2024 amendment) | [Applicable Annex A sections] | Global |
| NIST SP 800-53 | Rev 5.2.0 | [Applicable control families] | US Federal |
| OWASP ASVS | 5.0.0 | [Applicable verification areas] | Global |
| EU GDPR | 2016/679 (2024 amendments) | [Applicable articles] | EU/EEA |

### 19.2 Control Mapping

| Control ID | Standard | Control Name | Component Requirement |
|------------|----------|--------------|----------------------|
| CC6.1 | SOC2 | Logical Access Security | [FR-XXX, FR-XXX] |
| A.9.X.X | ISO 27001 | [Control Name] | [FR-XXX] |
| AC-X | NIST | [Control Name] | [FR-XXX, NFR-XXX] |
| X.X.X | ASVS | [Verification Requirement] | [FR-XXX] |

> [!TIP]
> Group controls by functional area (Access Control, Audit, Data Protection, etc.) for readability.

### 19.3 GDPR Compliance

| GDPR Article | Requirement | Component Coverage |
|--------------|-------------|-------------------|
| Art. 25(1) | Data Protection by Design | [FR-XXX, NFR-XXX] |
| Art. 25(2) | Data Protection by Default | [FR-XXX] |
| Art. 32(1)(b) | Confidentiality/Integrity | [FR-XXX] |
| Art. 32(1)(d) | Regular Testing | [NFR-XXX] |
| Art. 32(4) | Authorized Processing Only | [FR-XXX] |

Key GDPR principles addressed:
- **Least Privilege**: [Requirement references]
- **Access Logging**: [Requirement references]
- **[Additional principles as applicable]**

### 19.4 Audit Support Controls

| Control Requirement | Standard Reference | Component Coverage |
|--------------------|-------------------|-------------------|
| Audit Logging | SOC2 CC7.2, ISO A.12.4, NIST AU-2 | [FR-XXX] |
| Log Integrity | NIST AU-9 | [FR-XXX-CON-X or N/A] |
| Fail-Safe Access | NIST AC-7, ISO A.9.4.2, GDPR Art. 32 | [NFR-XXX] |
| Retention Compatibility | SOC2 CC7.3, ISO A.12.4.1, GDPR Art. 30 | [NFR-XXX or N/A] |

### 19.5 Out of Scope

The following controls are outside [Component Name] scope:

| Control | Description | Responsible Component |
|---------|-------------|----------------------|
| [Control ID] | [Brief description] | [Component/Service Name] |

> [!NOTE]
> The table above is component-specific. Identify controls that are NOT applicable to this component and assign to the responsible component. Common examples include:
> - CC6.4, CC6.5 (Physical Access) → Infrastructure
> - A.9.2.1, A.9.2.2 (User Provisioning) → Auth Service
> - AC-17, AC-18 (Remote/Wireless) → Network Layer
> - GDPR Art. 17, 20 (Erasure/Portability) → Data Service

> [!IMPORTANT]
> Every out-of-scope control MUST identify the responsible component. Unassigned controls indicate a coverage gap.
