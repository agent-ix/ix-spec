# IX Spec

`ix-spec` is the focused spec-domain CLI for Agent IX. It owns spec catalog
discovery, spec module/plugin install state, bundled root artifact/object
vocabulary, Quire module resolution, and thin domain launchers for spec flows.

The workflow lifecycle itself is handled by `ix-flow`.

## Usage

```bash
ix-spec catalog list
ix-spec catalog show FR
ix-spec catalog validate
ix-spec plugin install path:../spec-objects-business
ix-spec plugin list
ix-spec write-fr
ix-spec review
ix-spec matrix
ix-spec to-plan
```

Config, plugin registry, installed modules, and workflow state default to
`~/.ix`. Use `--config-root <dir>` for isolated runs.

## Development

```bash
pnpm install
pnpm run build
pnpm test
pnpm run lint
```

This package builds on `@agent-ix/ix-cli-core@0.10.0` from the standalone
`ix-cli-core` repo and starts bundled spec flows from `ix-spec-workflows`.
