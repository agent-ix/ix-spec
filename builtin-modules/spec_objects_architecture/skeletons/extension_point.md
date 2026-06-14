---
id: extension-point-001
title: "Renderer registry extension point"
artifact_type: extension_point
---
<!-- extension_point authoring skeleton (spec-objects-architecture). Fill
     every section with substantive content. Contract (manifest
     body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type; artifact_type is
       extension_point (quire resolves the archetype from it).
     - "## Contract" (H2, required): the interface the extension point
       exposes to plug-ins (name the `interface` object it publishes).
     - "## Registration" (H2, optional): how implementations register and
       are discovered/selected.
     - "## Stability" (H2, optional): compatibility window, versioning and
       deprecation guarantees offered to third-party implementers.
     - Use this kind only when pluggability itself needs to be a node
       (external authors, compatibility guarantees); an internal contract
       with known implementations is just an `interface` plus
       `implements` edges.
     - Keep headings unique per level. -->
# [extension-point-001] Renderer registry extension point

## Contract

Modules contribute object renderers through the `RendererRegistry` interface
(interface-002): per `object_type_name`, a module registers the React
component and configuration this library needs to render that type — with no
modification to the host library's source.

## Registration

- Registration happens at module init via `registry.register(typeName, entry)`.
- Last registration per `object_type_name` wins; duplicate registrations log a
  warning with both module names.
- Unregistered types fall back to the generic payload renderer.

## Stability

- The registry entry shape is semver-stable within a major version; new
  optional fields may be added in minors.
- Deprecated fields keep working for one major version and log a deprecation
  warning naming the replacement.
