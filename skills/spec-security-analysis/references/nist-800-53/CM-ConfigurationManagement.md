# CM - Configuration Management

**Family**: Configuration Management  
**Controls**: 14  
**Focus**: Configuration control and baseline management

## When to Apply

**CM is PRIMARY for configuration.**

## Controls

| Control | Name | Description | Software Relevance |
|---------|------|-------------|-------------------|
| CM-1 | Policy and Procedures | Document CM policies | LOW |
| CM-2 | Baseline Configuration | Establish baselines | **HIGH** |
| CM-3 | Configuration Change Control | Control changes | **HIGH** |
| CM-4 | Impact Analysis | Analyze impact | **HIGH** |
| CM-5 | Access Restrictions for Change | Restrict change access | **HIGH** |
| CM-6 | Configuration Settings | Security settings | **HIGH** |
| CM-7 | Least Functionality | Minimal functionality | **HIGH** |
| CM-8 | System Component Inventory | Component inventory | **HIGH** |
| CM-9 | Configuration Management Plan | CM plan | MEDIUM |
| CM-10 | Software Usage Restrictions | License compliance | MEDIUM |
| CM-11 | User-Installed Software | Control user software | LOW |
| CM-12 | Information System Component Location | Track locations | MEDIUM |
| CM-14 | Signed Components | Verify signatures | **HIGH** |

## Mapping Guidance

```
NFR-XXX (Config Management) → CM-2, CM-3, CM-6
NFR-XXX (Change Control) → CM-3, CM-4, CM-5
NFR-XXX (SBOM) → CM-8
NFR-XXX (Signed Artifacts) → CM-14
```
