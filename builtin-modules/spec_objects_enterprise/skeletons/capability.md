---
id: CAP-001
title: "Order Fulfillment"
artifact_type: capability
---
<!-- capability authoring skeleton (spec-objects-enterprise). Fill every section
     with substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title and artifact_type: capability.
     - An H2 "Sub-capabilities" section is required; its body must enumerate the
       child capabilities with substantive descriptions (no TODO/TBD/placeholder
       text, no template variables). -->
# [CAP-001] Order Fulfillment

The Order Fulfillment capability is the organization's ability to take a placed
customer order and deliver the right goods to the right address within the
promised window. It spans orchestration of payment, inventory, warehouse and
carrier systems and is owned by the Fulfillment Platform group.

## Sub-capabilities

- **Order Orchestration** — sequences payment capture, inventory reservation
  and shipment creation across regional fulfillment centers, with compensating
  actions on partial failure.
- **Warehouse Operations** — pick, pack and ship execution inside each
  fulfillment center, including wave planning and packing-station guidance.
- **Carrier Management** — carrier rate shopping, label generation, customs
  documentation and delivery-promise calculation across contracted carriers.
- **Returns Processing** — RMA intake, return-label issuance, inbound
  inspection and restock-or-refurbish disposition.
