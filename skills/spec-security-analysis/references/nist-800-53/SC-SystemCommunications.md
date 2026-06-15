# SC - System and Communications Protection

**Family**: System and Communications Protection  
**Controls**: 51  
**Focus**: Network security, cryptography, boundaries

## When to Apply

**SC is PRIMARY for crypto and network security.** Apply when your component:
- Uses encryption
- Communicates over networks
- Has security boundaries
- Processes data in transit

## Controls (Key Selections)

| Control | Name | Description | Software Relevance |
|---------|------|-------------|-------------------|
| SC-1 | Policy and Procedures | Document SC policies | LOW - Docs |
| SC-2 | Separation of System and User Functionality | Separate functions | MEDIUM - Architecture |
| SC-3 | Security Function Isolation | Isolate security | **HIGH** - Isolation |
| SC-4 | Information in Shared System Resources | Protect shared resources | **HIGH** - Multi-tenant |
| SC-5 | Denial of Service Protection | DoS protection | **HIGH** - Availability |
| SC-7 | Boundary Protection | Protect boundaries | **HIGH** - Network |
| SC-8 | Transmission Confidentiality and Integrity | Protect transmission | **HIGH** - TLS |
| SC-10 | Network Disconnect | Terminate connections | MEDIUM - Sessions |
| SC-12 | Cryptographic Key Establishment and Management | Key management | **HIGH** - Keys |
| SC-13 | Cryptographic Protection | Use crypto | **HIGH** - Encryption |
| SC-17 | PKI Certificates | Manage certificates | **HIGH** - TLS/PKI |
| SC-23 | Session Authenticity | Protect session integrity | **HIGH** - Sessions |
| SC-24 | Fail in Known State | Fail securely | **HIGH** - Fail-close |
| SC-28 | Protection of Information at Rest | Protect stored data | **HIGH** - Encryption |
| SC-39 | Process Isolation | Isolate processes | **HIGH** - Containers |

## Mapping Guidance

### Crypto Controls (SC-8, SC-12, SC-13, SC-28)
```
NFR-XXX (TLS) → SC-8
NFR-XXX (Encryption at Rest) → SC-28
NFR-XXX (Key Management) → SC-12
```

### Boundary Controls (SC-7, SC-24)
```
FR-XXX (API Boundary) → SC-7
NFR-XXX (Fail-Safe Default) → SC-24
```

### Multi-tenant (SC-4)
```
FR-007 (Org Tenancy) → SC-4
```
