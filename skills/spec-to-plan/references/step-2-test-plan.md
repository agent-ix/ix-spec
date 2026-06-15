# Step 2: Test Plan Creation

**Goal**: Define a comprehensive list of tests *before* writing any code (TDD).

## Process

1.  **Derive Tests from FRs**:
    -   For each Functional Requirement (FR), identify the necessary **Unit Tests** (pure logic) and **Integration Tests** (component interaction).
    -   Define the *Entrance Criteria* (Setup) and *Exit Criteria* (Assertions).

2.  **Enumerate Acceptance Criteria**:
    -   For each FR and NFR, explicitly list all Acceptance Criteria (AC IDs) from the spec.
    -   If no formal ACs exist in the spec, derive them and document in the plan for traceability.
    -   This ensures implementation progress is trackable per-criterion, not just per-requirement.

3.  **Derive Verification from NFRs**:
    -   For each Non-Functional Requirement (NFR), define the **Verification Method** (e.g., Load Test script, Static Analysis check, Manual Inspection).

4.  **Structure the Plan**:
    -   Append a "Test Plan" section to `/plan/plan.md`.
    -   Group tests by the component/module they target.

## Output Format (/plan/plan.md)

```markdown
## Test Plan

### Unit Tests
- [ ] **test_valid_input_processing** (FR-001): Verify X returns Y given Z.
- [ ] **test_error_handling_invalid_id** (FR-001): Verify System raises ValueError on invalid ID.

### Integration Tests
- [ ] **test_database_persistence** (FR-002): Verify data is strictly committed to DB.

### Verification (NFRs)
- [ ] **verify_response_time** (NFR-001): Run load test to ensure p95 < 200ms.
```
