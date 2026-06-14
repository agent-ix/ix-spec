---
id: rate-limit-001
title: "Artifact upload rate limit"
artifact_type: rate_limit
---
<!-- rate_limit authoring skeleton (spec-objects-architecture). Fill every
     section with substantive content. Contract (manifest body_extraction
     asserts):
     - Frontmatter MUST carry id, title, artifact_type; artifact_type is
       rate_limit (quire resolves the archetype from it).
     - "## Thresholds" (H2, required): the concrete limits, windows, and the
       response when a limit is exceeded.
     - Keep headings unique per level. -->
# [rate-limit-001] Artifact upload rate limit

## Thresholds

- Per token: 60 uploads per minute, sliding window; excess requests receive
  `429 Too Many Requests` with a `Retry-After` header.
- Per token: 5 GiB uploaded bytes per hour; byte-budget exhaustion also
  returns `429` and resets at the top of the hour.
- Global: 1000 concurrent upload streams across the service; beyond that the
  gateway sheds load with `503 Service Unavailable`.
