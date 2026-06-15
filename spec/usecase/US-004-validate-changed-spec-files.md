---
id: US-004
title: "Validate changed spec files"
artifact_type: US
relationships:
  - target: "ix://agent-ix/ix-spec/FR-007"
    type: "traces_to"
---

# [US-004] Validate changed spec files

## Description

An agent validates every spec artifact/object file it creates or edits before
handing work back to the user.

## Body

As an agent completing spec edits, I want a scoped Quire command for the target
repository, so that validation checks the changed files using frontmatter to
select the matching rule set.

The expected command shape is:

```bash
quire validate --scope . "spec/**/*.md"
```

Validation should be scoped to the repository under work, and every created or
edited artifact/object file should be included in the validation set.

## Dependencies

- Authored files include frontmatter with `artifact_type`.
- Quire can load the relevant modules from the repo scope or installed module
  paths.
