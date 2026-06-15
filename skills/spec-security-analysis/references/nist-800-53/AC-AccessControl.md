# AC - Access Control

**Family**: Access Control  
**Controls**: 25  
**Focus**: Authorization and access enforcement

## When to Apply

**AC is PRIMARY for authorization components.** Apply when your component:
- Controls access to resources
- Enforces permissions
- Manages user sessions
- Implements RBAC/ABAC

## Controls

| Control | Name | Description | Software Relevance |
|---------|------|-------------|-------------------|
| AC-1 | Policy and Procedures | Document access policies | LOW - Docs |
| AC-2 | Account Management | Manage system accounts | **HIGH** - User mgmt |
| AC-3 | Access Enforcement | Enforce authorizations | **HIGH** - Authz core |
| AC-4 | Information Flow Enforcement | Control info flow | **HIGH** - Data flow |
| AC-5 | Separation of Duties | Enforce duty separation | **HIGH** - RBAC |
| AC-6 | Least Privilege | Employ least privilege | **HIGH** - Min access |
| AC-7 | Unsuccessful Logon Attempts | Limit failed attempts | **HIGH** - Brute force |
| AC-8 | System Use Notification | Display use warning | MEDIUM - UI |
| AC-9 | Previous Logon Notification | Notify of last logon | LOW - UX |
| AC-10 | Concurrent Session Control | Limit concurrent sessions | MEDIUM - Sessions |
| AC-11 | Device Lock | Lock after inactivity | MEDIUM - Client |
| AC-12 | Session Termination | Auto-terminate sessions | **HIGH** - Sessions |
| AC-14 | Permitted Actions Without Identification | Allow anonymous actions | MEDIUM - Public API |
| AC-16 | Security and Privacy Attributes | Support attributes | **HIGH** - ABAC |
| AC-17 | Remote Access | Control remote access | MEDIUM - Network |
| AC-18 | Wireless Access | Control wireless | LOW - Infrastructure |
| AC-19 | Access Control for Mobile Devices | Mobile access | MEDIUM - Mobile |
| AC-20 | Use of External Systems | External system access | MEDIUM - Integration |
| AC-21 | Information Sharing | Enable authorized sharing | **HIGH** - Data sharing |
| AC-22 | Publicly Accessible Content | Control public content | MEDIUM - Public API |
| AC-23 | Data Mining Protection | Prevent data mining | MEDIUM - Query limits |
| AC-24 | Access Control Decisions | Establish decision points | **HIGH** - PEP/PDP |
| AC-25 | Reference Monitor | Implement reference monitor | **HIGH** - Core authz |

## Mapping Guidance

### Core Authorization (AC-2, AC-3, AC-5, AC-6)
```
FR-001 (Permission Check) → AC-3, AC-25
FR-002 (Enforcement) → AC-3
FR-008 (RBAC) → AC-5, AC-6
FR-009 (ABAC) → AC-16
```

### Session Management (AC-7, AC-10, AC-12)
```
FR-XXX (Session) → AC-10, AC-12
NFR-XXX (Lockout) → AC-7
```
