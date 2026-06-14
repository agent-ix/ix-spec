---
id: ${items.fr_answers.fr.id}
title: "${items.fr_answers.fr.title}"
artifact_type: FR
object: entity
relationships: []
---

# ${items.fr_answers.fr.id} ${items.fr_answers.fr.title}

## Description

${items.fr_answers.fr.statement}

## Properties

| Property | Type   | Required | Description          |
| -------- | ------ | -------- | -------------------- |
| id       | string | Y        | Stable identity key. |

## Invariants

- The entity SHALL have an explicit uniqueness key.

## Acceptance Criteria

| ID                             | Criteria                                           | Verification Method |
| ------------------------------ | -------------------------------------------------- | ------------------- |
| ${items.fr_answers.fr.id}-AC-1 | The entity schema is parseable from this artifact. | Inspection          |
