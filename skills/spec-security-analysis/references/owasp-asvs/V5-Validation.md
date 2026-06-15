# V5 - Validation, Sanitization and Encoding

**Area**: Input/Output Validation  
**Focus**: Preventing injection attacks

## When to Apply

**V5 is PRIMARY for input handling.** Apply when your component:
- Accepts external input
- Generates output
- Processes untrusted data
- Interacts with databases/APIs

## Requirements

| Req | Name | Description | L1 | L2 | L3 |
|-----|------|-------------|----|----|-----|
| 5.1.1 | Input Architecture | Clear input validation architecture | ✓ | ✓ | ✓ |
| 5.1.2 | Input Validation | Positive validation (allowlists) | ✓ | ✓ | ✓ |
| 5.1.3 | URL Redirect | Redirect destinations validated | ✓ | ✓ | ✓ |
| 5.2.1 | HTML Sanitization | HTML properly sanitized | ✓ | ✓ | ✓ |
| 5.2.2 | Unstructured Data | Unstructured data sanitized | ✓ | ✓ | ✓ |
| 5.3.1 | Output Encoding | Contextual output encoding | ✓ | ✓ | ✓ |
| 5.3.2 | HTML Output | HTML output escaped | ✓ | ✓ | ✓ |
| 5.3.3 | JSON Output | JSON output escaped | ✓ | ✓ | ✓ |
| 5.4.1 | Memory Safe | Memory-safe string handling | | ✓ | ✓ |
| 5.5.1 | Deserialization | Safe deserialization | ✓ | ✓ | ✓ |
| 5.5.2 | XML Parsing | XXE prevention | ✓ | ✓ | ✓ |

## Mapping Guidance

```
FR-XXX (Input Validation) → 5.1.1, 5.1.2
FR-XXX (Sanitization) → 5.2.1, 5.2.2
NFR-XXX (Output Encoding) → 5.3.1, 5.3.2, 5.3.3
NFR-XXX (Deserialization) → 5.5.1, 5.5.2
```
