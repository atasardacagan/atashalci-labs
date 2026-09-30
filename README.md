# ATASHALCI LABS

An independent web design and development studio in Istanbul. The website uses a cream and indigo editorial design, a full-screen typographic hero, a four-column illustrated capability gallery, full/half-width color scenes and three clearly disclosed, self-initiated web interface studies. It does not present invented client projects, testimonials or commercial results.

Live: [English](https://atasardacagan.github.io/atashalci-labs/) · [Türkçe](https://atasardacagan.github.io/atashalci-labs/tr/). [Repository](https://github.com/atasardacagan/atashalci-labs).

## Build and preview

```sh
python3 scripts/build.py
python3 scripts/check.py
python3 scripts/serve.py --port 4187
```

Open http://127.0.0.1:4187/ or http://127.0.0.1:4187/tr. Reuse a running server if the port is already occupied. The build and preview use Python's standard library; no package installation is needed. Serve `dist` as the web root.

## Current source

| Location | Purpose |
| --- | --- |
| `templates/home.html`, `templates/partials/` | Shared homepage, header, hero, web studies and footer |
| `templates/404.html` | Localized error page |
| `locales/en/atelier.json`, `locales/tr/atelier.json`, `locales/*/reference.json` | Web-focused editorial copy, capability gallery, form labels and study feedback |
| `locales/en/static.json`, `locales/tr/static.json` | Metadata and shared labels |
| `dist/assets/atelier.css`, `reference.css` | Base illustration primitives and measured reference layout |
| `dist/assets/atelier.js` | Menu illustration previews, study controls, workflow scrolling, email draft preparation and clipboard sharing |
| `dist/assets/i18n.js`, `locale-preference.js` | In-place localization, URLs, metadata and explicit preference |
| `dist/assets/cursor.js`, `cursor.css` | Retained historical cursor source; not loaded by the current design |
| `dist/assets/images/atelier-garden.webp` | Retained artwork from the first draft; not loaded by the current page |
| `dist/assets/fonts/` | Self-hosted Fraunces Black, Allura wordmark and their SIL Open Font Licenses |
| `dist/assets/illustrations/` | Six original native SVG studio illustrations |
| `dist/assets/share-card.png`, `share-card.svg` | Social preview and editable type/shape composition |
| `scripts/build.py`, `check.py`, `serve.py` | Static rendering, validation and local preview |
| `docs/ATELIER-REDESIGN.md` | Current redesign decisions, asset provenance and QA |
| `.github/workflows/deploy-pages.yml` | Automatic GitHub Pages build and deployment |

Edit templates and `locales/`, then rebuild. HTML and `dist/assets/locales/` are generated. CSS, JavaScript, fonts and images in `dist/assets/` are authored source: do not delete this directory as a disposable bundle.

Previous AI Operations, Flow, Signal and direction assets remain as retained source, but their controllers and styles are not loaded by the current homepage. Older audit documents describe those previous versions. The current implementation and subsequent live-reference correction are documented in `docs/ATELIER-REDESIGN.md`.

## Website studies

1. **Editorial:** cycle between three visual compositions.
2. **Spatial:** switch the architectural composition between day and night.
3. **Expressive:** change typography and color through warm, bold and quiet moods.

These are interface studies, not complete client websites. Every study is labeled **SELF-INITIATED / LAB EXPERIMENT / PROTOTYPE**, with curated Turkish labels. Language changes preserve their current state. The existing `#lab-001`, `#lab-002` and `#lab-003` links remain valid. Sharing copies a direct link; a selected, read-only URL is available if clipboard access fails. No share action sends messages to anyone.

## Language and contact

English is the first-visit default. Turkish lives at `/tr` locally and `/tr/` on GitHub Pages. Only an explicit selection is saved in `localStorage` under `al.language`; there is no location or browser-language inference, translation API, analytics or tracking. Locale changes update visible copy, accessibility labels, document language, metadata and navigation without remounting the studies. Both languages have server-rendered HTML and reciprocal hreflang links.

Company contact: `info@atashalci.com`. The brief form validates locally and prepares an encoded `mailto:` link. The visitor opens the draft, reviews it and sends it from their own email app; the site has no submission endpoint or lead database. Field values are not placed in the site URL or persistent storage and survive in-place language changes. With JavaScript unavailable the form stays hidden and the direct email link remains usable. Studio partners: Arda Çağan Ataş and Onur Salcı. Their supplied personal domains remain preserved in template data attributes, without publishing unavailable links. No LinkedIn profile is added.

## Validation

```sh
python3 scripts/check.py
node --test scripts/ops-state.test.mjs scripts/i18n-runtime.test.mjs
python3 scripts/routes.test.py
node --check dist/assets/atelier.js
```

The 82 existing Node checks cover localization and the retained Operations model; the latter is not part of the new homepage. Twelve Python checks cover routing and catalog contracts. New study interactions, language retention, clipboard behavior and responsive layouts were checked in Chrome. The redesign record distinguishes browser evidence from automated checks and physical-device coverage.

The image/font subdirectories are included in the validator's entire-directory asset size estimate. That total includes retained legacy source and is not a claim about initial page transfer. Social crawlers use the 1200 × 630 PNG; the browser does not download it during ordinary browsing.

## GitHub Pages

A push to `main` triggers the existing GitHub Actions workflow. It validates the build and routes, runs the existing tests, then renders production URLs using the Pages origin and project base path. Only `dist/` is published; the local `_headers` file is excluded because GitHub controls production response headers.

Reproduce the production build:

```sh
SITE_ORIGIN=https://atasardacagan.github.io SITE_BASE_PATH=/atashalci-labs SITE_TRAILING_SLASH=1 python3 scripts/build.py
SITE_ORIGIN=https://atasardacagan.github.io SITE_BASE_PATH=/atashalci-labs SITE_TRAILING_SLASH=1 python3 scripts/check.py
```

Run `python3 scripts/build.py` without those variables to restore root-based local preview output. This command does not publish. Any local `.openai/hosting.json` belongs to historical hosting and is not used by GitHub deployment. The public static website runs independently of the preview server and the developer's computer.
