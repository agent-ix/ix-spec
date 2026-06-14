---
id: entity-001
title: "Customer"
artifact_type: entity
---
<!-- entity authoring skeleton (spec-objects-business). Fill every section with
     substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type: entity.
     - "## Properties" (H2, required): the entity's identity field plus each
       attribute with type and meaning. -->
# [entity-001] Customer

## Properties

- **customer_id** (`uuid`, identity) — stable identifier assigned at
  registration; all cross-aggregate references use this id.
- **email** (`string`) — unique contact address; verified before the first
  order may be placed.
- **display_name** (`string`) — name shown on order confirmations and
  shipping labels.
- **default_shipping_address** (`Address`) — value object copied onto new
  orders as the proposed delivery address.
- **status** (`enum: active | suspended | closed`) — suspended customers may
  view orders but may not place new ones.
