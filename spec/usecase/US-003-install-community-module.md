---
id: US-003
title: "Install and use a community spec module"
type: US
relationships:
  - target: "ix://agent-ix/ix-spec/FR-002"
    type: "traces_to"
  - target: "ix://agent-ix/ix-spec/FR-003"
    type: "traces_to"
  - target: "ix://agent-ix/ix-spec/FR-004"
    type: "traces_to"
---

# [US-003] Install and use a community spec module

## Story

As a user adopting a community module, I want to install the module once under
`~/.ix/filament/modules` (recorded in `~/.ix/filament/registry.json`), confirm
that its types appear in the active catalog, and request those types in an
authoring pack, so that the new vocabulary participates in authoring and
validation just like the default modules.

## Context

A user extends the spec vocabulary with an additional artifact/object module
from a local path, GitHub repository, or package.

The expected command shape is:

```bash
ix-spec plugin install github:agent-ix/spec-objects-custom
ix-spec catalog list
ix-spec write . --types custom-object
```

The installed module should participate in the same authoring and validation
flow as the default modules. `ix-spec` maps the source argument to a typed
`ts-plugin-kit` source and hands it off; the `package:`/npm source is not yet
supported and is rejected by `ts-plugin-kit` with an unsupported-source error at
install time.

## Dependencies

- Plugin install records are stored in `~/.ix/filament/registry.json`; modules
  are materialized under `~/.ix/filament/modules`.
- Catalog loading merges `IX_SPEC_MODULE_PATHS` overrides with installed modules
  deterministically (env paths first).
- Install/registry mechanics are delegated to `@agent-ix/ts-plugin-kit`.
