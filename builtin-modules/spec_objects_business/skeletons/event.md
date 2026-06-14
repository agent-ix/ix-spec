---
id: event-001
title: "OrderPlaced"
artifact_type: event
---
<!-- event authoring skeleton (spec-objects-business). Fill every section with
     substantive content. Contract (manifest body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type: event.
     - "## Schema" (H2, required) MUST contain a fenced code block with
       language `json` holding the event's JSON Schema payload contract. -->
# [event-001] OrderPlaced

OrderPlaced is published by the Order aggregate when a draft order is placed.
It is the integration contract consumed by Inventory (stock reservation),
Payments (capture), and Notifications (order confirmation).

## Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://specs.agent-ix.dev/events/order-placed.schema.json",
  "title": "OrderPlaced",
  "type": "object",
  "required": ["event_id", "occurred_at", "order_id", "customer_id", "lines", "grand_total"],
  "properties": {
    "event_id": { "type": "string", "format": "uuid" },
    "occurred_at": { "type": "string", "format": "date-time" },
    "order_id": { "type": "string" },
    "customer_id": { "type": "string" },
    "lines": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["line_number", "product_id", "quantity"],
        "properties": {
          "line_number": { "type": "integer", "minimum": 1 },
          "product_id": { "type": "string" },
          "quantity": { "type": "integer", "minimum": 1 }
        }
      }
    },
    "grand_total": {
      "type": "object",
      "required": ["amount", "currency"],
      "properties": {
        "amount": { "type": "string", "pattern": "^-?\\d+\\.\\d{2}$" },
        "currency": { "type": "string", "minLength": 3, "maxLength": 3 }
      }
    }
  }
}
```
