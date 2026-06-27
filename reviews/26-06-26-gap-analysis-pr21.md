---
id: SR-001
title: "Gap-analysis review of the update-registry + versioning change (Task-010)"
type: SpecReview
analysis: gap-analysis
scope: "spec/plan.md PL-001 Task-010; FR-002; FR-022; spec/matrix.md TM-001"
review_set: subset
relationships:
  - target: "ix://agent-ix/quoin/PL-001"
    type: "reviews"
  - target: "ix://agent-ix/quoin/TM-001"
    type: "references"
---

## Summary

Post-implementation gate over the FR-022 self-update registry default plus the
truthful-versioning and release-drift work (PL-001 Task-010, PR #21). The plan is
complete and FR-022 is faithfully implemented and matrix-backed. The gate found one
`high` spec-faithfulness gap (version resolution changed without updating FR-002) and
one `medium` untracked test — **both remediated within PR #21** (see Remediation). One
`low` note (the release-drift CI guard) is accepted as out-of-scope process tooling.

## Verdict

**FAIL at review time → remediated to PASS in PR #21.** FND-001 (high) and FND-002
(medium) are fixed in the same PR; FND-003 (low) is accepted as out-of-scope. The
Findings table below records the gate's original findings for the audit trail.

## Remediation (applied in PR #21)

- **FND-001:** FR-002 Description, Behavior, and a new **FR-002-AC-4** now specify
  "prefer the build-time baked `git describe` version; fall back to `package.json`."
- **FND-002:** `tests/version.test.ts` added to the FR-002 Test Matrix row.
- **FND-003:** accepted — the release-drift guard is CI/release tooling, intentionally
  not modeled as a product requirement.

## Findings

| ID      | Severity | Summary                                                                                                                                                                                                         | Refs   |
| ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| FND-001 | high     | `packageVersion()` now prefers a build-time baked `git describe` value; FR-002 mandates reading from `package.json` and never describes baked/drift versioning — spec-faithfulness gap + underspecified feature | FR-002 |
| FND-002 | medium   | `tests/version.test.ts` ("resolveVersion") is not registered in the Test Matrix FR-002 row — untracked test                                                                                                     | TM-001 |
| FND-003 | low      | `.github/workflows/release-drift.yml` CI guard has no owning StR/US/FR/NFR (release-process tooling)                                                                                                            | -      |

## Coverage

- **Plan completion (Step 1): PASS.** PL-001 Task-001…Task-010 are all `Done`; no
  blocked/incomplete tasks or stale checkboxes.
- **Matrix verification (Step 2): partial.** FR-022 is backed by `update.test.ts`
  (4 cases; names match the matrix row, incl. the new public-npm default case). quoin
  maps requirement→test by `file :: "test name"` rather than `FR-xxx-AC-x` code tags, so
  "backing" = a named test exists. Gap: `tests/version.test.ts` exists but is absent from
  the matrix (FND-002).
- **Underspecified code (Step 3):** the baked-version path (`resolveVersion`,
  `__QUOIN_VERSION__`, `vite.config.ts` `gitVersion`) changes FR-002 behavior with no
  owning/updated requirement (FND-001); the release-drift guard is unowned process tooling
  (FND-003). The FR-022 registry default and `DEFAULT_UPDATE_REGISTRY` are correctly owned
  by FR-022.
- **Semantic review (Step 4): not run** (optional; pending user opt-in).

### Remediation to clear FAIL → PASS

1. Update **FR-002** (Description/Behavior + an AC) to specify: resolve the version from the
   build-time baked `git describe` value when present, falling back to `package.json`;
   include the new test in `update`/`version` AC verification.
2. Add `tests/version.test.ts` to the **FR-002** matrix row.
3. Optionally introduce an NFR (or note) covering the release-drift guard, or record it as
   intentionally out of spec scope.
