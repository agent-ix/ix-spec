---
artifact_type: test-intent
id: "{{items.it_answers.request.artifact_id}}"
slug: "{{items.it_answers.request.slug}}"
title: "{{items.it_answers.request.title}}"
verifies:
  - "{{items.it_answers.request.verifies}}"
scenario: "{{items.it_answers.request.scenario}}"
evidence: "{{items.it_answers.request.evidence}}"
---

# {{items.it_answers.request.artifact_id}}: {{items.it_answers.request.title}}

## Scenario

{{items.it_answers.request.scenario}}

## Expected Evidence

{{items.it_answers.request.evidence}}
