# Adaptive cursor: independent audit and refinement

23 September 2026. Existing implementation inspected before editing. Changes are local and unpublished; the website's sections, product state models and hosting identity are preserved.

## Findings that led to changes

| Observed weakness | Evidence | Implemented correction |
| --- | --- | --- |
| Point visibly separated from its registration outline during fast travel. | Baseline browser sampling reached 18px lag, beyond the default corners' roughly 10.5px extent. | Retained the 42ms easing but capped separation at 8px. |
| Native controls still scheduled cursor animation. | 22 mouse movements inside the Operations select produced 22 cursor callbacks, all while hidden. | Native movement returns before scheduling; the same 22 movements now produce zero cursor frames and zero cursor style reads. |
| Held-button re-entry incorrectly restored the custom pointer. | Mouse-down on reading content → leave viewport → re-enter with buttons=1 produced an active custom cursor. | Reconcile event.buttons on movement and preserve native selection/drag behavior. Repeated browser sequence now retains native cursor until release. |
| Touch-only devices retained desktop listeners and observers. | Source inspection showed unconditional registration despite capability checks in the frame scheduler. | Capability-gated mounting and teardown. Coarse-pointer emulation now has zero cursor overlays and zero connected cursor observers. |
| Lifecycle lacked ownership and failure cleanup. | No destroy path or duplicate-owner guard; native suppression could outlive a removed overlay. | Singleton owner; exported mountCursor/destroy; aborted listeners, disconnected observers, canceled animation; guarded callbacks and connectivity checks. |
| The first easing step assumed a 60Hz frame duration. | A fixed 16ms was used whenever motion restarted. | Initialize from performance.now() and use actual animation timestamps with bounded elapsed time. |
| More targeting decoration than necessary. | Four radial ticks and 1.46× scaling looked closer to a targeting reticle than an editorial instrument. | Two offset guide ticks, 1.2× experimental scale and 1.1× hover scale. Existing A/L slash and opposite registration corners remain. |
| Labels repeated obvious contact actions. | START on header navigation and WRITE on the main email action repeated the existing copy. | At this audit, labels were limited to lab entry points: EXPLORE and ENTER. The later founder update also uses ENTER on its two personal-site anchors. Typography increased from 10px to 11px. |
| Caption followed the delayed outline. | Label moved with the trailing layer and had no bottom-edge positioning rule. | Label now follows the exact point; it flips left, below or above near viewport boundaries. |
| Avoidable state writes and surface-read ordering. | State attributes were repeatedly written before reading painted backgrounds. | Coalesce surface resolution into the next frame, read first, then commit only changed attributes. |
| Resize and scrollbar boundaries had no explicit guard. | Cursor eligibility trusted event targets even outside the content rectangle. | Out-of-bounds coordinates restore native behavior; checked after resizing while the old pointer position was outside the new viewport. |

## Preserved design and interaction

The default remains a 3px exact point and 26px technical registration frame. The distinctive slash, off-white/ink contrast, vermilion accent and monospace labels continue the existing brand. There is no blob, large circle, bounce, spring wobble or new scene loop.

Native text inputs, selects, checkbox labels, ranges, disabled controls, text selection and drag retain standard browser behavior. The overlay remains aria-hidden, unfocusable and pointer-events:none. Keyboard use dismisses it without changing focus. Reduced motion and the site-wide pause eliminate secondary lag and nonessential transitions. A mouse attached to a hybrid device is allowed through any-pointer/any-hover capability; touch and pen events suspend the enhancement.

Surface contrast still composites painted backgrounds and uses explicit tone hints for shader content. SIGNAL Contour uses the light cursor over its dark field. A fine opposing edge protects the hotspot over mixed light/dark 3D typography.

## Measured before and after

Measurements are local browser diagnostics, not general hardware benchmarks. All instrumentation was temporary.

| Measurement | Before | After |
| --- | --- | --- |
| Cursor callbacks for 22 moves within a native select | 22 | 0 |
| Cursor style reads for those native moves | 0 | 0 |
| Maximum secondary separation in rapid travel | Approximately 18px | Approximately 8px (transform serialization tolerance below 0.01px) |
| Primary coordinate error across 48 rapid diagonal/reversal moves with WebGL active | Not recorded | 0px in each sampled render |
| Longest measured cursor callback in that 48-move sample | Not recorded | Approximately 0.2ms |
| Held-button viewport re-entry | Custom pointer incorrectly reappeared | Native cursor retained |
| Touch-only / forced-colors connected cursor observers | 2 by source inspection | 0, verified with observer instrumentation |
| Cursor callbacks while settled over 24 display frames | Not recorded | 0 |
| Repeated explicit mounts | No ownership protection | Exactly 1 overlay and 2 active observers; prior instances disconnected |

## Acceptance checks

| Acceptance item | Verification |
| --- | --- |
| 1. Accurate default tracking | Exact coordinates sampled after rendered pointer moves; zero error. |
| 2. Controlled fast motion | Rapid diagonals and reversals retain an 8px secondary separation bound; no overshoot mechanism. |
| 3. Correct hover states | Header links, CTAs, experiment entries, lab buttons, capability tabs, studio/external links, contact and footer checked. |
| 4. Hover exits cleanly | Rapid target changes, native control entry, disabled Operations button and viewport exit/re-entry checked. |
| 5. Selective labels | Only hero lab link and three experiment-entry links have labels. |
| 6. Labels disappear reliably | Link → input, link → canvas, contact/footer and settled anchor navigation checked. |
| 7. Experimental mode enters/exits | Hero; SIGNAL Field/Echo/Contour; controls inside/outside regions; local and global pause checked. |
| 8. Contrast | Black hero/footer, dark green Operations, pale Flow, chalk studio/production, red contact and all SIGNAL modes checked. |
| 9. Native form usability | Actual checkbox selection, select change, disabled controls and range/text hover checked. |
| 10. Text cursor and keyboard | Native text cursor retained; Tab advances to Build this word while overlay dismisses. |
| 11. AI Operations remains usable | Knowledge+CRM, reply direction → Run → Review → Apply → Reset verified. Only CRM updated; other records stayed unchanged; reset restored all four sources and default direction. |
| 12. Fast scrolling | Eight large scroll changes mixed with movement retained exact positions, current contrast and one overlay. |
| 13. No duplicate cursor | Repeated exported mounts and homepage/error-page navigation checked; one overlay. |
| 14. Console | No errors or warnings observed in final browser checks. Injected cursor failure was caught and restored native behavior. |
| 15. WebGL coexistence | Hero and three SIGNAL modes rendered during cursor use; 48 rapid moves measured with hero WebGL running. |
| 16. Touch/mobile | 390px coarse/no-hover emulation: zero overlays/observers, native suppression absent, no horizontal overflow. Capability restoration remounted once. Hybrid capability and pointer-type gating additionally source-reviewed. |
| 17. Reduced motion | Point and outline coincide, experimental mode becomes default, transition duration zero. Global pause behaves equivalently. |
| 18. Navigation | Hero anchor scroll clears prior label as destination passes under pointer; homepage → 404 → homepage resets active state and label. Reload and remount checked. |
| 19. Performance/lifecycle | Native movement has zero cursor frames; event work coalesces into one scheduled frame; loops settle; listeners/observers detach on capability loss. |
| 20. Brand fit and restraint | Existing A/L geometry retained; targeting reduced to offset technical guides; redundant labels removed; final screenshots reviewed on hero and experiment surfaces. |

Additional resilience tests: removed active overlay → native suppression cleared and observers disconnected; missing cursor stylesheet at mount → no custom overlay and native pointer retained; injected surface-read exception → guarded teardown and native fallback. All browser instrumentation and media/viewport overrides were removed or reset afterward.

## Validation and limits

- Static build and local links/accessible ID relationships passed: 2 HTML pages and 34 local references.
- Cursor JavaScript syntax validation passed.
- All 57 existing Operations state tests passed.
- Independent read-only reviews covered lifecycle and performance before implementation and again after the fixes; no further actionable defect remained in those reviews.
- Only the cursor, its label annotations, generated homepage and documentation changed. No dependency or hosting changes.

Verification used the local Chromium-based preview (desktop, 768px resize and 390px touch emulation). There was no physical touch-device, 120/144Hz display, Safari or Firefox certification. Those hardware/browser results are not implied by the measured local samples.
