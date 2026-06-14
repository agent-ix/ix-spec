---
name: spec-write-nfr
description: Create Non-Functional Requirement artifacts.
contributes:
  workflows: ./workflows
---

# /spec-write-nfr

## When To Use

Use this skill when adding performance, reliability, security, usability, maintainability, or operational constraints.

## What It Does

Create Non-Functional Requirement artifacts. The workflow definition is the source of truth for phases, gates, item schemas, recipes, and validation points.

## Workflow Behavior

- Start from the workflow status and follow reported next actions.
- Record evidence items before advancing analysis, review, or validation phases.
- Use recipes for deterministic command chains, but preserve human gates for acceptance.
- Prefer templates for stable artifact creation and generic file editing for broad semantic rewrites.

## Acceptance Criteria

- AC-1: Creates an NFR artifact with measurable quality constraints where possible.
- AC-2: Records scope, metric, threshold, evidence, and verification method.
- AC-3: Flags subjective or non-testable quality language before acceptance.

## Boundaries

- Do not silently overwrite existing human-authored requirements artifacts.
- Do not invent missing facts, links, or evidence; record assumptions and gaps.
- Do not expand to adjacent spec operations unless the user request requires it or the workflow directs it.
