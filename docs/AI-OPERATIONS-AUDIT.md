# AI OPERATIONS / LAB 001 — interaction audit

## Scope

Inspected the original source, reproduced its behavior in the local browser, corrected the state model, and tested the resulting interaction. The original visual composition remains. Changes are confined to Operations behavior, its markup and scoped feedback styles, module wiring, validation and documentation. Flow and Signal were not redesigned. This is plain JavaScript, not React, so there is no React component state to audit.

## Reproduced defects

- Selecting only Internal Knowledge and CRM, choosing the response direction and applying still wrote both excluded Tasks and Communication destinations.
- The source list could alter citations without changing the corresponding action destinations. A fixed knowledge/CRM gate prevented useful partial-context scenarios.
- Human Review showed baseline destination values until Apply, rather than the changes being approved.
- After Apply, the result still said PROPOSED / REVIEW REQUIRED while the review column said applied.
- Source/direction changes mixed a cleared proposal with ambiguous previously applied values.
- Context / Judgment / Action was decorative and hidden from assistive technology. There was no processing state.
- Reset differed from the first-loaded view, including its result text, citations and status.
- Source inspection and inclusion were insufficiently distinguished, and checkbox hit areas needed enlarging.

No console error or custom-cursor obstruction explained these issues. They were state and feedback defects.

## Implemented model

`operations.mjs` owns source selection, direction, inspected source, processing stage, current result, proposed changes, committed workspace and run identity. The interface is rendered from that state. The same exported transition functions are exercised by the state tests; no external AI call or random outcome is involved.

The primary transitions are ready → running → review → applied. Settings changes move to a fresh awaiting-run state, invalidate the old result and cancel timers. A monotonically increasing run identity also rejects late callbacks. Inspection changes only the viewed source; it does not change source inclusion or invalidate a run.

Evidence and citations are limited to selected sources. Only selected writable records can receive changes. A reference-only selection produces analysis with no Apply action. Before approval, each destination displays its current value and proposed replacement. Approval updates both result and review status, applies only the proposal and disables repeated approval. The previous evidence is explicitly labeled as the evidence used before approval. New runs read the updated local records. An identical approved direction returns already aligned instead of creating duplicate changes.

Reset uses the same initial-state factory and renderer as page load. It restores selections, direction, inspected source, result, processing indicators, review and committed values. Pending completions cannot repopulate the reset view.

## Feedback and accessibility

- The existing three processing labels now reflect actual processing state. Normal timing is 350ms per stage and 1,050ms total.
- Browser observation recorded stage offsets of approximately 0, 352 and 701ms, with review available at 1,053ms.
- Reduced motion completes immediately with the same inspectable result. Switching to reduced motion during a run finishes it without leaving pending visual work.
- Real disabled states block running with no sources, duplicate runs, early approval and repeated approval.
- Source inclusion uses a separate labeled hit area: 44×54px measured on mobile. Source names explicitly inspect their content; excluded inspection says that the source is excluded.
- A concise status region announces progress and completion. The full result is a keyboard-focusable region rather than a second repeated live announcement. Source inspection is politely announced.
- Approving with Space moves focus to the visible approval heading. Native select navigation and checkbox Space behavior remain intact.
- Checkbox/source row, selector, Run, Apply and Reset hover states were exercised with real pointer movement. Pointer cursors and unobstructed native interactions were confirmed.

## Verification

The 57 automated checks include all 16 source subsets × 3 directions and transition tests for invalidation, late callbacks, inspection, repeated runs, idempotent approval, committed-state updates and exact reset. These are run with:

```sh
node --test scripts/ops-state.test.mjs
```

The exact requested browser acceptance path passed:

1. Fresh load: no generated analysis, waiting review, Apply disabled.
2. Internal Knowledge + CRM selected; Communication and Tasks disabled.
3. Draft the next response selected; Run starts the three processing stages.
4. The result cites only Internal Knowledge and CRM. No communication evidence is used, and only CRM has a proposed change.
5. Review displays Unassigned → Reply review requested before approval.
6. Apply changes the result to APPLIED / HUMAN APPROVED, the review to HUMAN APPROVED, and CRM to its applied value. Excluded records are untouched.
7. Reset restores visible workspace text exactly to the fresh-loaded snapshot.
8. Internal Knowledge + Communication with the handoff direction produces a different result and only a Communication proposal.
9. Tasks alone with the attention direction produces task-specific evidence and a task-only proposal.

Additional browser checks covered all checkboxes and source-inspection buttons; all three directions; no-source validation; settings changes after a result; source changes while processing; Reset during processing followed by a delayed check; repeat runs after approval; native keyboard activation; reduced motion; and hover feedback. Cancellation remained in its new state after the old run's duration elapsed.

Responsive checks included 320px and 390px mobile, 768px tablet and desktop. No horizontal page overflow was observed. The stacked order remains Context → Reasoning → Human Review and state is preserved across viewport changes. Final console checks contained no captured errors or warnings. Physical assistive-technology, Safari/Firefox and field performance certification are not claimed from this local browser review.

The revision remains local and unpublished. Existing Sites identity and the rest of the website are preserved.
