---
id: Review-001
title: ix-spec Phase 0 Review
artifact_type: Review
---

# ix-spec Phase 0 Review

## Scope

Backsync review after the default-module set moved from a vendored
`builtin-modules/` tree to a lazy marketplace install via
`@agent-ix/ts-plugin-kit` (commit "feat: install default modules via
ts-plugin-kit instead of vendoring"). FR-001/FR-002 reworded; FR-009/FR-010/FR-011
and NFR-003 added; use cases and test matrix re-traced to the current code and
`tests/`.

## Findings (resolved)

- FR-001 / FR-002 rewording matches `src/modules.ts` (`ensureDefaultModules`,
  `reconcile` mode `lazy`) and `src/plugins.ts` (registry at
  `~/.ix/filament/registry.json`, install delegated to ts-plugin-kit). Verified.
- FR-009 "pinned to a tag" softened: `default-modules.yaml` `spec-artifacts-app`
  has no `ref:` (pins to default branch). FR now allows a default-branch pin
  where no release tag exists.
- FR-010 / US-003 corrected: ix-spec only _maps_ the source argument and hands
  off to ts-plugin-kit; the unsupported-`package:`/npm error is thrown by
  ts-plugin-kit's `resolveSource` at install time, not by ix-spec. Wording now
  attributes the error correctly.
- FR-011 ordering (`IX_SPEC_MODULE_PATHS` then `~/.ix/filament/modules`) matches
  `src/catalog.ts:defaultModuleRoots`; shared store read by quire-rs documented.
- US-001 now also `traces_to` FR-001 (lazy default-module install is a stated
  dependency of the authoring flow).
- Cross-references: all US→FR links resolve; all matrix test names match
  `test(...)` names in `tests/index.test.ts` / `tests/scripts.test.ts` verbatim.

## Findings (flagged, not blocking Phase 0)

- FR-006 / US-005: no unit test exercises `src/flows.ts`
  (`specFlowNames`/`startSpecFlow`/`resolveSkillPath`); workflow launch is only
  covered by the eval harness (EV-005/EV-013). Marked ❌ Missing in the matrix.
  Recommended: a `specFlowNames()` / `resolveSkillPath` unit test (no `ix-flow`
  spawn needed).
- NFR-003: the "no git once installed and pinned" invariant is correct in code
  (ts-plugin-kit lazy short-circuit) but has no dedicated double-call /
  no-network assertion. Recommended: a test calling `ensureDefaultModules` twice.
- Coverage gate: `vite.config.ts` declares 100% v8 thresholds, but actual
  coverage is ~47% statements / ~50% lines (pre-existing). `make test`
  (`vitest run`) does not enforce the threshold and passes;
  `pnpm run test:coverage` enforces it and fails. Not introduced by this change.
- US artifacts carry no Given/When/Then acceptance criteria or Priority — an
  accepted property of this lightweight Phase 0 spec, noted for completeness.
- Repo `CLAUDE.md` says `make test` "runs jest"; the project actually runs
  vitest. Out of scope for spec/ edits, flagged for a follow-up doc fix.

## Gate

Phase 0 accepted. Spec content matches current behavior; two flagged test gaps
(FR-006/US-005 flow tests, NFR-003 idempotence assertion) and the pre-existing
coverage-gate mismatch are tracked for follow-up but do not block acceptance.
