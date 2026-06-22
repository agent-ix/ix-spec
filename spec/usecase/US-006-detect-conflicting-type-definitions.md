---
id: US-006
title: "Detect conflicting type definitions across modules"
type: US
relationships:
  - target: "ix://agent-ix/quoin/FR-011"
    type: "traces_to"
  - target: "ix://agent-ix/quoin/FR-012"
    type: "traces_to"
  - target: "ix://agent-ix/quoin/StR-003"
    type: "traces_to"
---

# [US-006] Detect conflicting type definitions across modules

## Story

**As a** user assembling a catalog from default and community modules
**I want** `quoin` to tell me when two modules declare the same artifact or object type
**So that** I can resolve the conflict before authoring against an ambiguous contract.

## Context

Once a user installs community modules alongside the default set, two modules can
declare the same type name (for example, two object modules each defining
`domain`). Authoring against such a catalog is ambiguous: the agent cannot know
which module's skeleton and schema apply.

The expected command shape is:

```bash
quoin catalog list
quoin catalog validate
```

`catalog validate` should report a clean catalog with its module count, or fail
with the conflicting type names and the modules that declare them, so the user
can remove or re-scope a module before continuing.

## Acceptance Examples (Illustrative)

These examples clarify expectations; they are illustrative, not verification
criteria.

### [US-006-EX-1] Clean catalog validates

- **Given** a catalog whose type names are each declared by a single module
- **When** the user runs `quoin catalog validate`
- **Then** the command succeeds and reports the number of modules

### [US-006-EX-2] Conflicting types are surfaced

- **Given** two installed modules that both declare an object type named `domain`
- **When** the user runs `quoin catalog validate`
- **Then** the command exits non-zero and names the duplicated type and the
  modules that declare it

## Dependencies

- The active catalog is assembled from `QUOIN_MODULE_PATHS` and the installed
  module store under `~/.ix/filament/modules`.
- Duplicate detection compares type names within the same kind (artifact or
  object) across modules.
