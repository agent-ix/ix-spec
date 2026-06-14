---
id: ALR-001
title: "Artifact-store availability burn-rate alert"
artifact_type: alert
---
<!-- alert authoring skeleton (spec-objects-operational). Contract (manifest
     body_extraction):
     - Frontmatter MUST carry id, title, and artifact_type: alert.
     - "## Flow" (H2) is REQUIRED and MUST contain a fenced ```mermaid code
       block; its content is extracted as `flow`.
     - Mermaid rules: no semicolons in label text, no spaces in node ids,
       quote any node label containing parentheses. -->
# [ALR-001] Artifact-store availability burn-rate alert

Multi-window burn-rate alert against SLO-001. A fast burn pages the on-call
engineer immediately; a slow burn files a ticket for working hours.

## Flow

```mermaid
flowchart TD
  evalBurn["Evaluate burn rate over 5m and 1h windows"] --> fastBurn{Fast burn above 14x budget}
  fastBurn -->|yes| pageOncall["Page on-call (SEV-2)"]
  fastBurn -->|no| slowBurn{Slow burn above 6x budget}
  slowBurn -->|yes| fileTicket[File ticket for next business day]
  slowBurn -->|no| keepWatching[Continue evaluating each minute]
  pageOncall --> runbookRef[Follow runbook RUN-001]
```
