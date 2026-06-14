---
name: spec-matrix
description: Build and update requirements test matrices.
contributes:
  workflows: ./workflows
---

# /spec-matrix

## When To Use

Use this skill when generating or reviewing bidirectional mappings between requirements, acceptance criteria, tests, and evidence.

## What It Does

Build and update requirements test matrices. The workflow definition is the source of truth for phases, gates, item schemas, recipes, and validation points.

## Workflow Behavior

- Start from the workflow status and follow reported next actions.
- Record evidence items before advancing analysis, review, or validation phases.
- Use recipes for deterministic command chains, but preserve human gates for acceptance.
- Prefer templates for stable artifact creation and generic file editing for broad semantic rewrites.

## Acceptance Criteria

- AC-1: Creates or updates matrix rows for requirement-to-test and test-to-requirement coverage.
- AC-2: Flags orphan requirements, orphan tests, duplicate mappings, and stale evidence references.
- AC-3: Validates matrix output before acceptance and avoids changing requirement text unless another workflow is requested.

## Boundaries

- Do not silently overwrite existing human-authored requirements artifacts.
- Do not invent missing facts, links, or evidence; record assumptions and gaps.
- Do not expand to adjacent spec operations unless the user request requires it or the workflow directs it.
