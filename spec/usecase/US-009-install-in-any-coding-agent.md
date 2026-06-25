---
id: US-009
title: "Install quoin in the coding agent of my choice"
type: US
relationships:
  - target: "ix://agent-ix/quoin/StR-001"
    type: "traces_to"
---

# [US-009] Install quoin in the coding agent of my choice

## Story

**As a** developer adopting spec-driven development in my own coding agent
**I want** to install quoin as a plugin in whichever agent I already use — Claude
Code, OpenAI Codex, opencode, or GitHub Copilot
**So that** quoin's spec-authoring skills and workflows are available in my agent
without my having to switch tools or re-author anything per agent.

This story expresses the adopter's perspective in informal language and does not
prescribe the manifest formats or install commands each agent uses.

## Context

Today quoin installs as a Claude Code plugin only, even though its skills are
plain `skills/<name>/SKILL.md` files that several coding agents can read. Adopters
on Codex, opencode, or Copilot have no first-class install path and must copy
files by hand. Because the same skill tree is the common denominator across these
agents, the same bundle should be installable from each of them through that
agent's own plugin/skill mechanism.

## Acceptance Examples (Illustrative)

These examples clarify the adopter's expectations. They are illustrative only —
not test cases and not verification criteria.

### [US-009-EX-1] Install from Codex

- **Given** a developer working in OpenAI Codex
- **When** they add the quoin marketplace and install the plugin
- **Then** quoin's skills appear in Codex without any per-agent re-authoring

### [US-009-EX-2] Install from opencode or Copilot

- **Given** a developer working in opencode or GitHub Copilot
- **When** they install quoin's skills for their agent (e.g. `gh skill install`
  or `copilot plugin marketplace add`)
- **Then** the same skills they would get in Claude Code become available

## Dependencies (Contextual)

Relationships observed during discovery. Upstream: the standalone-install
stakeholder need ([StR-001](../stakeholder/StR-001-standalone-cli.md)).
Downstream: a non-functional requirement that the skill tree stay the single
source of truth across agents. These are potential relationships, not formal
traceability.

## Traceability (Informative)

This user story traces to the stakeholder need for installing quoin as a single,
self-contained adoption unit. Links may be updated as understanding evolves.
