# English / Turkish localization

Implemented and checked locally on 26–27 September 2026. This revision is unpublished. The original Sites identity and configured public origin remain unchanged.

## Architecture and content ownership

English is the primary language at `/`. Turkish is served at `/tr`. The same templates produce both complete HTML documents and both localized 404 pages. Initial content, metadata and accessible names do not depend on a translation request or external service. There is no `/en` route, browser-language detection, geographic inference or automatic translation.

`locales/en/` and `locales/tr/` contain matching `static.json`, `site.json`, `ops.json`, `flow.json` and `visual.json` catalogs. There are **425 paired top-level keys**, including structured production stages, capabilities and deterministic Lab scenarios. The build rejects duplicate keys; the checker verifies recursive key/type/list-length and interpolation parity. HTML fragments are curated source content. User-submitted words are inserted as text and URL-encoded in the contact subject.

The build embeds only the active catalog. The first switch fetches the other versioned catalog; subsequent switches reuse it. Current gzip estimates are 17,869 bytes for the English HTML, 19,048 bytes for Turkish, 2,622 bytes for the shared runtime and 10,119 / 10,943 bytes for the alternate EN / TR catalogs. No framework or translation dependency was added.

All controllers import the same `./i18n.js` module. It must remain a singleton: do not additionally include a query-versioned copy in HTML. The unversioned shared module is served with revalidation; `_headers` declares `Cache-Control: no-cache` for it. Other document assets and locale catalogs retain content fingerprints.

## Navigation and persistence

The EN / TR control uses native links with 44px targets, an active underline and translated accessible names. It sits with the desktop navigation and remains reachable at the lower edge after scrolling; mobile uses the compact fixed treatment.

An unmodified primary click switches presentation without document navigation. The runtime updates the URL, document language, title, descriptions, social metadata, canonical, internal home/section links and current-language state. Browser Back restores the matching locale. Modified link clicks retain native browser behavior.

An explicit choice is stored as `al.language`. Returning to `/` with a stored Turkish preference resolves to `/tr` before page content is painted. A fresh root visit remains English. Direct `/tr` visits are Turkish regardless of browser settings. Storage failures are optional; switching and explicit URLs still work.

The first fetch can fail without changing the current page or language. A localized retry message appears beside the selector. A successful retry clears it. Scroll position is bookmarked after the catalog arrives, so scrolling during a slow request is not undone. Stale asynchronous requests cannot overwrite a more recent choice.

## Retained interactions

Language is a presentation concern, separate from prototype state:

- Operations retains sources, selected question, processing phase/timers, proposed changes, approved values and the original pre-approval evidence. Stable record IDs are presented through either catalog. Results are curated deterministic variants, not live translations.
- Flow retains its brief, execution mode, completed stages, inspected stage, timer and execution trace. Switching during an automated run does not restart or cancel it.
- Signal retains its WebGL canvas/context, mode, energy and local pause. Hero input, assembly amount and motion state also survive.
- The untouched default hero word is IDEA / FİKİR. A submitted word remains the visitor's input across switches. Its contact rendering retains the submission locale, avoiding dotted/dotless-I corruption.
- Capabilities, the current production stage, the routed-product result, mobile menu state and copy-feedback state remain active.
- The cursor is not remounted. Existing attribute observation picks up concise EXPLORE / KEŞFET and ENTER / GİR labels. Contrast, native input behavior, keyboard dismissal, touch and reduced-motion behavior are preserved.

The site does not use GSAP, split-text line caches or pinned-scroll measurements. Existing resize observers keep the canvases aligned after layout changes. The locale runtime preserves the current section/anchor offset across translated reflow.

## Editorial and visual work

English hero wording is preserved. Turkish uses the same type hierarchy with intentional breaks, including “Fikirler yön ister.” and “AI ile. İnsan kararıyla.” Brand and experiment identifiers remain unchanged. Turkish headings and source/status copy were reviewed and revised for concise, natural language.

Mobile Turkish hero copy receives the space it needs through layout changes rather than a blanket smaller type scale. Flexible pane labels, controls and grids accommodate longer text. Spaces around editorial line breaks prevent joined words when those breaks are hidden at smaller widths.

The existing Arial/Helvetica and Courier New system stacks support Turkish characters; no downloaded Latin-only font subset is used. The hero raster now has additional vertical room and optical clearance for upper accents. Glyph bounds inform its fit so İ, Ğ, Ö, Ü and cedillas survive the 3D extrusion. English unaccented geometry keeps its original scale. The Turkish glyph set ÇĞİÖŞÜ was visually checked in 3D, and the custom word ÇİĞKÖPRÜ was submitted and retained correctly through EN/TR switching.

`info@atashalci.com`, both founder URLs and all brand/product identifiers are unchanged. No LinkedIn link, client portfolio claim, invented commission or testimonial has been introduced.

## SEO and social previews

Both initial HTML documents contain localized titles/descriptions and Open Graph/Twitter copy. English uses `lang="en"`, Turkish `lang="tr"`; the runtime keeps these synchronized after switching. Canonicals point to the corresponding `/` or `/tr` URL on the existing configured origin. Each page and sitemap entry includes reciprocal `en`, `tr` and `x-default` relationships, with the root as `x-default`.

The existing universal 1200 × 630 branded PNG is shared across both languages. Its descriptive alternative and social title/description are localized. Both 404 pages remain `noindex` and omit homepage canonicals. The preview serves `/tr` directly, redirects `/tr/` to `/tr`, and returns localized real HTTP 404 responses for missing routes.

## Verification evidence

Automated source/build verification passed:

- Four generated documents; 90 local references; unique IDs, accessible ID relationships, all content fingerprints, metadata, locale catalogs and sitemap relationships.
- 425 paired locale keys with matching recursive structures and interpolation parameters.
- **59 / 59 Operations tests**, including all source/question combinations, cancellation and approval invariants, curated EN/TR results and retained approved history.
- Syntax checks for every authored JavaScript module and a clean whitespace/diff check.

The local Chromium browser was tested in **both languages** at widths **1920, 1440, 1366, 1280, 1024, 768, 430, 390 and 375**. The 18-layout sweep found no document overflow or out-of-viewport text/control boxes in the tested default states. Desktop and mobile screenshots were reviewed for the hero, experiments, Labs, capabilities, production narrative, studio/founders and contact compositions. Screenshots and raw responsive/accessibility results are saved in the adjacent `atashalci-labs-review/localization/` folder.

Interaction checks included English mid-page → Turkish with the current Flow section preserved within one pixel; Operations processing → language switch → review → approval → switch back with the same selected sources and approved record; automated Flow switching while running and completing all six stages; Signal Contour at 72% with pause retained; custom Turkish input and contact casing; active capability and completed production result retention; mobile menu switching and Escape; browser Back; reload persistence; remembered Turkish root visit; and a fresh root visit returning English.

Object identity checks confirmed one unchanged cursor overlay, unchanged hero/Signal canvas nodes and unchanged document time origin across switching. The Turkish founder hover displayed GİR with the existing light-surface cursor treatment. Touch emulation removed the custom cursor. Reduced motion displayed localized controls and completed the automated Flow immediately with all results intact.

A blocked alternate-catalog request retained English and the original URL, displayed a readable error, then recovered on retry. HTTP checks verified both homepages and localized missing-route responses. The server-rendered Turkish fallback and mobile navigation were also inspected without the interactive controllers.

axe-core 4.13 checks of settled EN/TR layouts at 1440 and 375 reported **zero automated WCAG 2 A/AA and WCAG 2.1 AA violations**. Animated/translucent canvas text and decorative glyphs require visual judgment; those surfaces were inspected separately. The founders' named container uses an explicit group role. This is not a claim of complete accessibility certification.

## Maintenance and publication boundary

Edit locale source files and shared templates, then run `python3 scripts/build.py` and `python3 scripts/check.py`. Never hand-edit the generated HTML or merged `dist/assets/locales/` catalogs. Add equivalent keys to both languages and preserve interpolation names. Keep URLs, enum IDs and state identifiers outside translated presentation strings.

The work is validated on the local preview, not deployed. Before future publication, confirm the existing Site/domain and its clean `/tr` routing, localized error handling, response headers and cache behavior. Static hosting must map `/tr` to `tr/index.html` and `/tr/*` misses to the Turkish error document. Verify the public social preview after deployment. Physical-device, Safari/Firefox and field performance checks are outside this local Chromium verification.
