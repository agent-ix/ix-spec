# Step 4: Underspecified Code (reverse gap)

**Goal**: Find the *reverse* gap — code and behavior that exist with **no owning
requirement**, plus stubs that masquerade as complete. Steps 2–3 verify spec→code/test
coverage; this step verifies code→spec, catching scope that was implemented but never
specified.

Reuse the detection heuristics in
`~/dev/agent_skills/implementation-gap-analysis/SKILL.md` — don't reinvent them.

## A. Untraced behavior (code with no requirement)

1. **Inventory the surface.** List the component's real behaviors — public
   functions/methods, CLI commands/flags, HTTP endpoints, events, config knobs.
2. **Trace each to a requirement.** A behavior is *traced* if it maps to an StR/US/FR/NFR
   (via the matrix `Traces To`, a requirement that describes it, or a Task `references`
   edge that owns it).
3. **Flag the untraced.** Behavior with no owning requirement → finding:
   - `high` if it is user-visible or security/data-affecting (an endpoint, a CLI command, a
     destructive operation) — unspecified surface area.
   - `medium` for internal-but-meaningful logic with no requirement.
   - `low` for trivial helpers/glue.
   `Refs` = the code location (`path::symbol`).

## B. Implied requirements from code patterns

Map suspicious patterns to the requirement that *should* exist (per the
implementation-gap-analysis table):

| Code pattern | Missing requirement type |
| --- | --- |
| Defensive code (try/catch, null guards) | Robustness (NFR) |
| Ambiguous identity/equality logic | Integrity (StR) |
| Side effects / IO in core logic | Determinism (StR) |
| Recursion / unbounded structures | Topology / limits (NFR) |
| Unmapped constraints | Traceability (FR/StR/NFR) |

Each unstated-but-implemented constraint → `medium` finding.

## C. Stubs masquerading as complete

Scan **source** (not just tests) for hollow implementations the plan/matrix may report as
done:

| Stub | Detect | Severity |
| --- | --- | --- |
| Tiny file (≤5 lines, excl. `__init__`) | line count | high |
| `pass` / placeholder return (`{}`,`[]`,`None`,`"not implemented"`) body | grep/AST | high |
| Protocol/ABC-only with no concrete impl | structure | high |
| Re-export-only module | structure | medium (may be intentional) |
| Trivially-covered stub (≤5 lines @ 100% cov) | coverage + size | medium |

A stub behind a `done` task or a ✅ matrix row is a `high` finding (false completion).

## Output of this step

Findings for untraced behavior, implied-but-missing requirements, and stubs, each with
`Refs` = code location, plus a count of untraced behaviors/stubs for `## Coverage`.

## Notes

- This is the bridge to better specs: untraced behavior usually means a requirement should
  be authored (`/specify`) — but gap-analysis only **reports** it; it does not author specs.
