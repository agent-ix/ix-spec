---
id: enumeration-001
title: "Order state vocabulary"
artifact_type: enumeration
---
<!-- enumeration authoring skeleton (spec-objects-business). Fill every
     section with substantive content. Contract (manifest body_extraction
     asserts):
     - Frontmatter MUST carry id, title, artifact_type: enumeration.
     - "## Values" (H2, required): a table with headers exactly
       Value | Description and at least one data row — the controlled
       label vocabulary itself.
     - Use this kind for system-wide label sets (codec kinds, surface
       labels, state names, step kinds) that other artifacts reference by
       exact string; a DDD value object with behavior belongs in
       `value_object` instead.
     - Keep headings unique per level. -->
# [enumeration-001] Order state vocabulary

The canonical order lifecycle states. Persisted in `orders.state`, reported
in metrics labels, and matched exactly by the fulfilment saga — additions
require a migration note.

## Values

| Value | Description |
|-------|-------------|
| reserving | Stock reservation in flight; order not yet binding |
| backordered | One or more lines unavailable; awaiting stock |
| capturing | Payment capture requested at the authorised amount |
| picking | Warehouse pick-and-pack job dispatched |
| shipped | Carrier handover confirmed; terminal success state |
| failed | Capture declined or compensation completed; terminal |
