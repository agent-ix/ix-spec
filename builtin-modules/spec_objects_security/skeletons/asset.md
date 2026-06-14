---
id: ASSET-001
title: "Session store"
artifact_type: asset
---
<!-- asset authoring skeleton (spec-objects-security). Fill every part with
     substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type (artifact_type: asset).
     - A "Description" section MUST describe the asset and why it matters. -->
# [ASSET-001] Session store

Redis cluster holding all active Atlas web sessions and CSRF token state.

## Description

The session store is the authority for who is currently authenticated:
compromise yields the ability to mint or hijack any active session across all
tenants, bypassing AUTHFLOW-001 entirely. It runs in the trusted private
subnet behind BOUND-001, accepts only mTLS connections from the auth service,
and persists nothing to disk (RDB/AOF disabled) so session identifiers never
reach backup media. Data it holds is classified Confidential (CLASS-001
handling applies to the embedded user identifiers).
