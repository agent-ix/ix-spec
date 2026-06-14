---
id: repository-001
title: "OrderRepository"
artifact_type: repository
---
<!-- repository authoring skeleton (spec-objects-business). Fill every section
     with substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type: repository.
     - "## Operations" (H2, required): each operation with signature,
       behaviour, and failure semantics; the repository loads and saves whole
       aggregates only. -->
# [repository-001] OrderRepository

## Operations

- **get(order_id) -> Order** — load the full Order aggregate (root plus all
  order lines) in one consistent read; raises `OrderNotFound` when no order
  carries that id.
- **save(order) -> None** — persist the whole aggregate atomically using
  optimistic concurrency on the order's `version`; raises
  `ConcurrentModification` when the stored version has advanced.
- **next_identity() -> OrderId** — allocate a new unique order id without
  touching any aggregate state.
- **find_by_customer(customer_id, page) -> list[OrderSummary]** — return
  read-only summaries (id, status, grand_total, placed_at) for the
  customer's orders, newest first; never returns partially hydrated
  aggregates.
