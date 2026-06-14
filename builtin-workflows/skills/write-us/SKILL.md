---
name: spec-write-us
description: Create User Story or use-case artifacts.
contributes:
  workflows: ./workflows
---

# /spec-write-us

## When To Use

Use this skill when capturing user intent, outcomes, roles, or usage scenarios.

## What It Does

Create User Story or use-case artifacts. The workflow definition is the source of truth for phases, gates, item schemas, recipes, and validation points.

## Workflow Behavior

- Start from the workflow status and follow reported next actions.
- Record evidence items before advancing analysis, review, or validation phases.
- Use recipes for deterministic command chains, but preserve human gates for acceptance.
- Prefer templates for stable artifact creation and generic file editing for broad semantic rewrites.

## Acceptance Criteria

- AC-1: Creates a user-story/use-case artifact with actor, goal, outcome, and acceptance notes.
- AC-2: Links to stakeholder requirements when available.
- AC-3: Flags stories that contain multiple unrelated goals or hidden functional requirements.

## Boundaries

- Do not silently overwrite existing human-authored requirements artifacts.
- Do not invent missing facts, links, or evidence; record assumptions and gaps.
- Do not expand to adjacent spec operations unless the user request requires it or the workflow directs it.
