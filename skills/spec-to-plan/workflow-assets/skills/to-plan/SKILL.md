---
name: spec-to-plan
description: Convert validated requirements into an implementation plan.
contributes:
  workflows: ./workflows
---

# /spec-to-plan

## When To Use

Use this skill when accepted requirements should become ordered implementation work.

## What It Does

Convert validated requirements into an implementation plan. The workflow definition is the source of truth for phases, gates, item schemas, recipes, and validation points.

## Workflow Behavior

- Start from the workflow status and follow reported next actions.
- Record evidence items before advancing analysis, review, or validation phases.
- Use recipes for deterministic command chains, but preserve human gates for acceptance.
- Prefer templates for stable artifact creation and generic file editing for broad semantic rewrites.

## Acceptance Criteria

- AC-1: Produces a plan that traces tasks back to requirement IDs.
- AC-2: Preserves dependencies, risks, and verification expectations in the plan.
- AC-3: Flags requirements that are not ready for planning instead of forcing tasks.

## Boundaries

- Do not silently overwrite existing human-authored requirements artifacts.
- Do not invent missing facts, links, or evidence; record assumptions and gaps.
- Do not expand to adjacent spec operations unless the user request requires it or the workflow directs it.
