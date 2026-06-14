---
id: nested-entity-001
title: "OrderLine"
artifact_type: nested_entity
---
<!-- nested_entity authoring skeleton (spec-objects-business). Fill every
     section with substantive content. Contract (manifest body_extraction
     asserts):
     - Frontmatter MUST carry id, title, artifact_type: nested_entity.
     - "## Parent" (H2, required): the owning aggregate root, the local
       identity scheme, and how the parent mediates every mutation. -->
# [nested-entity-001] OrderLine

## Parent

OrderLine belongs to the **Order** aggregate root (`aggregate-root-001`). An
order line is identified by `line_number`, which is unique only within its
parent order — there is no global OrderLine identity and no repository for
order lines. External callers reference a line as the pair
(`order_id`, `line_number`). All lifecycle operations go through the parent:
`Order.add_line(product_id, quantity, unit_price)`,
`Order.change_quantity(line_number, quantity)`, and
`Order.remove_line(line_number)`. The parent recomputes its totals and
re-checks its invariants on every line mutation, and deleting the Order
deletes its lines with it.
