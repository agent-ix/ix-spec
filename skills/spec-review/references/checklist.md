# Requirements Review Checklist

## ID Format and Uniqueness
- [ ] All user stories use `US-XXX` format (3-digit).
- [ ] All functional requirements use `FR-XXX` format.
- [ ] All test cases use `TC-XXX` format.
- [ ] Acceptance criteria use `{PARENT}-AC-N`.
- [ ] Options use `{PARENT}-OPT-{LETTER}`.
- [ ] Constraints use `{PARENT}-CON-N`.
- [ ] No duplicate IDs. IDs are sequential.

## User Story Quality
- [ ] Uses "As a/I want/So that" format.
- [ ] >= 2 acceptance criteria (Given/When/Then).
- [ ] Criteria are testable.
- [ ] Options document trade-offs.
- [ ] Constraints include rationale.
- [ ] Dependencies linked.
- [ ] Priority specified.
- [ ] User value focus (not implementation).

## Functional Requirement Quality
- [ ] Description clear/specific.
- [ ] Related US linked.
- [ ] Inputs defined (type, validation).
- [ ] Outputs defined (type).
- [ ] Behavior detailed.
- [ ] Options document impact.
- [ ] Constraints document rationale/validation.
- [ ] Error conditions documented (codes).
- [ ] Performance targets specific.
- [ ] Security addressed.
- [ ] Criteria verifiable.
- [ ] Dependencies documented.

## Test Coverage Quality (Six Rules)
- [ ] Coverage: Every AC has >= 1 TC.
- [ ] Option Permutation: All valid combinations tested.
- [ ] Constraint Boundary: All boundaries tested (min, max, over, under).
- [ ] Error Path: All error conditions tested.
- [ ] State Transition: All transitions tested (if applicable).
- [ ] Edge Case: Edge cases identified/tested.
- [ ] TC fields complete (Type, Priority, Trace).

## Cross-Referencing
- [ ] FR links to US.
- [ ] TC links to AC.
- [ ] Full IDs used.
- [ ] Links valid.
- [ ] Terminology consistent.
