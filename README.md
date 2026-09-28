# ATASHALCI LABS

A bilingual website for a new AI-native creative technology studio. The site presents three self-initiated experiments, not a client portfolio. Every lab is labeled **SELF-INITIATED / LAB EXPERIMENT / PROTOTYPE**. There are no client logos, testimonials, invented commercial results or fabricated commissions.

The production host is GitHub Pages: [English](https://atasardacagan.github.io/atashalci-labs/) and [Turkish](https://atasardacagan.github.io/atashalci-labs/tr/). The [GitHub repository](https://github.com/atasardacagan/atashalci-labs) contains the source and deployment workflow. Once deployed, the static website runs independently of the local preview or the developer's computer.

## Build and preview

Run from this directory with Python 3.9 or newer:

```sh
python3 scripts/build.py
python3 scripts/check.py
python3 scripts/serve.py --port 4187
```

Open [English](http://127.0.0.1:4187/), [Turkish](http://127.0.0.1:4187/tr) or [Experiments](http://127.0.0.1:4187/#experiments). Reuse the running server if port 4187 is already occupied. Serve `dist` as the web root; opening HTML directly does not resolve root-relative assets correctly.

The build uses Python's standard library. It renders English and Turkish homepages and branded 404 pages from shared templates, fingerprints asset URLs by their content, creates the sitemap and robots file, and removes the retired `dist/work` directory so an obsolete portfolio route cannot survive a rebuild. Only the two localized homepages are indexed, with reciprocal hreflang links. The preview server returns real HTTP 404 responses, applies `dist/_headers`, disables directory listings, and caches an asset immutably only when its URL fingerprint matches its current contents. It is a local development preview; production hosting still needs its own response-header and routing verification.

## Source ownership

| Location | Purpose |
| --- | --- |
| `locales/en/`, `locales/tr/` | Curated static, site, Operations, Flow and visual copy. |
| `dist/assets/i18n.js` | Shared in-place locale runtime, navigation, metadata and scroll preservation. |
| `dist/assets/locale-preference.js` | Early opt-in language preference; first visits remain English. |
| `docs/LOCALIZATION-AUDIT.md` | Bilingual architecture, browser QA and publication boundaries. |
| `docs/LOCALIZATION-FINAL-AUDIT.md` | Independent final EN/TR review, repaired edge cases and new browser evidence. |
| `templates/404.html` | Branded error page, generated with versioned assets and noindex metadata. |
| `templates/home.html` | Homepage structure and the AI production narrative. |
| `templates/partials/header.html`, `footer.html`, `hero.html` | Shared brand, navigation and opening experiment. |
| `templates/partials/experiments.html` | The introduction and three complete lab environments. |
| `dist/assets/experiments.css` | Responsive lab layouts, controls and environment colors. |
| `dist/assets/operations.mjs` | Shared Operations state model, deterministic scenarios and its interface controller. |
| `dist/assets/experiments.js` | Local Flow prototype behavior. |
| `dist/assets/signal.js` | Procedural WebGL typography, motion controls and fallback. |
| `dist/assets/site.css`, `site.js` | Existing studio design system, navigation, capabilities and production stages. |
| `dist/assets/direction.css`, `direction.js` | Existing interactive hero. |
| `dist/assets/favicon.svg`, `wordmark.svg` | A/L brand assets. |
| `dist/assets/cursor.css`, `cursor.js` | Adaptive A/L cursor, surface contrast, input and motion lifecycle. |
| `dist/assets/share-card.svg`, `share-card.png` | Editable social composition and its 1200 × 630 PNG export. |
| `scripts/build.py`, `check.py`, `serve.py` | Dependency-free renderer, output validation and local preview. |
| `docs/PRODUCTION-AUDIT.md` | Final production audit, fixes, evidence and validation boundaries. |
| `docs/REDESIGN-AUDIT.md` | Current scope, honesty boundaries and verification record. |
| `.github/workflows/deploy-pages.yml` | Validation, production build and automatic GitHub Pages deployment. |

Edit shared templates and `locales/` rather than generated HTML or `dist/assets/locales/`, then rebuild. CSS and JavaScript are authored directly in `dist/assets/`; do not remove those assets as if they were generated bundle files. No package-manager installation is required.

## The experiments

**LAB 001 — AI OPERATIONS** uses fictional sample documents, a sample CRM inquiry, an internal handoff and a task queue. Visitors inspect and include/exclude sources, choose one of three questions, run a scripted agent and review its proposed action. Every nonempty source selection can be analyzed. Evidence and proposed changes are restricted to those sources. Read-only context can produce reference analysis without a writable proposal. Context → Judgment → Action takes 1,050ms under normal motion. Review previews current and proposed values before approval. Applying updates only the selected records; the analysis retains its explicitly labeled evidence from before approval. Settings changes cancel pending processing and invalidate the proposal, while already-approved workspace values remain clearly identified. Repeating an approved direction produces no duplicate writes. Reset restores the exact initial state and cancels pending callbacks.

**LAB 002 — FLOW** runs a sample inquiry through Lead → AI Analysis → CRM → Email → Task → Reporting. Three sample briefs produce different routes, questions and tasks. Manual mode advances one step per click; Automated mode runs the same sequence from one trigger. Visitors can inspect every stage before or after execution. Reset, actual mode changes and brief changes cancel pending execution. Selecting the already-active mode retains progress. Stage inspection announces its preview or completed status. Email remains a draft and every integration is simulated.

**LAB 003 — SIGNAL** renders a live typographic field with Field, Echo and Contour modes. Pointer position, an energy slider and pause/resume controls affect the result. It uses a locally rasterized word texture and a procedural shader, without external media or a video loop. Rendering stops while the canvas is offscreen, the page is hidden, or motion is paused. A deliberate text fallback retains mode and spacing controls if WebGL is unavailable or its context is lost.

These prototypes perform no AI API calls, account connections, external CRM changes or message sending. Their sample data are not claims about a real customer, existing client engagement or deployed product. Prototype data are not stored between page loads. Only an explicit language choice is remembered in local storage (`al.language`). There are no analytics or tracking scripts.

The existing AI-native production section uses an explicitly scripted inquiry-routing example for continuity with the labs. The hero and capability offering keep their established design. The Studio closes with a restrained “Built by two.” editorial moment: Arda Çağan Ataş and Onur Salcı link to their personal websites. Names and domains remain visible without hover, with full-row tap targets and the existing ENTER cursor label. No biographies or additional credentials are inferred.

## Adaptive cursor

The desktop cursor is built from a precise 3px point, two fine registration corners and the A/L slash. The outer instrument follows with 42ms interpolation, capped at an 8px displacement, and stops scheduling frames when it settles. Interactive controls receive a restrained expansion and accent; selected major links display EXPLORE or ENTER. Hero and SIGNAL canvases receive a targeting state only while their interaction is active.

Contrast follows the painted ancestor backgrounds, including nested and selected controls. The canvas can explicitly describe its rendered tone (SIGNAL Contour uses a dark field). A small opposing edge keeps the pointer legible over mixed WebGL content. Surface changes and completed background transitions refresh the cursor without continuous pixel sampling.

Extension hooks: `data-cursor-label="ENTER"` on a real link/button; `data-cursor="target"` on an interactive visual; `data-cursor="native"` for a native-pointer region; `data-cursor-tone="dark|light|accent"` for a painted surface such as a canvas. Lab and founder entry labels supplement existing accessible names. The overlay is decorative, ignores pointer events and never changes focus or captures input. It is also included on the error page.

Native text, select, checkbox-label, range, disabled-control and drag behavior is retained. The enhancement requires a mouse with fine-pointer/hover capability (including an attached mouse on a hybrid device), and its stylesheet must be loaded. Touch-only and forced-colors modes do not mount an overlay, pointer listeners or observers. Touch/pen input on a hybrid device restores native behavior until the mouse moves again. Keyboard input, window blur, leaving the document and hidden pages dismiss it. Reduced motion and the site’s global pause remove lag, scaling transitions and targeting embellishments. The exported mountCursor() replaces the previous owner; its destroy() removes listeners, observers, animation and native suppression. Pointer positions outside the viewport, held-button re-entry, lost overlays and callback errors safely fall back to the native cursor.

## Accessibility and verification

Native inputs, selects and buttons provide keyboard and touch control. Source inclusion has a 44px-wide label target, separate from inspecting source details. Operations uses a concise live status, politely announced source inspection and a keyboard-focusable analysis region. The site includes a skip link, visible focus indicators, live status feedback, a mobile menu supporting Escape, semantic headings, and reduced-motion alternatives. Signal has its own pause button and also respects the hero's global pause state. The automated Flow example completes immediately when reduced motion is active while preserving all stage results for inspection.

The hero and Signal render readable typography before WebGL succeeds. JavaScript-driven controls remain inert until their own controller is ready; a failed module leaves a plain explanation beside its prototype while other modules can continue. With JavaScript disabled, mobile navigation and email links remain usable. WebGL context restoration reacquires GPU resources and extension handles; failed initialization cleans up allocated resources.

`python3 scripts/check.py` validates local assets, links, anchors, IDs, accessible ID relationships, current asset fingerprints, canonical/social metadata, the real PNG dimensions, the sitemap and noindex error page. It also checks the three disclosure labels and prevents retired project text or routes from reappearing in public output. With Node.js available, use `node --test scripts/ops-state.test.mjs` for 59 state checks, covering all 48 source/direction combinations and cancellation, approval and reset invariants. Use `node --check` on JavaScript and `.mjs` files for syntax validation. The focused interaction audit is recorded in `docs/AI-OPERATIONS-AUDIT.md`.

The final whole-site review is documented in [docs/PRODUCTION-AUDIT.md](docs/PRODUCTION-AUDIT.md). Earlier redesign and cursor findings remain in `docs/REDESIGN-AUDIT.md` and `docs/CURSOR-AUDIT.md`. Local browser checks are not a claim of physical-device, Safari/Firefox or field Core Web Vitals certification.

The independent bilingual review is recorded in [docs/LOCALIZATION-FINAL-AUDIT.md](docs/LOCALIZATION-FINAL-AUDIT.md). Run `node --test scripts/ops-state.test.mjs scripts/i18n-runtime.test.mjs` for 82 Operations/localization tests and `python3 scripts/routes.test.py` for 12 HTTP/catalog tests. Locale failures and cancelled history transitions retain a coherent address and working page; scroll restoration reacquires re-created content by stable ID. The build rejects duplicate keys, mismatched locale structures and interpolation differences before writing output. The final EN/TR browser sweep covers 26 layouts, including intermediate widths, plus running/reviewed prototypes, keyboard controls, reduced motion, touch behavior and localized metadata. Seven additional runtime checks cover GitHub Pages project paths, preference redirects, Back/Forward navigation and localized missing routes.

## Social preview

The build configures Open Graph and Twitter large-image metadata using `dist/assets/share-card.png`. Its SVG source is kept beside it for editing. The PNG is a checked-in visual export, not automatically regenerated by the Python build; when editing the composition, export the SVG at exactly 1200 × 630 and inspect the result before rebuilding. The validator checks the PNG signature, dimensions and fingerprint. The homepage does not download this image during ordinary browsing. Social crawlers will see this revision only after publication to the configured origin.

## Company contact and founder links

The public company address is `info@atashalci.com`. The primary CTA and visible address use it directly; clipboard copying and the hero-word-driven CTA read the recipient from the visible address, avoiding a separate hardcoded personal recipient.

The Studio’s two personal-site anchors are `https://www.ardacaganatas.com` and `https://www.onursalci.com`, with `target="_blank"` and `rel="noopener noreferrer"`. They are intentionally included before those websites launch. The main contact remains the studio, and the existing GitHub link remains secondary. The removed social profile is absent from source and generated output.

## GitHub Pages deployment

The repository's Pages source is **GitHub Actions**. A push to `main` runs [Deploy website to GitHub Pages](.github/workflows/deploy-pages.yml); it can also be started manually from the repository's Actions tab. The workflow first validates the default build, local routes and interaction state, then builds and validates the production output using the actual Pages origin and base path. Deployment runs only after those checks pass. It uploads only `dist/`, without the preview host's `_headers` file. The generated English and Turkish pages, error page, assets and locale catalogs are served together.

To reproduce the current production build locally:

```sh
SITE_ORIGIN=https://atasardacagan.github.io \
SITE_BASE_PATH=/atashalci-labs \
SITE_TRAILING_SLASH=1 \
python3 scripts/build.py

SITE_ORIGIN=https://atasardacagan.github.io \
SITE_BASE_PATH=/atashalci-labs \
SITE_TRAILING_SLASH=1 \
python3 scripts/check.py
```

These settings apply the project path to assets, in-page navigation, language switching, canonical URLs, hreflang links and the sitemap. English remains the first-visit default; an explicit Turkish choice is remembered. GitHub Pages uses directory URLs, so Turkish is published at `/atashalci-labs/tr/`. If a custom domain is configured later, the workflow reads its origin and base path from GitHub Pages rather than retaining hardcoded project URLs in the generated website.

Run `python3 scripts/build.py` without those environment variables before returning to the root-based local preview. The default build preserves the original host configuration for compatibility; it does not publish anything. Any existing local `.openai/hosting.json` is historical project metadata and is not used by GitHub deployment. No hosting credentials or runtime server are required in this repository. GitHub manages production TLS, caching and response headers; the local preview's custom header rules are not a claim about Pages response headers.
