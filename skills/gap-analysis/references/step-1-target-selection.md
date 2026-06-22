# Step 1: Target Selection

**Goal**: Resolve exactly what this run audits — one plan bundle, its spec, its Test
Matrix — and the `ix://` identity used in the output artifact.

## Process

### 1. Resolve the target plan

Mirror `spec-to-plan/references/step-0-plan-selection.md`:

1. **Named in context?** If the user passed a plan id (`Plan-002`) or one was established
   earlier this session, use it.
2. **Otherwise discover.** Glob `plan/*/plan.md`, read each frontmatter `id`/`title`/`status`,
   and present the list:

   ```
   Plans available to gap-analyze:
   - Plan-001  electron-hello core app    (active)
   - Plan-002  packaging & distribution   (active)
   ```

   Ask which one. One run targets **one** bundle.

### 2. Locate the spec and Test Matrix

- **Spec root.** Single-repo: `spec/`. Multi-repo: `specs/<category>/<component>/spec/`.
- **`org` / `component`.** Read from `spec/spec.md` frontmatter (`org`, `name`). These build
  the `ix://<org>/<component>/<id>` URIs used in the SpecReview `relationships:`.
- **Test Matrix.** Look for `spec/matrix.md` first, then `spec/tests.md` (both names are in
  use across the ecosystem). Note its frontmatter `id` (e.g. `TestMatrix-001` / `TM-001`)
  for the `references` edge.
- **Requirements.** Note the requirement files under `spec/functional/`,
  `spec/non-functional/`, `spec/usecase/`, `spec/stakeholder/` — Steps 3 and 4 trace against
  these ids.
- **Source / test trees.** Identify where implementation and tests live (e.g. `src/` +
  `tests/`, or language-specific layout). Used in Steps 2–4.

### 3. Hand off

State explicitly, so later steps and the artifact agree:

- target bundle path (e.g. `plan/Plan-002-packaging-distribution/`)
- spec root, matrix path + id
- `ix://<org>/<component>` prefix
- where source and tests live

## Notes

- If there is **no** plan bundle, stop and tell the user — gap-analysis audits a plan; it
  does not invent one (use `spec-to-plan` first).
- If there is **no** Test Matrix, Step 2 a/Plan checks still run, but record a `high`
  finding that the matrix is missing and Step 3 cannot verify coverage.
