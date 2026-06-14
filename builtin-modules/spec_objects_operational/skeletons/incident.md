---
id: INC-001
title: "Artifact-store availability incident 2026-06-02"
artifact_type: incident
---
<!-- incident authoring skeleton (spec-objects-operational). Contract
     (manifest body_extraction):
     - Frontmatter MUST carry id, title, and artifact_type: incident.
     - "## Timeline" (H2) is REQUIRED; its body is extracted as `timeline`.
     - Timeline entries are timestamped (UTC), factual, and ordered. -->
# [INC-001] Artifact-store availability incident 2026-06-02

A bad configuration reload dropped artifact-store availability to 97.4% for
38 minutes, consuming most of the monthly error budget for SLO-001. Root
cause: `max_upload_size_mb` was set below the size of in-flight uploads,
turning resumed uploads into 500s.

## Timeline

- 09:12 UTC — ALR-001 fast-burn alert pages the on-call engineer.
- 09:15 UTC — On-call confirms elevated 5xx on the availability dashboard.
- 09:21 UTC — Pod restarts ruled out; deploy history shows a config-only
  change at 09:05 lowering `max_upload_size_mb` from 512 to 64.
- 09:33 UTC — Configuration change reverted and reloaded via `SIGHUP`.
- 09:50 UTC — Success ratio back above target; alert resolves.
- 10:30 UTC — Follow-up filed to validate upload-size changes against
  in-flight upload sizes before reload.
