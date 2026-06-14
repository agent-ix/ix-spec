---
id: ${items.fr_answers.fr.id}
title: "${items.fr_answers.fr.title}"
artifact_type: FR
object: state_machine
relationships: []
---

# ${items.fr_answers.fr.id} ${items.fr_answers.fr.title}

## Description

${items.fr_answers.fr.statement}

## States & Transitions

| State    | Description    | Transitions |
| -------- | -------------- | ----------- |
| draft    | Initial state  | active      |
| active   | Active state   | complete    |
| complete | Terminal state | none        |

## Acceptance Criteria

| ID                             | Criteria                    | Verification Method |
| ------------------------------ | --------------------------- | ------------------- |
| ${items.fr_answers.fr.id}-AC-1 | All transitions are listed. | Inspection          |
