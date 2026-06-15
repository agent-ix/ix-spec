# Domain Type Decision Guide

When an FR defines a domain object, set the `object:` frontmatter field and use the matching template.

## Business Objects (spec-objects-business)

- `entity` / `aggregate_root` / `nested_entity`: Data entity, model, or aggregate → `assets/business/entity-template.md`
- `value_object`: Immutable value type or enum → `assets/business/value-object-template.md`
- `event`: Domain events emitted by a service → `assets/business/event-template.md`
- `process`: End-to-end process spanning multiple FRs → `assets/business/process-template.md`
- `state_machine`: Lifecycle with states/transitions → `assets/business/state-machine-template.md`
- `repository`: Data access layer for an entity → `assets/business/repository-template.md`
- `domain`: Bounded context definition (`## Bounded Context` is the required kernel; entities are SEPARATE `entity` FRs linked via `contains` edges — the `## Entities` list is an optional summary) → `assets/business/domain-template.md`
- `enumeration`: Controlled label vocabulary other artifacts reference by exact string (state names, codec kinds, metric labels) → `assets/business/enumeration-template.md`

## Architecture Objects (spec-objects-architecture)

- `api_endpoint`: REST/HTTP endpoint (routes live INSIDE `## Endpoint` — there is no separate Routes section) → `assets/architecture/api-endpoint-template.md`
- `queue`: Message queue or topic → `assets/architecture/queue-template.md`
- `data_schema`: Database table / JSON-shaped schema → `assets/architecture/data-schema-template.md`
- `binary_format`: Persisted BINARY layout (offsets/sizes/endianness as a `## Layout` YAML block — JSON Schema can't express these) → `assets/architecture/binary-format-template.md`
- `interface`: Operations contract WITHIN the system (trait / TS interface / ABC / port; the whole plugin/codec/driver space). `## Contract` YAML block; implementations link via `implements` edges, never enumerated inline → `assets/architecture/interface-template.md`
- `external_contract`: Contract with an EXTERNAL system (vendor, peer service whose contract this repo does not own) → `assets/architecture/external-contract-template.md`
- `extension_point`: Pluggability as a first-class node (registration + stability guarantees around a published interface) → `assets/architecture/extension-point-template.md`
- `action`: Command/action (CLI, job, task) → `assets/architecture/action-template.md`
- `ui_component`: UI component with props → `assets/architecture/ui-component-template.md`
- `page`: Full page, route, or view → `assets/architecture/page-template.md`
- `dto`: API request/response schema (Pydantic/Zod model) → `assets/architecture/dto-template.md`
- `middleware`: Cross-cutting concern (auth, logging, validation) → `assets/architecture/middleware-template.md`

## Operational Objects (spec-objects-operational)

- `configuration`: Configuration parameters / env vars → `assets/operational/configuration-template.md`
- `migration`: Database migration → `assets/operational/migration-template.md`
- `hook`: Lifecycle event (startup, shutdown, pre/post) → `assets/operational/hook-template.md`
- `job`: Scheduled or recurring task → `assets/operational/job-template.md`

## Standard Behavioral FR

If the FR does not define a domain object, omit the `object:` field and use `assets/functional-requirement-template.md`.

## Tags (Discovery Dimensions)

Tags are cross-cutting concerns — they define how an FR is **used** or **discovered**, not what it structurally IS. Set tags in the `tags:` frontmatter field.

> **Important**: `integration` is a **tag**, not an object type. Never use `object: integration`. (The legacy `integration` object type was removed from spec-objects-architecture v0.2.0 — internal contracts are `interface`, external-system contracts are `external_contract`, and service-client FRs use `calls`/`consumes` relationship edges.)

Common tags:
- `integration`: Consumer-facing integration contracts, SDKs, connection guides → appears in Integration tab
- `consumer-facing`: Endpoints or APIs intended for external consumers
- `internal`: Internal service-to-service contracts
- `security`: Security-critical functionality → appears in Security tab

Example: An FR for an integration guide with no structural object:
```yaml
---
id: FR-007
title: "Consumer Integration Contract"
artifact_type: FR
tags: [integration]
---
```

Example: An endpoint that is both structural and consumer-facing:
```yaml
---
id: FR-001
title: "Login Endpoint"
artifact_type: FR
object: api_endpoint
tags: [consumer-facing]
---
```

## Semantic Graph Linkages (Verbs vs Nouns)

The spec ecosystem uses a strictly typed relationship graph to link specifications.

The domain objects defined above act as the **Nouns** (Nodes) in the graph. The connections between them must be pure **Verbs** (Edges), defined in the `relationships:` array of the YAML frontmatter.

> **CRITICAL**: Do NOT bake the noun into the verb! (e.g., do not use `publishes_event` or `uses_api`). The database already knows the target is an `event` or an `api_endpoint` based on its domain type. 

### Valid Relationship Verbs
When linking specs, you must use one of the following strict semantic primitives:

**1. Operational & Flow:**
- `calls`: Synchronous invocation (e.g., an endpoint `calls` an external API).
- `publishes`: Asynchronous emission (e.g., a process `publishes` a domain event).
- `consumes`: Asynchronous reception (e.g., a worker process `consumes` a domain event).
- `triggers`: Process initiation (e.g., a scheduler `triggers` a job or macro-flow).

**2. Data & State:**
- `reads`: Safe, read-only data consumption (e.g., a component `reads` an entity).
- `writes`: Mutating data access (e.g., an endpoint `writes` an entity).

**3. Contracts & Constraints:**
- `requires`: Security and configuration bounds (e.g., an endpoint `requires` a specific permission scope or configuration).
- `implements`: Interface/contract fulfillment.
- `specifies`: An object FR providing the normative definition of structure/contract a behavioral FR relies on (e.g., a `binary_format` FR `specifies` the storage FR that writes it). Use this — not `references` — for the object-FR → behavioral-FR edge.

**4. Generic Structure:**
- `depends_on`: Library/package dependencies. NOTE: as a frontmatter FIELD, `depends_on:` is reserved for `spec.md` (master-requirements), where it is the repo-level dependency manifest. At artifact level always author the explicit `relationships:` array — bare-ID sugar fields are read-side ingestion tolerance only.
- `contains`: Composition (e.g., UI component `contains` sub-components, Aggregate Root `contains` Entities, a `domain` `contains` its entity FRs).
- `transitions_to`: State machine flows.
- `references` / `related_to`: Loose general linkages (use only if no specific verb applies).

## Acceptance-Criteria Verification Vocabulary

AC table `Verification` cells use the ISO 29148 methods — `Inspection`,
`Analysis`, `Demonstration`, `Test` — optionally annotated with test-case
references, e.g. `Test (TC-035)`. Checked by the `ac-verification-method`
lint rule (`quire lint`); spec-only artifacts legitimately carry
`Inspection`/`Analysis` until implementation upgrades them to `Test (TC-xxx)`.
