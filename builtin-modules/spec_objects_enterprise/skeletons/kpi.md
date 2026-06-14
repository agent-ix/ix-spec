---
id: KPI-001
title: "On-time delivery rate"
artifact_type: kpi
metric: "Orders delivered within the promised window (% of delivered orders)"
target: "97% or higher, measured weekly"
threshold: "Alert below 95% for two consecutive weeks"
---
<!-- kpi authoring skeleton (spec-objects-enterprise). Fill the frontmatter and
     body with substantive content. Contract (manifest body_extraction
     asserts):
     - Frontmatter MUST carry id, title, artifact_type: kpi, plus the
       measurable fields `metric` and `target`; `threshold` is optional but
       recommended for alerting.
     - The body explains how the KPI is computed, who owns it and what happens
       when the threshold is breached (no TODO/TBD/placeholder text, no
       template variables). -->
# [KPI-001] On-time delivery rate

On-time delivery rate measures the share of delivered orders whose proof of
delivery falls within the delivery window promised at checkout. It is computed
weekly from carrier delivery scans joined to the promise recorded at Order
Capture, excluding orders the customer rescheduled. The KPI is owned by the
Fulfillment Platform group and reviewed in the monthly objective check-in for
OBJ-001. A breach of the alert threshold for two consecutive weeks triggers a
carrier-performance review and pauses onboarding of new delivery promises in
the affected region.
