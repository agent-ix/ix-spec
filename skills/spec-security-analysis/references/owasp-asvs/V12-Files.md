# V12 - Files

**Area**: File Handling Verification  
**Focus**: File upload, download, and storage security

## When to Apply

**V12 is PRIMARY for file handling.** Apply when your component:
- Accepts file uploads
- Serves file downloads
- Processes user-provided files
- Stores files on the filesystem

## Requirements

| Req | Name | Description | L1 | L2 | L3 |
|-----|------|-------------|----|----|-----|
| 12.1.1 | File Size Limits | Maximum file size enforced | ✓ | ✓ | ✓ |
| 12.1.2 | File Type Validation | File types validated (not just extension) | ✓ | ✓ | ✓ |
| 12.1.3 | Path Traversal | Path traversal prevented | ✓ | ✓ | ✓ |
| 12.2.1 | Antivirus Scan | Uploaded files scanned for malware | | ✓ | ✓ |
| 12.3.1 | Secure Storage | Files stored outside web root | ✓ | ✓ | ✓ |
| 12.3.2 | Filename Sanitization | User filenames sanitized | ✓ | ✓ | ✓ |
| 12.4.1 | Content-Disposition | Proper Content-Disposition headers | ✓ | ✓ | ✓ |

## Mapping Guidance

```
FR-001 (Upload) → 12.1.1, 12.1.2
FR-002 (Storage) → 12.3.1
FR-003 (Download) → 12.4.1
NFR-001 (Path Security) → 12.1.3
NFR-002 (Malware) → 12.2.1
```
