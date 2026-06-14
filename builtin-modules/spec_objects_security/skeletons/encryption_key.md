---
id: KEY-001
title: "Tenant data encryption key"
artifact_type: encryption_key
algorithm: AES-256-GCM
rotation: 90d
---
<!-- encryption_key authoring skeleton (spec-objects-security). Fill every part
     with substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type:
       encryption_key) and algorithm (the cipher); rotation gives the cadence. -->
# [KEY-001] Tenant data encryption key

Per-tenant data encryption key (DEK) protecting documents at rest in the Atlas
object store. Each DEK is wrapped by the platform KMS root key and unwrapped
only inside the storage service; plaintext keys never leave process memory.
Rotation re-wraps the DEK on the `90d` cadence declared above without
re-encrypting historical objects, which remain readable via key versioning.
