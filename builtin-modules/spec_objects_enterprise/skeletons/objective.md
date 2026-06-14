---
id: OBJ-001
title: "Cut median order-to-ship time in half"
artifact_type: objective
metric: "Median order-to-ship time across all fulfillment centers (hours)"
target: "12 hours or less"
deadline: "2026-12-31"
---
<!-- objective authoring skeleton (spec-objects-enterprise). Fill the
     frontmatter and body with substantive content. Contract (manifest
     body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type: objective, plus the
       measurable fields `metric` and `target`; `deadline` is optional but
       strongly recommended.
     - The body explains why the objective matters and how it will be pursued
       (no TODO/TBD/placeholder text, no template variables). -->
# [OBJ-001] Cut median order-to-ship time in half

Customers who receive a same-day ship confirmation reorder at twice the rate of
those who wait more than a day, yet our median order-to-ship time sits at 24
hours. This objective commits the Fulfillment Platform group to bringing the
median down to 12 hours or less across all fulfillment centers by the end of
2026, primarily by moving to event-driven orchestration (DEC-001) and adding a
second daily carrier pickup at the two highest-volume centers. Progress is
reviewed monthly against the KPI dashboard owned by Warehouse Operations.
