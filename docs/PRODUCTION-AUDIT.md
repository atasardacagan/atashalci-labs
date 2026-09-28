# Final production audit — Atashalci Labs

Completed locally: 24 September 2026. Scope: the feature-complete studio website, its three self-initiated Labs, adaptive cursor, generated output and local preview. The revision remains unpublished; the original Sites identity and configured canonical origin are preserved.

## Outcome and scope

The audit began with the rendered website and its actual controls, before implementation changes. Independent read-only reviews then covered prototype state logic, renderer lifecycle, release output and the final diff. Justified defects were fixed and retested. No meaningful unresolved defect was found within the exercised local scope. This is not certification of every browser, physical device, assistive technology or production host.

The existing art direction was retained: the dimensional typographic hero, editorial hierarchy, restrained off-white/dark/red palette, A/L registration cursor, distinct full-width Lab environments, capabilities, production narrative and direct contact ending. No generic portfolio grid, client logos, fabricated commissions, testimonials, awards or business metrics were introduced. Each Lab retains the explicit `SELF-INITIATED / LAB EXPERIMENT / PROTOTYPE` disclosure and fictional/local-data explanation. Retired portfolio content and routes are absent from public output.

## Implemented corrections

| Finding | Correction and verification |
| --- | --- |
| The hero could return from WebGL context loss with a blank canvas. | Reacquire the instancing extension with the restored context, rebuild GPU state, and reveal the canvas only after a successful draw. Real context loss/restoration now returns the visible IDEA composition. |
| Rendering failures could retain allocated GPU resources. | Clean up shaders, programs, buffers and textures on failed initialization. A source-level mock verified shader and texture failure paths without retained handles. |
| Paused/reduced-motion pointer movement still did bounds reads or requested drawing. | Exit pointer handling before that work. Ten pointer movements in each mode produced zero additional draws and zero bounds reads in the diagnostic harness. |
| Repeatedly selecting the current production tab or Flow mode reset completed work. | Selected-state activation is idempotent. Product routing and Flow progress survive repeated selection; actual changes still reset/cancel as intended. |
| Flow's initial stage state differed from its reset state; inspection feedback was weak. | Render initial state through the same path, associate stage controls with a named focusable result region, and announce preview/completed inspection state. |
| Some small labels failed contrast, and changing production stages broke heading order. | Adjusted the affected muted colors and made subordinate sheet titles paragraphs. Retested all six production stages and the full mobile page. |
| Signal Contour used dark overlay labels on its dark rendered field. | Apply off-white coordinates/instructions to rendered Contour mode. Retain appropriate fallback colors. |
| The experiment index overflowed around 601px. | Added the needed intermediate-width single-column layout. Full-document and key-element bounds checks pass across 17 sizes. |
| No-JavaScript/module failure could leave empty hero visuals and apparently available controls. | Default typographic fallbacks, independent readiness markers and initially inert controls. Readable explanations remain where a module is unavailable; static links/navigation continue to work. |
| Touch Signal instructions asked users to move a pointer across the field. | Show an energy/mode instruction for coarse or no-hover input. Desktop instructions remain appropriate to pointer interaction. |
| A production fragment looked like a clickable review action but was only a demonstration. | Changed it to the static statement “Human review required.” |
| Sharing metadata had no complete brand preview; error-page assets were unversioned. | Added a checked-in 1200 × 630 social PNG/SVG, complete Open Graph/Twitter metadata, and a generated noindex 404 with shared asset fingerprinting. |
| The basic local server did not reproduce branded unknown-route responses. | Added a local-only preview server with genuine HTTP 404 responses, response headers, safe path handling and content-aware caching. |
| Retired layout CSS and minor copy defects remained. | Removed unused legacy portfolio rules while retaining 404 styles; corrected review grammar. No new runtime library was added. |

## Interaction acceptance

- **Homepage and navigation:** logo, section anchors, CTA destinations, mobile menu open/close/Escape, footer return, and skip-to-content keyboard behavior checked. After the skip link, Tab reaches the first hero control rather than restarting header navigation.
- **Hero:** entered words, rebuild action, direction range, motion pause, pointer response, resize, fallback and actual context restoration checked. Readable content remains outside the canvas.
- **AI Operations:** all four source toggles and inspectors, three questions, processing, review, apply, repeat, source changes, cancellation and reset checked. All sources can generate/apply the expected three local record changes. Knowledge + CRM in reply mode modifies CRM only. Zero sources disables execution with an explanation. Approval never sends a message or changes an external record.
- **Flow:** six manual advances, three different briefs, automated execution, stage inspection, active-mode reselection, reset and cancellation checked. Reduced motion completes the automated sequence immediately while preserving inspectable results. Email remains a draft.
- **Signal:** Field/Echo/Contour, energy, pause, touch controls, global pause, offscreen stopping and real context restoration checked. Restoring retains the chosen mode/energy.
- **Capabilities and production:** all four capability tabs, all six production stages, arrows, keyboard Home/End and the inquiry-routing example checked. Re-selecting Product retains its routed result.
- **Cursor:** current source retained after the earlier dedicated audit. Final browser probes confirmed accurate coordinates, one overlay, default/hover/label/target states, contrast, and native cursor restoration over the word input. Coarse touch has no overlay. Existing lifecycle, forced-colors and failure evidence remains in `CURSOR-AUDIT.md`.
- **Contact:** email URLs and copy feedback checked without sending email. GitHub profile responded successfully. The communication/founder revision below supersedes the original social-contact arrangement.

## Responsive and visual verification

Full-document horizontal overflow and visible interactive/text-element bounds were checked at:

| Width × height | Result |
| --- | --- |
| 1920 × 1080 | No horizontal overflow |
| 1440 × 900 | No horizontal overflow |
| 1366 × 768 | No horizontal overflow |
| 1280 × 800 | No horizontal overflow |
| 1100 × 800 | No horizontal overflow |
| 1024 × 768 | No horizontal overflow |
| 820 × 900 | No horizontal overflow |
| 768 × 1024 | No horizontal overflow |
| 740 × 900 | No horizontal overflow |
| 701 × 900 | No horizontal overflow |
| 650 × 900 | No horizontal overflow |
| 601 × 900 | No horizontal overflow |
| 430 × 932 | No horizontal overflow |
| 390 × 844 | No horizontal overflow |
| 375 × 812 | No horizontal overflow |
| 320 × 740 | No horizontal overflow |
| 844 × 390 | No horizontal overflow |

Rendered inspection supplemented these measurements, including wide desktop hero, desktop Operations and Flow, tablet capabilities/Signal, the formerly failing intermediate index width, and mobile menu, Labs and contact. Final spot-checks at 1920, 1440, 1366, 1024, 430 and 375 preserved the composition, readable controls and clear lab disclosures. Sizes were emulated in the local Chromium-based preview; this does not imply physical-device coverage.

## Accessibility, motion and failure behavior

Axe-core 4.13 scans used WCAG 2 A/AA, WCAG 2.1 AA, WCAG 2.2 AA and best-practice tags. After fixes, the full desktop page and mobile page had zero automatically detected violations. Each of the six settled production states also had zero violations. The final 430px mobile Contour-state scan had 50 passing checks and zero violations. Canvas imagery, decorative marks and some contrast conditions require manual assessment; an automatic scan alone does not establish WCAG conformance.

Native controls, associated labels, focus indicators, announced results, tab navigation, mobile Escape behavior and skip navigation were exercised. Heading order was checked in dynamic states. With reduced motion active, decorative render loops stop, cursor lag/transitions are removed, scrolling is immediate and Flow retains all results without timed animation.

With JavaScript disabled, the hero and Signal display fallback typography, prototype controls remain inert, explanatory notices remain readable, and the mobile navigation and email links work. Blocking only Operations demonstrates independent module readiness: its unavailable notice remains while Flow/site controls initialize. Real WebGL context loss displays a usable fallback and restoration reestablishes the canvas. Unsupported GL and failed shader/texture allocation were also covered in a one-off source harness.

## Performance and engineering evidence

- All **57 Operations state tests** pass, including the 48 source/direction combinations and approval/reset/cancellation invariants. An independent deterministic mixed-transition diagnostic also completed 10,000 transitions.
- Every JavaScript and MJS asset passes syntax validation. Output validation passes for **2 pages and 35 local references**, with accessible IDs, asset hashes, credibility disclosures and social metadata checks.
- Signal observed 29 draws during approximately 990ms/60 display frames while visible, consistent with its intentional 30fps ceiling. A paused observation of approximately 971ms produced zero draws. After scrolling settled with both renderers offscreen, neither drew.
- The source harness verified no stale extension calls after restoration, no scheduled frames while hidden/offscreen, no pointer work in paused/reduced states, and no retained handles on the exercised allocation-failure paths. This is a targeted lifecycle diagnostic, not a complete browser GPU-memory profile.
- A local diagnostic at 4× CPU slowdown, 150ms network latency, 200,000 bytes/s download and 75,000 bytes/s upload observed **FCP/LCP 936ms**, **CLS 0.003**, DOM completion 1,039ms and load 1,043ms, with no observed long tasks. This is one synthetic local measurement, not field Core Web Vitals, a Lighthouse score or an INP certification.
- Assets total approximately **154 KB raw / 66 KB estimated gzip**, including the sharing image and editable SVG. These totals are not the homepage transfer size. The social card is metadata-only during ordinary browsing; no external font, tracking script or third-party runtime request is required by the page.
- No unexplained runtime warning/error was observed in the final normal-state console check. Expected forced-failure and unknown-route diagnostics are not ordinary browsing errors.

## Output, SEO and hygiene

The generated homepage has an English language declaration, descriptive title/description, one canonical matching the preserved origin, consistent Open Graph/Twitter fields, favicon, and a fingerprinted real 1200 × 630 PNG. Only the homepage is in the sitemap. The branded error page is noindex. Local-reference checks reject placeholder links, missing assets, duplicate IDs, unsafe new-tab links and stale hashes.

Local HTTP checks confirmed homepage 200; branded 404 for unknown routes, directory listings, dotpaths, `_headers` and encoded parent-path requests; matching-hash assets receive immutable caching while stale/unversioned assets receive no-cache. Existing nosniff, referrer and permission headers are applied by the preview. Basic source review found no exposed credential, external API integration, debug endpoint, analytics or user-controlled HTML injection path. The temporary accessibility scanner is removed from the public output before packaging.

## Remaining validation boundaries

The site was tested in the local Chromium-based browser, with input, viewport, reduced-motion, throttling and failure emulation. Safari, Firefox, Edge on physical devices, real screen-reader sessions, field INP and the eventual public host/CDN were not independently exercised. No evidence here should be presented as that coverage.

Publishing was explicitly deferred by the user. `.openai/hosting.json` and `https://atashalci-labs.acagan0.chatgpt.site` remain intact. A later publication must verify that intended origin's actual routing, caching, headers and social crawler fetches. The two founder destinations are intentionally retained before their personal sites launch, as requested; domain availability is not a release check for this change.

## Repeatable checks

```sh
python3 scripts/build.py
python3 scripts/check.py
node --test scripts/ops-state.test.mjs
python3 scripts/serve.py --port 4187
```

Run JavaScript syntax checks for assets when changing them. The preview is a development server and is not intended to be exposed as a production hosting service. CSS and JavaScript in `dist/assets` are authored source; do not delete them as generated build output. The social PNG is checked in and should be visually re-exported/reviewed if its SVG composition changes.

## Communication and founder revision — 24 September 2026

The public company contact is now `info@atashalci.com` in the visible address, both mailto links, copy action and hero-word-driven email CTA. Dynamic behavior reads the visible address so it cannot retain an independent old recipient. The former social profile was removed from both Studio and contact; no replacement platform was added.

The Studio now closes with “BEHIND THE LABS / Built by two.” and two editorial, full-row anchors for Arda Çağan Ataş and Onur Salcı. Their exact destinations are `https://www.ardacaganatas.com` and `https://www.onursalci.com`. Each uses `_blank`, `noopener noreferrer`, a clear personal-domain cue and an accessible new-tab notice. The existing branded cursor shows ENTER. Names and domains are always visible; hover/focus only adjusts color and the directional arrow. No biography, title, achievement or photograph was invented. The company contact composition remains the primary conversion moment.

Focused validation after the change:

- No old personal email or removed social-profile reference remains in the current authored source, documentation or public output.
- Twelve widths passed overflow and founder/contact text-bounds checks: 1920, 1440, 1280, 1024, 820, 768, 601, 600, 430, 390, 375 and 320px. Desktop, tablet and 390px mobile were also visually inspected. Founder target heights were 100px or greater across this matrix.
- Keyboard Tab moves between semantic founder anchors with a visible outline; names and domains remain readable on touch. Motion uses the existing reduced-motion override.
- The actual clipboard result was `info@atashalci.com`. Submitting LABS in the hero produced `mailto:info@atashalci.com?subject=An%20idea%20for%20Atashalci%20Labs%3A%20labs`.
- The focused Studio/contact axe scan reported zero automatic violations and 20 passing checks. This is scoped automated evidence, not full assistive-technology certification.
- The desktop pointer displayed ENTER on a founder link. A clean reload reported no console errors or warnings.
- Existing build/reference validation and the changed JavaScript syntax check pass. Personal destinations were verified in rendered anchors without requiring those intentionally future websites to be live.

This update remains local and unpublished. Unrelated sections and hosting identity are preserved.
