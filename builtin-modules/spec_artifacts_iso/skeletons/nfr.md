---
id: NFR-001
title: "Import throughput under sustained load"
artifact_type: NFR
quality_attribute: performance_efficiency
relationships:
  - target: "ix://agent-ix/example/FR-001"
    type: "constrains"
---
<!-- NFR authoring skeleton (spec-artifacts-iso). Fill every section with
     substantive content. Contract (manifest body_extraction asserts):
     - REQUIRED (level 2): Statement, Measurement and Evaluation (with
       table), Verification.
     - OPTIONAL (level 2): Scope, Rationale, Acceptance Criteria,
       Dependencies.
     - `quality_attribute` lives in FRONTMATTER as an ISO 25010 enum
       (see schemas/nfr-frontmatter.schema.json); the old
       `## Quality Attribute` body section is retired.
     - Measurement and Evaluation table headers MUST be exactly:
       Metric | Target | Threshold | Method with ≥1 data row. The table
       IS the NFR's acceptance-criteria equivalent; use the optional
       Acceptance Criteria section only for policy NFRs whose
       compliance checks don't reduce to metrics.
     - Keep headings unique per level; nest ≤2 levels below the H1 title
       (through H3). -->
# [NFR-001] Import throughput under sustained load

## Statement

The system SHALL sustain at least 500 artifact imports per second at p95 latency
under or equal to 200 ms during a 10-minute sustained-load window.

## Scope

- Applies to: the artifact import ingestion path.
- Operational context: steady-state production load with warm caches.

## Rationale

Ingestion is on the critical path for downstream indexing; sustained throughput
bounds the end-to-end freshness SLA committed to consumers.

## Measurement and Evaluation

| Metric | Target | Threshold | Method |
|--------|--------|-----------|--------|
| Import throughput | 600 imports/s | 500 imports/s | Load Benchmark |
| Import p95 latency | 120 ms | 200 ms | Load Benchmark |

## Verification

A repeatable load benchmark drives the ingestion path for 10 minutes and asserts
the measured throughput and p95 latency stay within threshold.

## Acceptance Criteria

Optional — the Measurement table above is the acceptance-criteria equivalent for
measurable NFRs. Use this section for policy NFRs whose compliance checks don't
reduce to metrics (e.g. "evidence artifacts live under the owning packet").

## Dependencies

- **Upstream**: FR-001 checksum verification on import
- **Downstream**: capacity-planning runbook
