# OWASP ASVS 5.0.0

**Version**: 5.0.0  
**Scope**: Application Security Verification  
**Region**: Global (industry standard)

## When to Apply

Apply OWASP ASVS when your component:
- Is a web application or API
- Has user-facing interfaces
- Processes untrusted input
- Requires security testing criteria

## Area Selection Guide

**Use this to decide which area to investigate:**

| If your component... | Read Area |
|---------------------|-----------|
| Implements authorization/RBAC/ABAC | [V4-AccessControl](V4-AccessControl.md) |
| Validates user input | [V5-Validation](V5-Validation.md) |
| Handles errors or produces logs | [V7-ErrorLogging](V7-ErrorLogging.md) |
| Exposes REST/GraphQL/SOAP APIs | [V13-API](V13-API.md) |
| Has configuration or dependencies | [V14-Configuration](V14-Configuration.md) |
| Authenticates users | [V2-Authentication](V2-Authentication.md) |
| Manages sessions | [V3-SessionManagement](V3-SessionManagement.md) |
| Uses encryption | [V6-Cryptography](V6-Cryptography.md) |
| Protects sensitive data | [V8-DataProtection](V8-DataProtection.md) |
| Uses network communication | [V9-Communication](V9-Communication.md) |
| Has file upload/download | [V12-Files](V12-Files.md) |
| Has complex business workflows | [V11-BusinessLogic](V11-BusinessLogic.md) |

## Verification Levels

| Level | Name | Apply To |
|-------|------|----------|
| L1 | Opportunistic | All applications (minimum) |
| L2 | Standard | Sensitive data, business apps |
| L3 | Advanced | Critical systems, high-value |

## Verification Areas

| Area | Primary For | Skip If |
|------|-------------|---------|
| [V1-Architecture](V1-Architecture.md) | Threat modeling | Already documented |
| [V2-Authentication](V2-Authentication.md) | Auth services | Auth handled elsewhere |
| [V3-SessionManagement](V3-SessionManagement.md) | Stateful apps | Stateless/library |
| [V4-AccessControl](V4-AccessControl.md) | **Authorization** | No access decisions |
| [V5-Validation](V5-Validation.md) | **All input handling** | No external input |
| [V6-Cryptography](V6-Cryptography.md) | Encryption | No crypto usage |
| [V7-ErrorLogging](V7-ErrorLogging.md) | **All production** | Never skip |
| [V8-DataProtection](V8-DataProtection.md) | Sensitive data | No sensitive data |
| [V9-Communication](V9-Communication.md) | Network apps | Local only |
| [V10-MaliciousCode](V10-MaliciousCode.md) | All software | Low priority |
| [V11-BusinessLogic](V11-BusinessLogic.md) | Complex workflows | Simple CRUD |
| [V12-Files](V12-Files.md) | File handling | No file I/O |
| [V13-API](V13-API.md) | **All APIs** | No API surface |
| [V14-Configuration](V14-Configuration.md) | **All software** | Never skip |
