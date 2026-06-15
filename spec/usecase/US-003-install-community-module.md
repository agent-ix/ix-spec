---
id: US-003
title: "Install and use a community spec module"
artifact_type: US
relationships:
  - target: "ix://agent-ix/ix-spec/FR-002"
    type: "traces_to"
  - target: "ix://agent-ix/ix-spec/FR-003"
    type: "traces_to"
  - target: "ix://agent-ix/ix-spec/FR-004"
    type: "traces_to"
---

# [US-003] Install and use a community spec module

## Description

A user extends the spec vocabulary with an additional artifact/object module
from a local path, GitHub repository, or package.

## Body

As a user adopting a community module, I want to install the module once under
`~/.ix`, confirm that its types appear in the active catalog, and request those
types in an authoring pack.

The expected command shape is:

```bash
ix-spec plugin install github:agent-ix/spec-objects-custom
ix-spec catalog list
ix-spec write . --types custom-object
```

The installed module should participate in the same authoring and validation
flow as the bundled root modules.

## Dependencies

- Plugin install records are stored under `~/.ix`.
- Catalog loading merges bundled modules, installed plugins, and development
  overrides deterministically.
