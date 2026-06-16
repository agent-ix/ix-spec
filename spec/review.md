---
id: Review-001
title: ix-spec Phase 0 Review
type: Review
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

## Findings

- FR-006 / US-005 (RESOLVED): `tests/flows.test.ts` now exercises `src/flows.ts`
  (`specFlowNames`/`startSpecFlow`/`resolveSkillPath`/`runIxFlow`) with a real
  fake `ix-flow` binary covering exit-0 / non-zero / signal / spawn-error and the
  packaged + legacy skill layouts; `cli.test.ts` covers spec-flow dispatch.
- Coverage gate (RESOLVED): `pnpm run test:coverage` now **passes at 100%**
  (branches/functions/lines/statements). Two genuinely-unreachable defensive
  branches in `src/cli.ts` (`helpFor` `?? ""`, `arrayFlag` string-case) were
  removed rather than ignore-pragma'd, per the no-pragma coverage rule.
- NFR-003: the "no git once installed and pinned" lazy short-circuit is correct
  in code; reconcile idempotence is exercised across fixture-sharing tests. A
  dedicated double-call assertion remains a nice-to-have (non-blocking).
- US artifacts carry no Given/When/Then acceptance criteria or Priority — an
  accepted property of this lightweight Phase 0 spec, noted for completeness.
- Repo `CLAUDE.md` says `make test` "runs jest"; the project actually runs
  vitest. Out of scope for spec/ edits, flagged for a follow-up doc fix.
- FR-012 / FR-013 (2026-06-16, OKF backsync): reserved `index`/`log` authoring
  was verified to flow through the generic `write --types` catalog path with **no
  reserved-name allowlist** in `src/` (grep-confirmed; `spec-artifacts-iso`
  declares both as artifact types with skeletons + schemas). FR-012 is unit-
  covered by `write.test.ts`. FR-013 (Review): OKF bundle/index-completeness
  validation lives entirely in quire (`quire validate --okf` / `--scope`);
  `src/write.ts` only emits the `--scope` command and ships no completeness lint —
  boundary confirmed by inspection. README gained "New features (OKF)" and
  "Plugin / module system" sections; `skills/specify/SKILL.md` documents `type`
  required + typed `description`/`tags` and points completeness at `quire validate
--okf`. No `default-modules.yaml` version/ref pins changed (one comment note
  only; modules re-researched separately).

## Gate

Phase 0 accepted. Spec content matches current behavior; the prior FR-006/US-005
flow-test gap and the coverage-gate mismatch are both resolved (100% coverage,
`flows.ts` unit-tested).
