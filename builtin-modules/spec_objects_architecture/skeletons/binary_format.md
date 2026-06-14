---
id: binary-format-001
title: "Index metadata block layout"
artifact_type: binary_format
---
<!-- binary_format authoring skeleton (spec-objects-architecture). Fill
     every section with substantive content. Contract (manifest
     body_extraction asserts):
     - Frontmatter MUST carry id, title, artifact_type; artifact_type is
       binary_format (quire resolves the archetype from it).
     - "## Layout" (H2, required): MUST contain a fenced ```yaml code block
       describing the persisted binary layout — one or more record types,
       each with per-field name/offset/size/type (and endianness where it
       matters). This kind exists because JSON Schema has no offsets/
       strides/endianness vocabulary; use `data_schema` for genuinely
       JSON-shaped data.
     - Keep headings unique per level. -->
# [binary-format-001] Index metadata block layout

## Layout

```yaml
format: index-metadata
endianness: little
record_types:
  - name: metadata_block
    magic: 0x56494345
    size: 80
    fields:
      - { name: magic,            offset: 0,  size: 4, type: u32 }
      - { name: format_version,   offset: 4,  size: 4, type: u32 }
      - { name: dimensions,       offset: 8,  size: 2, type: u16 }
      - { name: quant_kind,       offset: 10, size: 1, type: u8 }
      - { name: payload_len,      offset: 11, size: 4, type: u32 }
      - { name: reserved,         offset: 15, size: 65, type: bytes }
  - name: posting_tuple
    tag: 0x21
    fields:
      - { name: tag,              offset: 0, size: 1, type: u8 }
      - { name: heap_pointer,     offset: 1, size: 6, type: item_pointer }
      - { name: payload,          offset: 7, size: payload_len, type: bytes }
```
