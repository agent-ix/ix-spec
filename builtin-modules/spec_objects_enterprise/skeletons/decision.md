---
id: DEC-001
title: "Adopt event-driven order orchestration"
artifact_type: decision
---
<!-- decision authoring skeleton (spec-objects-enterprise). Fill every section
     with substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title and artifact_type: decision.
     - An H2 "Decision" section is required; its body must state the decision
       taken, its scope and the alternatives it supersedes (no TODO/TBD/
       placeholder text, no template variables). -->
# [DEC-001] Adopt event-driven order orchestration

## Decision

The Fulfillment Platform group will orchestrate order fulfillment through an
event-driven saga over the order event bus, replacing the synchronous
point-to-point calls between checkout, inventory and the warehouse management
system. Each fulfillment step publishes a completion event and registers a
compensating action, so a failed shipment creation releases its inventory
reservation automatically instead of requiring the nightly reconciliation job.
The decision applies to all regional fulfillment centers; the legacy
synchronous path is retired once the final region migrates. The alternative of
scaling the existing orchestrator with retries was rejected because it could
not meet the peak-season throughput target without over-provisioning the
warehouse management system.
