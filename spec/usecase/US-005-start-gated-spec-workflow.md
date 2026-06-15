---
id: US-005
title: "Start a gated spec workflow"
artifact_type: US
relationships:
  - target: "ix://agent-ix/ix-spec/FR-006"
    type: "traces_to"
---

# [US-005] Start a gated spec workflow

## Description

A user or agent starts review, matrix, or planning workflow runs from the spec
CLI and continues execution through `ix-flow`.

## Body

As a user running the spec lifecycle, I want `ix-spec` to launch the spec-domain
workflow and `ix-flow` to manage phase progression and human gates, so that the
workflow engine stays separate from the catalog and authoring surface.

The expected command shape is:

```bash
ix-spec review --target spec/
ix-flow status <run-id>
ix-flow resume <run-id>
```

The workflow should reference catalog-defined types instead of redefining the
artifact/object vocabulary inside the workflow definition.

## Dependencies

- `ix-flow` is installed separately.
- Workflow definitions are available to `ix-spec`.
