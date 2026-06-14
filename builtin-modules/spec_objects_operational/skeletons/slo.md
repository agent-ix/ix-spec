---
id: SLO-001
title: "Artifact-store availability SLO"
artifact_type: slo
target: "99.9%"
window: "30d"
---
<!-- slo authoring skeleton (spec-objects-operational). Contract (manifest
     body_extraction):
     - Frontmatter MUST carry id, title, artifact_type: slo, AND the two
       extracted objective fields: `target` (e.g. "99.9%") and `window`
       (e.g. "30d", a rolling window).
     - The body explains the objective and its error budget in prose. -->
# [SLO-001] Artifact-store availability SLO

The artifact-store API serves 99.9% of requests successfully, measured by
SLI-001 over a rolling 30-day window. The corresponding error budget is
roughly 43 minutes of full unavailability per window.

When the remaining error budget drops below 25%, feature deploys to the
artifact-store pause and only reliability fixes ship until the budget
recovers. Burn-rate alerting against this objective is defined in ALR-001.
