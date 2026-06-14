---
artifact_type: master-requirements
name: example-service
org: agent-ix
component_type: fastapi-service
implementation_language: python
tags:
  - example
depends_on: []
standards_alignment:
  - iso-iec-ieee-29148
relationships:
  - target: "ix://agent-ix/identity/FR-001"
    type: "depends_on"
    cardinality: "1:1"
security_critical: false
---
<!-- Master-requirements authoring skeleton (spec-artifacts-iso). One generic
     shape for every component_type; component-type variation lives in the OTHER
     artifacts (which FRs/NFRs exist), not here. Contract (manifest body_extraction
     asserts):
     - H1 title MUST be exactly "Master Requirements Specification".
     - Required H2 sections: Purpose, Scope, System Overview, Requirements
       Architecture, References. Purpose and References carry substantive prose
       (non-empty, non-placeholder); Scope / System Overview / Requirements
       Architecture are containers and may hold only ### subsections.
     - component_type MUST be kebab-case (^[a-z][a-z0-9-]*$).
     - Optional sections (e.g. Domain Model, Security Model) and extra H2s are
       allowed; keep headings unique per level. -->
# Master Requirements Specification

## Purpose

This document specifies the requirements for the component named in the
frontmatter. It states what the component does, the boundary of its
responsibility, and the quality attributes it must uphold, so that implementers,
reviewers, and downstream consumers share one authoritative definition of done.

## Scope

### In Scope

- The component's public surface (its API, events, or rendered output) and the
  behaviour each requirement pins down.
- The data the component owns and the invariants it guarantees.

### Out of Scope

- Concerns owned by upstream or downstream components, referenced here only by
  relationship.
- Deployment topology and infrastructure, which live in the operating
  environment rather than this specification.

## System Overview

### System Description

A concise description of the component: the problem it solves, its place in the
wider system, and the principal flows of control and data through it.

### Intended Users

The roles or systems that interact with the component, and what each relies on it
to provide.

## Requirements Architecture

The requirement classes that make up this specification — Stakeholder
Requirements, User Stories, Functional Requirements, and Non-Functional
Requirements — and how they trace to one another. Component-type-specific
structure (domain models for services, component requirements for UI libraries)
is expressed by the individual artifacts in those classes.

## References

- ISO/IEC/IEEE 29148 — Requirements engineering.
- The component's source repository and README.
- The specifications of the upstream and downstream components named in the
  frontmatter `relationships`.
