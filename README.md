# IX Spec

`ix-spec` is the focused spec-domain CLI for Agent IX. It owns spec catalog
discovery, spec module/plugin install state, bundled root artifact/object
vocabulary, and agent-facing authoring contracts for direct spec work.

The workflow lifecycle itself is handled by `ix-flow`.

## Install

Install `ix-spec` with `ix-flow` so the spec launcher and workflow lifecycle
commands are both available:

```bash
npm install -g @agent-ix/ix-spec@latest @agent-ix/ix-flow@latest --registry https://npm.pkg.github.com
```

## Usage

```bash
ix-spec catalog list
ix-spec catalog show FR
ix-spec catalog validate
ix-spec plugin install path:../spec-objects-business
ix-spec plugin list
ix-spec write . --types FR,domain,entity
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

This package builds on `@agent-ix/ix-cli-core` from the standalone
`ix-cli-core` repo. `ix-spec write` prints compact skeleton/schema/module paths
so agents can author files directly and validate changed spec files with Quire.
The eval scenarios are defined in `spec/evals.md`; the runner is being rebuilt
as an agent-pty-driven harness (it profiles a real agent running the
skills/workflows — unit tests cover the mechanical CLI behavior).
