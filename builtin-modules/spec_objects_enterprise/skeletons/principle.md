---
id: PRIN-001
title: "Promise only what the network can deliver"
artifact_type: principle
---
<!-- principle authoring skeleton (spec-objects-enterprise). Fill every section
     with substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title and artifact_type: principle.
     - An H2 "Rationale" section is required; its body must justify the
       principle and note its implications (no TODO/TBD/placeholder text, no
       template variables). -->
# [PRIN-001] Promise only what the network can deliver

Every delivery promise shown to a customer must be computed from live
fulfillment-network capacity — current inventory positions, warehouse cut-off
times and carrier pickup schedules — never from a static service-level table.

## Rationale

Missed delivery promises are the single largest driver of fulfillment-related
support contacts and refund concessions, and static promise tables drift from
reality every peak season. Computing promises from live network state keeps the
storefront honest at the moment of checkout: when a fulfillment center falls
behind, promises lengthen automatically instead of being broken silently. The
implication is that every system in the Order to Delivery value stream
(VS-001) must publish its capacity and cut-off signals to the promise engine,
and any new fulfillment integration is not production-ready until it does.
