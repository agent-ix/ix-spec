---
id: SLI-001
title: "Artifact-store availability SLI"
artifact_type: sli
---
<!-- sli authoring skeleton (spec-objects-operational). Fill the query with
     the real measurement. Contract (manifest body_extraction):
     - Frontmatter MUST carry id, title, and artifact_type: sli.
     - "## Query" (H2) is REQUIRED and MUST contain a fenced code block; its
       content is extracted as `query`.
     - State what counts as a good event so the ratio is unambiguous. -->
# [SLI-001] Artifact-store availability SLI

Availability is the ratio of successful requests (any HTTP status outside the
5xx range) to total requests served by the artifact-store API, measured over a
5-minute rate window.

## Query

```
sum(rate(http_requests_total{job="artifact-store", code!~"5.."}[5m]))
/
sum(rate(http_requests_total{job="artifact-store"}[5m]))
```
