---
id: US-008
title: "Create an implementation plan from accepted requirements"
type: US
relationships:
  - target: "ix://agent-ix/quoin/FR-020"
    type: "traces_to"
  - target: "ix://agent-ix/quoin/StR-004"
    type: "traces_to"
---

# US-008: Create an implementation plan from accepted requirements

## Story

**As a** user with accepted requirements ready to build
**I want** to turn them into a tracked implementation plan — starting a new plan or
continuing an existing one — decomposed into tasks with explicit dependencies
**So that** a project can hold several focused plans instead of one monolithic plan,
and the work can be parallelized and synced to issue trackers.

This story expresses the planner's perspective in informal language and avoids
prescribing how the workflow assembles or stores the plan.

## Context

A project accumulates more than one body of implementation work over its life
(for example a core feature, a packaging effort, an accessibility hardening pass).
Forcing all of it into a single `plan.md` makes the plan unwieldy and couples
unrelated efforts. Planners want each effort captured as its own self-describing
plan, and they want to pick up where a previous planning session left off rather
than overwrite it. This story sits alongside the broader spec lifecycle and informs
later requirements rather than specifying them.

## Acceptance Examples (Illustrative)

These examples clarify the planner's expectations. They are illustrative only —
not test cases and not verification criteria.

### US-008-EX-1: Start a new plan

- **Given** a spec with accepted requirements and no existing plan
- **When** the planner runs the planning workflow
- **Then** a new plan is created as a self-describing bundle (its overview, a task
  per unit of work with dependencies between them, and its own index and change log)

### US-008-EX-2: Continue or branch into a second plan

- **Given** a project that already has one plan
- **When** the planner runs the planning workflow again
- **Then** they are offered the existing plan to continue, or can start a second,
  independent plan without disturbing the first

### US-008-EX-3: Dependencies and traceability are captured

- **Given** requirements with ordering and verification needs
- **When** the planner decomposes them into tasks
- **Then** each task records which tasks it depends on, which requirements it owns,
  and which tests verify it — so the dependency graph and traceability are explicit

## Dependencies

- Requirements are atomic, testable, and accepted before planning begins.
- A planning workflow definition is available to `quoin` (the `to-plan` launcher,
  FR-020).
