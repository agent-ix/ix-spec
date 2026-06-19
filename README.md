<p align="center">
  <img src="logo.png" alt="Quoin" width="100%" />
</p>

# Quoin

[![Discord](https://img.shields.io/badge/Discord-Join%20us-5865F2?logo=discord&logoColor=white)](https://discord.gg/6qsdhSPE)
[![ISO/IEC/IEEE 29148](https://img.shields.io/badge/ISO%2FIEC%2FIEEE-29148%20aligned-0052CC)](https://www.iso.org/standard/72089.html)
[![Open Knowledge Format](https://img.shields.io/badge/OKF-Open%20Knowledge%20Format-4285F4)](https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf)

`quoin` is a bundle of **Quire modules**, **agent skills**, and **workflows** for
authoring [ISO/IEC/IEEE 29148](https://www.iso.org/standard/72089.html)-aligned software specifications and other technical
documents. It packages the spec vocabulary, the authoring/review/planning contracts,
and the catalog/plugin tooling agents need to write and validate specs directly as Markdown.

`quoin` is built on the [Quire](https://github.com/agent-ix/quire-rs) document standard and validation engine by Agent-IX.

## What's included

### Quire modules

The default module set defines the spec archetypes and domain-object vocabulary.

**Artifact archetypes** — the document types you author:

| Module                                                                       | Archetypes                                                           |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [spec-artifacts-iso](https://github.com/agent-ix/spec-artifacts-iso)         | `StR`, `FR`, `NFR`, `US`, `IT`, `TC`, `Spec`, `master-requirements`  |
| [spec-artifacts-app](https://github.com/agent-ix/spec-artifacts-app)         | `ApplicationSpec`, `MasterRequirements`                              |
| [spec-artifacts-process](https://github.com/agent-ix/spec-artifacts-process) | `ADR`, `Plan`, `Task`, `Review`, `Finding`, `TestMatrix`, `Standard` |

**Domain objects** — the entities you reference inside specs:

| Module                                                                             | Objects                                                                                                                                                                                                                                |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [spec-objects-business](https://github.com/agent-ix/spec-objects-business)         | `domain`, `entity`, `value_object`, `aggregate_root`, `nested_entity`, `repository`, `event`, `state_machine`, `process`, `enumeration`                                                                                                |
| [spec-objects-architecture](https://github.com/agent-ix/spec-objects-architecture) | `api_endpoint`, `data_schema`, `queue`, `action`, `ui_component`, `interface`, `external_contract`, `extension_point`, `binary_format`, `rate_limit`                                                                                   |
| [spec-objects-enterprise](https://github.com/agent-ix/spec-objects-enterprise)     | `capability`, `business_function`, `value_stream`, `decision`, `objective`, `principle`, `kpi`                                                                                                                                         |
| [spec-objects-operational](https://github.com/agent-ix/spec-objects-operational)   | `configuration`, `migration`, `sli`, `slo`, `alert`, `runbook`, `incident`, `deployment`                                                                                                                                               |
| [spec-objects-security](https://github.com/agent-ix/spec-objects-security)         | `auth_flow`, `permission`, `scope`, `role`, `secret`, `encryption_key`, `session_config`, `data_classification`, `trust_boundary`, `audit_event`, `threat`, `control`, `risk`, `vulnerability`, `asset`, `attack_surface`, `policy`, … |

### Agent Skills

- **`specify`** — create or edit spec files using catalog authoring packs + Quire validation
- **`spec-review`** — review specification for quality, consistency, and completeness
- **`spec-matrix`** — build/maintain the requirements Test Matrix at 100% coverage
- **`spec-to-plan`** — convert StR/FR/NFR into a TDD project plan
- **`spec-ideation`** — loose, exploratory drafting before formal authoring
- **`spec-app-review`** / **`spec-object-review`** — application-spec and domain-object audits
- Analysis lenses — focused review passes over a spec:
  - **`spec-integrity-analysis`** — completeness, consistency, and atomicity quality gates
  - **`spec-scope-boundary-analysis`** — system boundaries and responsibility allocation
  - **`spec-dependency-analysis`** — separates enablement work from feature work
  - **`spec-evidence-analysis`** — verification methods and evidence artifacts per requirement
  - **`spec-failure-domain-analysis`** — unstated failure modes, identity confusion, edge cases
  - **`spec-risk-complexity-analysis`** — technical risk and volatility before tasking
  - **`spec-security-analysis`** — applicable security standards and compliance traceability

### Agent Workflows

Multi-agent workflows that fan out, run lenses in parallel, and synthesize results:

- **`review`** — parallel review lenses → dedupe → sync
- **`matrix`** — coverage analysis and Test Matrix construction
- **`to-plan`** — requirements → dependency-aware TDD plan

## Install

Install `quoin` with `ix-flow` so the spec tooling and workflow lifecycle commands are
both available:

```bash
npm install -g @agent-ix/quoin@latest @agent-ix/ix-flow@latest
```

## Usage

### skills & workflows

The primary way users author specs is by asking an agent, which invokes the bundled
[skills](#skills) and [workflows](#workflows).

### ClI commands

Inspect the spec vocabulary and manage installed modules:

```bash
quoin catalog list
quoin catalog show FR
quoin catalog validate
quoin plugin install path:../spec-objects-business
quoin plugin list
```

## Development

```bash
pnpm install
pnpm run build
pnpm test
pnpm run lint
```

### Specification

The technical specification for this library was itself authored with the `spec-artifacts-iso` module — see
[spec/spec.md](spec/spec.md).

### Evals

Eval scenarios live in [spec/evals.md](spec/evals.md) and run via the agent-pty-driven
harness in `evals/` (`make evals` / `make evals-all`). The harness profiles a **real** agent
running the skills/workflows and records token/tool/latency metrics from the Claude Code
transcript. Unit tests cover the mechanical CLI behavior; see [evals/README.md](evals/README.md).

## About

quoin is part of the Agent-IX ecosystem built on these core libraries:

- [quire-cli](https://github.com/agent-ix/quire-cli), the static-binary CLI wrapping the Quire engine
- [ix-cli-core](https://github.com/agent-ix/ix-cli-core), the generic CLI framework
  for Agent IX.
