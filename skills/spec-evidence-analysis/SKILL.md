---
name: spec-evidence-analysis
description: Define verification methods and evidence artifacts for requirements.
---

# Verification & Evidence Strategy

Make sure every requirement has a defined verification method and a concrete artifact that proves it was verified.

## When to use

- After requirements are written but before `spec-matrix` builds the test matrix.
- During `spec-review` when "how do we know this is satisfied?" is unclear.
- Whenever a new NFR is added (NFRs are most prone to missing evidence).

## Verification methods (ISO/IEC/IEEE 29148)

| Method | Use when |
|--------|----------|
| `test` | The requirement is exercisable by automated or manual test execution. Default. |
| `analysis` | The requirement is proven by calculation, modeling, or static reasoning (e.g. complexity bound, cryptographic argument). |
| `inspection` | The requirement is satisfied by visual or structural review of the artifact (e.g. license headers, doc presence). |
| `demonstration` | The requirement is satisfied by observing operation in a realistic environment without instrumentation (e.g. UX flow walkthrough). |

## Evidence artifacts

| Artifact | Pairs with |
|----------|------------|
| `test_case` | `test` — points to a TC-XXX file or test path |
| `analysis_report` | `analysis` — points to a doc/notebook |
| `inspection_checklist` | `inspection` — points to a checklist file |
| `demo_recording` | `demonstration` — points to a recording or scripted walkthrough |
| `metric` | any — observability metric that proves runtime behavior |
| `log` | any — log event proving the path executed |

**Rule**: Every implementation task MUST cite at least one evidence artifact. A task with no evidence is unfinishable.

## Process

1. **Tag every FR/StR/NFR** with `verification_method` and `evidence` fields in its frontmatter.
2. **Resolve "test" defaults**: if an FR is tagged `test`, the matching test case must already exist or be queued in `spec-matrix`.
3. **Resolve non-test methods**: for `analysis`/`inspection`/`demonstration`, name the artifact path explicitly. No "TBD".

## Deliverable template

Per-requirement frontmatter (add to existing FR/StR/NFR files):

```yaml
verification_method: test          # test | analysis | inspection | demonstration
evidence:
  - kind: test_case
    ref: tests/integration/test_login.py::test_invalid_credentials
  - kind: metric
    ref: auth_failure_total
```

Summary deliverable in `spec/analysis/evidence.md`:

```markdown
# Verification & Evidence Summary

| Req | Method | Artifact |
|-----|--------|----------|
| FR-003 | test | tests/integration/test_login.py::test_login_happy_path |
| FR-010 | analysis | docs/analysis/storage-bound.md |
| NFR-002 | demonstration | docs/demos/uptime-walkthrough.md |
| NFR-005 | test + metric | tests/perf/test_p99_latency.py, metric `http_request_duration_seconds` |

## Open gaps

None.
```

## Acceptance Criteria

- Every FR/StR/NFR has both `verification_method` and at least one `evidence` entry.
- No `evidence: TBD`, no missing refs.
- The summary table has zero open gaps before `spec-to-plan` is invoked.
