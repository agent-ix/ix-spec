---
id: aggregate-root-001
title: "Order"
artifact_type: aggregate_root
---
<!-- aggregate_root authoring skeleton (spec-objects-business). Fill every
     section with substantive content. Contract (manifest body_extraction
     asserts):
     - Frontmatter MUST carry id, title, artifact_type: aggregate_root.
     - "## Members" (H2, required): everything inside the consistency
       boundary — the root, nested entities, owned value objects — and the
       invariants the root enforces over them. -->
# [aggregate-root-001] Order

## Members

- **Order** (root) — identified by `order_id`; the only member addressable
  from outside the aggregate and the single entry point for all mutations.
- **OrderLine** (nested entity, 1..n) — one per purchased product, identified
  by `line_number` local to the order; created, amended, and removed only
  through Order methods.
- **Money: subtotal, shipping_fee, grand_total** (owned value objects) —
  recomputed by the root whenever a line changes.
- **ShippingAddress** (owned value object) — frozen at the moment the order
  is placed.

Invariants enforced by the root: an order carries at least one line while
placed; `grand_total` always equals the sum of line totals plus
`shipping_fee`; lines may only be amended while the order is in the `Draft`
state; all members share one transaction, so the aggregate is loaded and
persisted as a whole.
