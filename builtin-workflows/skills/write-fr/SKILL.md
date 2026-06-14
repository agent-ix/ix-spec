---
name: spec-write-fr
description: Create new Functional Requirement artifacts.
contributes:
  workflows: ./workflows
---

# /spec-write-fr

## When To Use

Use this skill when adding a new FR from typed intent, including behavioral and object-oriented FR variants.

## What It Does

Create new Functional Requirement artifacts. The workflow definition is the source of truth for phases, gates, item schemas, recipes, and validation points.

## Workflow Behavior

- Start from the workflow status and follow reported next actions.
- Record evidence items before advancing analysis, review, or validation phases.
- Use recipes for deterministic command chains, but preserve human gates for acceptance.
- Prefer templates for stable artifact creation and generic file editing for broad semantic rewrites.

## Acceptance Criteria

- AC-1: Renders a new FR artifact from the selected object-type template variant.
- AC-2: Requires typed ID, slug, title, object type, and normative statement inputs before rendering.
- AC-3: Validates frontmatter and stops at the human acceptance gate.

## Boundaries

- Do not silently overwrite existing human-authored requirements artifacts.
- Do not invent missing facts, links, or evidence; record assumptions and gaps.
- Do not expand to adjacent spec operations unless the user request requires it or the workflow directs it.
