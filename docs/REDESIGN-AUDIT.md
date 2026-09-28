# ATASHALCI LABS — experiments revision

## Scope and content boundary

The studio is new and does not present a portfolio of client commissions. The former case-study section, its content record, generated detail route, payment demonstration and sitemap entry have been removed. The retired case renderer and demo partial are also removed. Rebuilding deletes stale portfolio output.

The replacement section is **ATASHALCI LABS / EXPERIMENTS**. Its introduction uses the requested statement verbatim: “Self-initiated experiments exploring software, AI, automation and digital interaction.” Each of its three environments carries **SELF-INITIATED / LAB EXPERIMENT / PROTOTYPE**. All operational records are sample data; analysis is explicitly scripted and external services are not connected. No named customers, fabricated commercial results, testimonials or statistics are presented.

## Art direction and behavior

- **AI OPERATIONS:** a deep green operational workspace with source context, a reasoning surface and a human review area. Source selection changes what can be proposed. Applying an action updates the connected local views and subsequent source excerpts. Every nonempty selection can be analyzed; only selected writable sources can receive proposals. The subsequent focused interaction audit is recorded in `AI-OPERATIONS-AUDIT.md` and supersedes the earlier Operations state behavior.
- **FLOW:** a pale green process environment with large directional typography and a six-step execution line. Manual mode requires each advance; Automated mode carries the same input through the sequence. Three briefs change the proposed route, draft question and task. Every stage exposes an inspectable payload and execution trace.
- **SIGNAL:** a vermilion typographic field, rendered live with a procedural WebGL shader. Field, Echo and Contour modes respond to an energy control and pointer movement. Pause, reduced motion, visibility management and an interactive typographic fallback are included.

The experiments use full-width environments and live interface fragments. There are no portfolio cards, device mockups or dashboard screenshot illustrations. The existing A/L slash motif, system typography and site palette provide continuity. The rest of the site is preserved apart from navigation and the necessary replacement of the AI production section's old example with inquiry routing.

## Independent review corrections

A separate read-only review found and helped resolve these implementation issues:

1. Applied Operations actions initially left source excerpts and next-run reasoning stale. The local workspace now updates both so they describe the same state.
2. Keyboard focus inherited button text colors that did not contrast sufficiently with the surrounding environment. Each lab now supplies a contrasting focus color.
3. The Signal fallback energy rule was overridden by a later stylesheet. Dynamic spacing is now declared in the lab stylesheet; both energy endpoints and mode changes were checked after forced context loss.
4. Mobile line-break removal joined adjacent words in the process brief and Flow introduction. Explicit spaces now preserve readable copy.
5. The old generator could leave a retired route available. The build now removes that output and the validation script prevents its return.

## Local verification

| Check | Result |
| --- | --- |
| Responsive widths | 320, 390, 768, 1366 and 1920px checked; no horizontal document overflow. Mobile labs grow vertically to keep controls and text usable. |
| Operations | Run, source inspection, missing-context rejection, review/apply, reset and updated source excerpts verified. Sample communication remains a draft. |
| Flow | Manual stepping and automated completion verified. Brief changes update the route and result. Inspectable outputs remain available after completion. |
| Signal | Live WebGL rendering, mode selection, energy range and pause verified. Forced graphics-context loss retains a visible fallback, working mode changes and working energy spacing. Reload restores WebGL. |
| Reduced motion | Signal reports reduced motion and does not allow it to be re-enabled. Flow completes without the timed visual sequence. Browser emulation is reset after testing. |
| Keyboard | Native selection, range Home/End, buttons, existing tab navigation and mobile menu behavior remain available with visible focus treatment. |
| Static output | Two HTML documents, local links and assets, unique IDs, accessible ID references, required labels and absence of retired project output checked. |
| Runtime | No browser errors or warnings captured during final checks. |

The source remains dependency-free HTML, CSS and JavaScript with a standard-library Python renderer. The public site calls no external AI, CRM, messaging or analytics service. GPU work is capped in pixel density and stops when not visible. Local checks do not certify physical-device performance, Safari/Firefox behavior, field Core Web Vitals or live hosting behavior.

This revision remains local and unpublished, as requested earlier in this task. The current source archive includes this revised implementation; the existing Sites identity is retained for a future publication.
