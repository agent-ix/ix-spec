---
id: US-002
title: "Discover an authoring contract before editing"
type: US
relationships:
  - target: "ix://agent-ix/ix-spec/FR-003"
    type: "traces_to"
  - target: "ix://agent-ix/ix-spec/FR-004"
    type: "traces_to"
---

# [US-002] Discover an authoring contract before editing

## Description

An agent needs to understand how to write or edit a specific artifact/object
type before touching files.

## Body

As an agent preparing a change, I want to inspect a type by name and retrieve
the authoring pack for that type, so that I can keep the file structure aligned
with the catalog contract.

The expected commands are:

```bash
ix-spec catalog show FR
ix-spec write . --types FR
```

The help text should make the next action clear: use the returned skeleton and
schema as the authoring contract, edit files in the repository, then validate
the changed files.

## Dependencies

- The active catalog can resolve bundled and installed types.
- Type lookup works regardless of common casing differences such as `FR` and
  `fr`.
