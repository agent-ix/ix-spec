---
id: external-contract-001
title: "Identity service contract"
artifact_type: external_contract
---
<!-- external_contract authoring skeleton (spec-objects-architecture). Fill
     every section with substantive content. Contract (manifest
     body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type; artifact_type is
       external_contract (quire resolves the archetype from it).
     - "## Contract" (H2, required): the contract with the EXTERNAL system —
       what it provides/expects, invariants, versioning expectations.
     - "## Endpoints" (H2, optional): concrete surface consumed/exposed.
     - "## Behavior" (H2, optional): interaction semantics, failure modes.
     - Boundary: contracts WITHIN the system are `interface` objects;
       this kind is for systems outside it (vendors, peer services whose
       contract this repo does not own).
     - Keep headings unique per level. -->
# [external-contract-001] Identity service contract

## Contract

The auth-service consumes the Identity service as its sole source of user
credential validation and user lookup. Identity guarantees: `tenant_id` is the
canonical isolation boundary; user status transitions follow the published
lifecycle; breaking response-shape changes bump the internal API version
header. The auth-service guarantees it never caches credential-validation
verdicts beyond a single request.

## Endpoints

- `POST /auth/internal/authenticate` — validate username/password credentials
- `GET /auth/internal/lookup/{user_id}` — fetch user profile by id

## Behavior

- Credential validation is fail-closed: any non-200 response is treated as a
  rejection; timeouts surface as 503 to the caller, never as auth success.
- User lookups tolerate eventual consistency up to 5 s after a mutation.
