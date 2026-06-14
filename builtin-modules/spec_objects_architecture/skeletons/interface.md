---
id: interface-001
title: "QuantCodec scoring contract"
artifact_type: interface
---
<!-- interface authoring skeleton (spec-objects-architecture). Fill every
     section with substantive content. Contract (manifest body_extraction
     asserts):
     - Frontmatter MUST carry id, title, artifact_type; artifact_type is
       interface (quire resolves the archetype from it).
     - "## Contract" (H2, required): MUST contain a fenced ```yaml code
       block holding the language-neutral operations contract — name,
       associated types, operations (name/inputs/output/semantics),
       invariants. Design-level YAML, NOT source code.
     - Implementations are NOT enumerated here: each implementation is its
       own FR linked via an `implements` relationship edge. Heavy
       selection/dispatch machinery belongs in a `process` object.
     - Boundary: `interface` covers contracts WITHIN the system; a contract
       with an external system is an `external_contract`.
     - Keep headings unique per level. -->
# [interface-001] QuantCodec scoring contract

## Contract

```yaml
name: QuantCodec
associated_types: [PreparedQuery]
operations:
  - name: prepare_ip_query
    inputs: [query vector, dimension]
    output: PreparedQuery
    semantics: one-time query-side transform, amortized across candidates
  - name: score_ip_candidate
    inputs: [PreparedQuery, candidate payload]
    output: approximate inner-product score
    semantics: single-candidate scoring; exact fallback allowed
  - name: score_ip_batch
    inputs: [PreparedQuery, candidate payloads]
    output: scores (one per payload, same order)
    semantics: block-kernel entry point; len(out) == len(payloads)
invariants:
  - payload_len is constant for a built index
  - batch and single-candidate scores agree within quantization error
dispatch: by codec_kind label recorded at index build
```
