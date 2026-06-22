# Step 2: Plan Completion

**Goal**: Confirm every unit of work in the targeted plan is actually finished.

## The Task contract

Tasks in the bundle are frontmatter-typed (`type: Task`). The machine contract
(see `quoin/skills/spec-to-plan/SKILL.md`):

```yaml
---
id: Task-001
type: Task
status: not_started | in_progress | blocked | done
track: A | B | C | S | J | <gate-name>
priority: P0 | P1 | P2 | P3
relationships:
  - { target: "ix://org/component/Task-000", type: depends_on }
  - { target: "ix://org/component/FR-002",   type: references }   # requirement ownership
  - { target: "ix://org/component/TC-004",   type: verifies }     # test-case trace
---
```

## Process

1. **Enumerate tasks.** Read every `plan/<Plan-id>-<slug>/tasks/Task-*.md`.
2. **Assert completion.** For each task, check `status`:
   - `done` → OK.
   - `not_started` / `in_progress` / `blocked` → **finding**. Severity:
     - `high` if `priority: P0`/`P1` or it is on the critical path (`track: A`/`S`).
     - `medium` otherwise. `blocked` → note the blocker (its unmet `depends_on`).
3. **Check dependency sanity.** Flag a `done` task whose `depends_on` target is **not**
   `done` (out-of-order completion) as a `medium` finding.
4. **Cross-check `plan.md` checkboxes.** `plan.md` mirrors requirements/tests as
   `- [ ]` / `- [x]`. Flag (`low`) any checkbox state that contradicts task status
   (e.g. an unchecked requirement whose owning task is `done`, or vice-versa) — the plan
   doc is drifting from its tasks.
5. **Record the rollup.** Count tasks `done` / total — feeds the SpecReview `## Coverage`.

## Output of this step

A list of findings (incomplete tasks, out-of-order completion, checkbox drift) with their
`Refs` (the Task id, and the requirement/TC it owns) for the SpecReview Findings table, plus
the tasks-done/total count.

## Notes

- Do not edit task files or `plan.md` — gap-analysis only reports. If the user wants the
  plan reconciled, that's `spec-to-plan` (update flow) or `implement-plan`.
