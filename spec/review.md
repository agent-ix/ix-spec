---
id: REV-001
title: quoin Phase 0 Review
type: Review
---

# quoin Phase 0 Review

## Scope

Review of the Phase 0 spec **overhaul** — a complete, code-faithful backport of
`src/` (`cli`, `catalog`, `write`, `plugins`, `modules`, `flows`). The prior
coarse FR-001…FR-011 set was superseded by a capability-grouped FR-001…FR-021 /
NFR-001…NFR-006 set; user stories were re-traced and US-006 (duplicate
detection) was added; the test matrix was regenerated against `tests/`.

## Automated Checks

- **ID format & sequence:** `FR-001…FR-021`, `NFR-001…NFR-006`, `US-001…US-006`
  — all 3-digit, sequential, no gaps or duplicates. No malformed IDs (no `FR-1`
  / `US-12` forms).
- **Link integrity:** every `US → FR` `traces_to` target (FR-010/011/012/013/
  014/015/017/018/019/020/021) resolves to a declared FR.
- **Quire validation:** `quire validate --scope . "spec/**/*.md"` exits 0.
- **Test suite:** `make test` → 97 passed (9 files).

## Checklist Results

- ✅ ID format/uniqueness — pass (see Automated Checks).
- ✅ US "As a / I want / So that" — all six now use the bold-marker shape the
  `spec-artifacts-iso` US archetype asserts (US-002…US-005 were prose, fixed).
- ✅ FR clarity/specificity — each FR names concrete inputs, outputs, and
  observable behavior (flags, exit codes, file paths, error text).
- ✅ FR → behavior verifiable — every FR/NFR maps to a named `tests/` case in
  `spec/matrix.md`.
- ✅ Error paths documented — unknown command/subcommand, missing repo_dir,
  unknown type, missing/empty manifest name, non-zero/signal ix-flow exit,
  spawn error.
- ⚠️ US acceptance criteria — only US-001 and US-006 carry Given/When/Then
  examples; US-002…US-005 do not. Accepted: the ISO US archetype treats
  acceptance examples as _illustrative, non-normative_, and verification lives
  in the matrix, not in the US. Noted for completeness, non-blocking.

## Findings

1. **Open coverage gap (FR-017) — action item.** `pnpm run test:coverage`
   fails the declared 100% gate at 99.61% lines / 98.24% funcs. The sole gap is
   the `(p) => p.name` mapping at `cli.ts:322` in `plugin ensure-defaults`,
   reached only when the registry is non-empty; the existing test runs against
   an empty registry. **Action:** add an `ensure-defaults` test that seeds ≥1
   plugin and asserts the reported `plugins` array. (`make test` itself is
   green; only the coverage script is red.)

2. **Framework FRs are intentionally not US-traced.** FR-001…FR-009 and FR-016
   describe CLI-framework and catalog-assembly mechanics (arg grammar, version,
   help, config root, module-root location, dedup, manifest parsing, the
   committed default set). They are enabling requirements with no standalone
   user story and are covered directly by the matrix → `tests/`. This is an
   accepted structure, not a traceability gap.

3. **Scope boundaries are explicit and match code.** Validation execution
   (`quire`), workflow lifecycle (`ix-flow`), and install/registry mechanics
   (`ts-plugin-kit`) are stated Out of Scope and are invoked as external
   processes / delegated calls — consistent with `flows.ts` (spawns `ix-flow`),
   `write.ts` (emits, does not run, the `quire` command), and `plugins.ts`
   (delegates to `ts-plugin-kit`). NFR-004 captures the standalone-dependency
   boundary.

4. **`package:`/npm source is forward-declared.** FR-018 and US-003 correctly
   state that `package:` maps to an npm source that `ts-plugin-kit` rejects at
   install time; quoin only maps the argument. Behavior matches
   `plugins.ts:parseSourceArg`.

5. **Doc drift (out of spec scope).** Repo `CLAUDE.md` still says
   `make test # run jest`; the project runs vitest. Flagged for a follow-up
   doc fix; no spec change required.

## Analysis Lenses (spec-integrity + spec-failure-domain)

Both lenses from the `spec-review` process were run against `spec.md` + `src/`:

**Integrity (completeness / consistency / atomicity):**

- ✅ Multi-source lookup tie-break is an explicit decision — FR-008 (first-wins
  by module name / resolved root) and FR-012 (duplicate type detection).
- ✅ Forward-declared dependency (`package:`/npm) documents its interim
  behavior — FR-018 (rejected by ts-plugin-kit at install time).
- ➕ **External-CLI probe (fixed):** FRs delegate to `ix-flow`/`quire` with no
  invocation contract. Added **NFR-007** (PATH resolution, no version pin in
  Phase 0, absence/non-zero surfaces as non-zero exit, `quire` emitted not run).
- ⚠️ **No StR layer (accepted).** Stakeholder intent is not derivable from code;
  reverse-engineering an StR set would be fabrication. User stories carry the
  stakeholder framing informally. A real StR layer is deferred to a phase with
  product input — not a code-backport task.
- ⚠️ **Atomicity (accepted).** FR-011 (list/show), FR-012 (detect/validate),
  FR-019 (install/list/remove), and FR-021 (spawn/exit/handoff) each bundle a
  small command family. Kept grouped for readability; each sub-behavior still
  has its own named test in `spec/matrix.md`. Splitting is a future option.

**Failure domain (extension / identity / purity / topology):**

- ✅ Entity identity keys are all explicit — module by `name`, catalog entry by
  `kind:name`, module root by resolved path, registry plugin by `name`.
- ✅ Topology/purity: catalog assembly is a flat, one-level-deep filesystem scan
  with guaranteed termination and no user-evaluated logic — no cycle or
  deep-nesting exposure.
- ➕ **Extension-point failure policy (fixed + flagged):** a corrupt installed
  `manifest.yaml` aborts _all_ catalog operations (strict), while a missing one
  is skipped. Captured as **NFR-008**. Open design question: strict-abort means
  one bad module blocks even `catalog list`; a resilient skip-and-warn may be
  better UX. Flagged for a product decision; current behavior documented as-is.

## Findings (analysis)

6. **NFR-008 strict-abort is untested — action item.** The skip-on-missing path
   is tested; the abort-on-malformed-manifest path is not. Add a corrupt-manifest
   fixture asserting the throw.
7. **External-tool versions unpinned (NFR-007) — known limitation.** `ix-flow`
   and `quire` are resolved from `PATH` with no minimum-version check. Acceptable
   for Phase 0; revisit when either tool's CLI contract changes.

## Gate

**Accepted with action items, ready to commit.** The spec is a faithful backport
of current behavior, validates under Quire, and every requirement traces to a
real test. No blocker is a _spec_ defect — the open items are test gaps and
known limitations:

- Finding 1 (FR-017 coverage gap) and Finding 6 (NFR-008 untested) are **test**
  gaps, not spec gaps — they belong to the implementation, recorded here for the
  backlog.
- Findings 2–5, 7 and the StR/atomicity notes are accepted properties or
  documented limitations.

The spec accurately reflects `src/` as of this review and is safe to commit; the
two test gaps should be closed before a release gate.
