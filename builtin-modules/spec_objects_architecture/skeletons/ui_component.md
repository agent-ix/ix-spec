---
id: ui-component-001
title: "ArtifactTable"
artifact_type: ui_component
---
<!-- ui_component authoring skeleton (spec-objects-architecture). Fill every
     section with substantive content. Contract (manifest body_extraction
     asserts):
     - Frontmatter MUST carry id, title, artifact_type; artifact_type is
       ui_component (quire resolves the archetype from it).
     - "## Props" (H2, required): every prop with name, type, and behavior.
     - Keep headings unique per level. -->
# [ui-component-001] ArtifactTable

## Props

- `artifacts: Artifact[]` — the artifact records to render, one row per
  artifact with digest, size, and upload time columns.
- `onSelect: (artifactId: string) => void` — invoked when a row is clicked;
  the host view navigates to the artifact detail page.
- `pageSize: number` — rows per page; the table paginates client-side when
  `artifacts.length` exceeds this value (default 25).
- `loading: boolean` — when true the table renders a skeleton row state and
  disables row selection.
