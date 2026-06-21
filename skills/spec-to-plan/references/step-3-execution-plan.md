# Step 3: Execution Plan

**Goal**: Derive an actionable execution plan with dependency-aware sequencing, parallel tracks, task decomposition, and quality gates from the requirements and test plan.

## Why This Step Exists

A requirements checklist and test plan tell you *what* to build and *how to verify it*. They don't tell you *in what order*, *what can run in parallel*, or *where to stop and validate before proceeding*. Without execution planning:
- Serial work blocks unnecessarily when items could be parallelized
- Shared dependencies are discovered late, causing rework or duplication
- There are no gates to catch fundamental problems before downstream work is wasted
- Task tracking doesn't reflect actual progress

## Process

### 1. Build the Dependency Graph

For each incomplete FR and NFR, determine what it depends on and what it unblocks.

**Sources of dependency information:**
- `traces:` frontmatter in spec files (explicit upstream requirements)
- `relationships:` arrays (explicit component dependencies)
- Normative references in requirement text (e.g., "SHALL use GenericXLog" implies WAL dependency)
- Shared algorithms or data structures (e.g., two FRs that both need graph traversal)

**Key output:** A directed acyclic graph (DAG) of requirements, with edges labeled by the reason for the dependency. Write this as a text list of edges with reasons:

```markdown
## Dependency Graph
- `FR-007 -> FR-008, FR-009, FR-010, FR-016`
  Reason: build/scan/vacuum/insert all depend on stable page and tuple layout.
- `FR-009 (graph traversal) -> FR-016 (insert), FR-010 (vacuum)`
  Reason: insert and vacuum reuse the scan traversal algorithm for neighbor search.
```

### 2. Identify the Critical Path

The critical path is the longest serial chain through the dependency graph. Everything not on the critical path is a candidate for parallel execution.

**Method:**
1. Topologically sort the dependency graph
2. Identify the longest chain (by estimated effort, not just count)
3. Mark items on this chain — these determine minimum completion time
4. Everything else is parallelizable

**Key output:** The critical path as an ordered list, with effort estimates per step.

### 3. Identify Shared Dependencies

Look for requirements or algorithms that appear as dependencies of multiple downstream items. These are high-value deliverables that should be extracted as explicit, testable units.

**Common patterns:**
- A traversal algorithm used by both scan and insert
- A serialization format used by both build and vacuum
- A scoring function used by both query path and maintenance path

**Key output:** List shared dependencies explicitly and mark them as discrete deliverables in the task breakdown.

### 4. Define Quality Gates

A gate is a checkpoint where you validate a fundamental assumption before investing in downstream work. Gates prevent wasted effort.

**When to add a gate:**
- After implementing a core algorithm whose correctness determines whether the whole system works (e.g., recall measurement after implementing search)
- Before starting optimization work (confirm correctness first)
- Before starting dependent work that would need rework if the gate fails

**Gate format:**
```markdown
#### Gate: [Name]
- **Measures:** [What you're validating]
- **Pass criteria:** [Specific threshold]
- **If fails:** [What to investigate before proceeding]
```

### 5. Decompose into Parallel Tracks

Group remaining work into tracks based on dependency relationships:

- **Track A (Critical Path):** Items that must be serial because each depends on the previous. This is the primary agent's work.
- **Track B (Parallel):** Items with no dependency on the critical path. These can start immediately on a separate agent.
- **Track C (Post-Gate):** Items that depend on a gate passing. These should not start until the gate is confirmed.

For each track, state:
- What items it contains
- What it depends on (if anything)
- Whether it can run on an independent agent

### 6. Create Task Files

Break each track into `type: Task` files under the bundle's
`plan/<Plan-id>-<slug>/tasks/`, named `Task-NNN-<slug>.md`. **Frontmatter is the
machine contract** — the DAG, ownership, and test traces live there, not in prose.
The body holds the human-facing detail.

```markdown
---
id: Task-002
title: "FR-002 — greeting + runtime versions"
type: Task
status: not_started        # not_started | in_progress | blocked | done
track: A                   # parallel-track label (A/B/C/S/J/Gate…)
priority: P0               # P0 | P1 | P2 | P3
relationships:
  - target: ix://<org>/<component>/Task-001
    type: depends_on       # DAG edge — one per upstream task
  - target: ix://<org>/<component>/FR-002
    type: references       # requirement(s) this task owns
  - target: ix://<org>/<component>/TC-004
    type: verifies         # test case(s) this task is verified by
---
# Task-002: FR-002 — greeting + runtime versions

## Scope
[What this task delivers]

## Subtasks
- [ ] **[Subtask name].** [Description with key concerns.]

## Deliverables
- [Concrete outputs]

## Notes
- [Implementation guidance, references, risk callouts]
- [Unblocks: which tasks/capabilities this enables — narrative; the authoritative
  edges are the `depends_on` relationships on the downstream tasks.]
```

**Frontmatter rules:**
- `relationships.target` MUST be a full `ix://<org>/<component>/<id>` URI; `<org>`
  and `<component>` come from `spec.md` frontmatter (`org`, `name`).
- Use only the registered `Task` edge verbs: `depends_on`, `verifies`, `references`.
- Encode the DAG as `depends_on` edges (not prose). One edge per direct upstream task.
- Every task carries ≥1 `references` (requirement) and ≥1 `verifies` (test) edge.
- `status`/`track`/`priority` are flat operational fields (allowed by the schema's
  `additionalProperties`). Downstream tooling (and the GitHub-issue sync) reads these.

**Task decomposition rules:**
- Tasks should be scoped to 1-3 agent sessions of work
- If a task bundles items with different dependencies, split it (e.g., don't bundle "build + scan" if build is done and scan is blocked)
- Mark blocked tasks with `status: blocked` and a `depends_on` edge to the blocker
- Mark parallel-ready tasks (`status: not_started`, no unmet `depends_on`) so agents know they can start

### 7. Write the bundle index and log

- **`index.md`** (`type: index`): update the `## Contents` link list so it points at
  `plan.md` and every `Task-NNN-*.md` just created — one bullet per file with a short
  description. This is the bundle's table of contents (replaces the old
  `tasks/README.md`).
- **`log.md`** (`type: log`): append a dated `## History` entry recording this
  planning pass (e.g. "Decomposed into 12 tasks across tracks A/B/C/S/J + 3 gates").
  Use today's real calendar date.

Coordination notes (what to freeze, what not to start early, merge sequencing) go in
the `plan.md` body — see the Output Format below.

## Output Format (appended to plan/<Plan-id>-<slug>/plan.md)

```markdown
## Remaining Work

### Remaining Dependency Graph
[Text DAG or ASCII diagram showing what depends on what]

### Track A: Critical Path (serial)
#### A1: [First step]
- **Scope:** ...
- **Difficulty:** Easy | Medium | Hard
- **Estimated new code:** ~NNN lines
- **Exit criteria:** ...

#### A2: [Second step]
...

#### Gate: [Quality checkpoint]
- **Measures:** ...
- **Pass criteria:** ...

### Track B: Parallel (independent agent, can start now)
#### B1: [Parallel item]
...

### Track C: Post-Gate
#### C1: [Gated item]
...

## Parallel Execution Summary
[ASCII timeline showing tracks running concurrently]

## Task File Mapping
[Table mapping Task-NNN files → track → owned requirements → status. The
authoritative status/deps live in each task's frontmatter; this table is a
human-readable mirror.]

## Coordination Rules
[What to freeze, what not to start early, shared-file/shared-state single-writer
discipline, merge sequencing.]
```

## Common Mistakes to Avoid

- **Bundling done + remaining work in one task.** If build is done but scan isn't, they're separate tasks even if they were originally planned together.
- **Missing shared dependencies.** If two items need the same algorithm, extract it as a deliverable — don't let two parallel workers implement it independently.
- **No gates.** If the whole system's value depends on one unproven property (e.g., recall quality), measure it before building everything around it.
- **Stale plans.** The execution plan should be updated as work progresses. Completed phases should be collapsed, not left as active planning noise.
- **Optimistic parallelism.** Don't mark items as parallel if they share mutable state (same files, same data structures). Merge conflicts erase the time savings.
