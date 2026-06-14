---
name: spec-write-str
description: Create Stakeholder Requirement artifacts.
contributes:
  workflows: ./workflows
---

# /spec-write-str

## When To Use

Use this skill when capturing authoritative stakeholder needs, constraints, or business intent.

## What It Does

Create Stakeholder Requirement artifacts. The workflow definition is the source of truth for phases, gates, item schemas, recipes, and validation points.

## Workflow Behavior

- Start from the workflow status and follow reported next actions.
- Record evidence items before advancing analysis, review, or validation phases.
- Use recipes for deterministic command chains, but preserve human gates for acceptance.
- Prefer templates for stable artifact creation and generic file editing for broad semantic rewrites.

## Acceptance Criteria

- AC-1: Creates a stakeholder requirement with source, rationale, and downstream trace expectations.
- AC-2: Keeps stakeholder intent distinct from implementation behavior.
- AC-3: Flags missing stakeholder source or unclear authority before acceptance.

## Boundaries

- Do not silently overwrite existing human-authored requirements artifacts.
- Do not invent missing facts, links, or evidence; record assumptions and gaps.
- Do not expand to adjacent spec operations unless the user request requires it or the workflow directs it.
