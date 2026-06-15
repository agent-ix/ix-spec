---
name: spec-review
description: Run a composite specification review.
contributes:
  workflows: ./workflows
---

# /spec-review

## When To Use

Use this skill for a full or multi-artifact spec review before implementation, release, or migration.

## What It Does

Run a composite specification review. The workflow definition is the source of truth for phases, gates, item schemas, recipes, and validation points.

## Workflow Behavior

- Start from the workflow status and follow reported next actions.
- Record evidence items before advancing analysis, review, or validation phases.
- Use recipes for deterministic command chains, but preserve human gates for acceptance.
- Prefer templates for stable artifact creation and generic file editing for broad semantic rewrites.

## Acceptance Criteria

- AC-1: Reviews structural integrity, traceability, coverage, and readiness across selected artifacts.
- AC-2: Records evidence items before validation.
- AC-3: Stops at acceptance with findings and recommended next workflows rather than making broad edits.

## Boundaries

- Do not silently overwrite existing human-authored requirements artifacts.
- Do not invent missing facts, links, or evidence; record assumptions and gaps.
- Do not expand to adjacent spec operations unless the user request requires it or the workflow directs it.
