---
id: US-001
title: "Author a root artifact with supporting objects"
type: US
relationships:
  - target: "ix://agent-ix/ix-spec/FR-001"
    type: "traces_to"
  - target: "ix://agent-ix/ix-spec/FR-004"
    type: "traces_to"
  - target: "ix://agent-ix/ix-spec/FR-005"
    type: "traces_to"
---

# [US-001] Author a root artifact with supporting objects

## Story

**As an** agent writing a spec
**I want** to request an authoring pack for the artifact and object types involved in the work
**So that** I can create the right files, use the right skeletons, and validate the result without repeatedly fetching template context.

## Context

An agent turns a settled design conversation into one or more spec files using
the default artifact and object templates installed under
`~/.ix/filament/modules`.

The expected command shape is:

```bash
ix-spec write . --types FR,domain,entity
```

The output should include enough local paths and validation guidance for the
agent to author the files directly and then run Quire on the changed spec files.

## Dependencies

- Active catalog includes the default `spec-artifacts-*` and `spec-objects-*`
  modules, lazily installed into `~/.ix/filament/modules` on first catalog access.
- `quire` is available to validate authored files.
