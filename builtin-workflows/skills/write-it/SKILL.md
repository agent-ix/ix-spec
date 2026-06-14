---
name: spec-write-it
description: Create implementation-test or integration-test specification artifacts.
contributes:
  workflows: ./workflows
---

# /spec-write-it

## When To Use

Use this skill when adding test-intent artifacts that verify requirements.

## What It Does

Create implementation-test or integration-test specification artifacts. The workflow definition is the source of truth for phases, gates, item schemas, recipes, and validation points.

## Workflow Behavior

- Start from the workflow status and follow reported next actions.
- Record evidence items before advancing analysis, review, or validation phases.
- Use recipes for deterministic command chains, but preserve human gates for acceptance.
- Prefer templates for stable artifact creation and generic file editing for broad semantic rewrites.

## Acceptance Criteria

- AC-1: Creates test-intent artifacts with trace links to the requirements they verify.
- AC-2: Records verification scope, expected evidence, and acceptance conditions.
- AC-3: Flags missing requirement links before acceptance.

## Boundaries

- Do not silently overwrite existing human-authored requirements artifacts.
- Do not invent missing facts, links, or evidence; record assumptions and gaps.
- Do not expand to adjacent spec operations unless the user request requires it or the workflow directs it.
