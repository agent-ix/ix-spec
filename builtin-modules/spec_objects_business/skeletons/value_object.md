---
id: value-object-001
title: "Money"
artifact_type: value_object
---
<!-- value_object authoring skeleton (spec-objects-business). Fill every
     section with substantive content. Contract (manifest body_extraction
     asserts):
     - Frontmatter MUST carry id, title, artifact_type: value_object.
     - "## Properties" (H2, required): the immutable components of the value
       plus equality and validity rules. ("## Fields" is accepted as an
       optional legacy alternative heading; prefer Properties.) -->
# [value-object-001] Money

## Properties

- **amount** (`decimal`, scale 2) — the monetary quantity; never a binary
  float, always exact decimal arithmetic.
- **currency** (`string`, ISO 4217 alpha-3) — e.g. `EUR`, `USD`; addition and
  comparison are only defined between Money values of the same currency, and
  mixing currencies raises a domain error.

Money is immutable: operations such as `add`, `multiply`, and
`allocate(ratios)` return new Money values. Two Money values are equal when
both amount and currency are equal; Money has no identity of its own.
