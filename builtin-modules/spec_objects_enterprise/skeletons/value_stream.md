---
id: VS-001
title: "Order to Delivery"
artifact_type: value_stream
---
<!-- value_stream authoring skeleton (spec-objects-enterprise). Fill every
     section with substantive content. Contract (manifest body_extraction
     asserts):
     - Frontmatter MUST carry id, title and artifact_type: value_stream.
     - An H2 "Stages" section is required; its body must list the stages in
       order with the value each stage adds (no TODO/TBD/placeholder text, no
       template variables). -->
# [VS-001] Order to Delivery

The Order to Delivery value stream traces a customer order from checkout
confirmation to doorstep delivery. Its triggering stakeholder is the storefront
customer; the value received is the ordered goods arriving within the promised
delivery window.

## Stages

1. **Order Capture** — checkout confirms payment authorization and records the
   delivery promise shown to the customer.
2. **Fulfillment Planning** — the order is sourced to a fulfillment center and
   inventory is hard-reserved against the promise date.
3. **Pick and Pack** — warehouse staff pick the items, pack them and apply the
   carrier label produced by rate shopping.
4. **Carrier Handoff** — packages are manifested and tendered to the selected
   carrier at the scheduled pickup.
5. **In-Transit Tracking** — carrier scans update the customer-facing tracking
   page and feed the delivery-promise model.
6. **Delivery Confirmation** — proof of delivery closes the order and starts
   the returns-eligibility clock.
