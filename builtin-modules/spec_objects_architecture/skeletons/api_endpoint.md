---
id: api-endpoint-001
title: "Upload artifact"
artifact_type: api_endpoint
---
<!-- api_endpoint authoring skeleton (spec-objects-architecture). Fill every
     section with substantive content. Contract (manifest body_extraction
     asserts):
     - Frontmatter MUST carry id, title, artifact_type; artifact_type is
       api_endpoint (quire resolves the archetype from it).
     - "## Endpoint" (H2, required): what the endpoint does and why, plus
       the concrete method + path routes (multi-route surfaces list every
       route here — there is no separate Routes section; format-walkthrough
       decision #20).
     - "## 2. API Contract" (H2, optional): request/response detail; the
       numbered heading text "2. API Contract" is matched verbatim.
     - Keep headings unique per level. -->
# [api-endpoint-001] Upload artifact

## Endpoint

`POST /artifacts` accepts a binary artifact upload together with a declared
SHA-256 digest and persists the artifact to the store once the computed
digest matches the declared digest. Mismatches are rejected before anything
is written.

Routes:

- `POST /artifacts` — upload a new artifact (multipart body + digest field)
- `GET /artifacts/{artifact_id}` — fetch artifact metadata by id
- `GET /artifacts/{artifact_id}/content` — stream the stored artifact bytes

## 2. API Contract

- Request: `multipart/form-data` with parts `content` (artifact bytes) and
  `digest` (hex-encoded SHA-256 of the content part).
- Response `201 Created`: JSON body `{"artifact_id": "...", "digest": "..."}`.
- Response `422 Unprocessable Entity`: digest mismatch; the body carries the
  declared and computed digest pair.
- Auth: bearer token carrying the `artifacts:write` scope.
