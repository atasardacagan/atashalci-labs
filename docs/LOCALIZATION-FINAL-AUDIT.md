# Final independent EN/TR audit

Review dates: 2026-09-27–28. Candidate reviewed: `6a60ae6`. Scope: the existing local bilingual website, including conditional prototype states. This revision remains **local and unpublished**.

## Architecture retained

English `/` and Turkish `/tr` are generated from shared templates and five curated catalog files per language. Each document contains its active catalog; the alternate language is fetched on demand and cached for the document lifetime. One shared locale module updates copy, metadata, navigation and controller presentation in place. Stable identifiers own prototype state. There is no framework hydration, translation service, geolocation language selection, duplicated client page tree or new dependency.

An explicit language choice is stored under `al.language`. A saved Turkish choice can redirect a returning root visit before paint; a first visit with no preference stays English. Direct `/tr` works independently of saved preference. Native modified clicks remain native links. The early preference script tolerates unavailable storage.

The motion implementation uses canvas/WebGL, ResizeObserver, IntersectionObserver and CSS transitions. There are no GSAP, ScrollTrigger, split-text or pinned text measurements to refresh. Locale handlers update geometry and accessible descriptions as needed without replacing canvas or cursor owners.

## Findings fixed

| Finding | Implemented correction |
| --- | --- |
| Back/Forward changes the URL before an uncached locale arrives. A failed request could leave an English document under a Turkish URL. | Failed history loads reconcile the URL to the retained working locale, keeping query and fragment. Localized failure feedback remains available for retry. |
| Selecting the already-rendered language during a pending history translation cancelled the request but could leave the mismatched URL. | The same-locale fast path now reconciles navigation without re-rendering the page. |
| Scroll bookmarks retained only a DOM node. Re-created production result content lost its logical anchor. | Bookmarks also retain the stable anchor ID and section offset. Restoration reacquires replacement nodes or falls back to the surviving section. |
| Versioned locale runtime requests could receive contradictory `Cache-Control` headers from the preview server. | The server emits a single authoritative policy. Only an exact current asset fingerprint receives immutable caching. |
| `/index.html` and `/tr/index.html` served duplicate homepage addresses. | Local preview aliases redirect once to `/` or `/tr`, preserving queries. `/tr/` also remains canonicalized. Encoded missing Turkish paths consistently receive the Turkish 404. |
| Build validation did not reject every malformed catalog before writing output; static validation did not cover runtime key families. | Build rejects duplicate JSON keys, recursive shape differences and interpolation mismatch first. The checker now covers literal runtime keys, computed key families, localized title/error/social metadata and shared module import identity. |
| The tablet language control was narrower than its two 44px targets, separator and border. | Kept the existing 104px control width at intermediate breakpoints. |
| At 375px, the English hero's longest word exceeded its grid column by about 5px. | The narrow grid respects its first column's minimum content width, preserving font size and the composition. |
| The floating language selector permanently covered the last footer line at desktop page end. | Reserved bottom space at all widths. The final sweep measured at least 11.76px between that line and the selector. |
| Turkish included literal or ambiguous phrases and inconsistent review-queue terminology. | Refined 17 top-level entries, including nested Flow copy. Examples: “Bir AI sistemi.”, “Üretime daha yakın.”, “İnceleme kuyruğu”, and “Talebin izleyeceği yol netleşir.” Human direction now uses the existing “insan kararı” language. |
| The self-initiated disclosure could be clearer in Turkish. | All three labs now say “STÜDYO İNİSİYATİFİ / LAB DENEYİ / PROTOTİP”; the introduction explicitly explains that the work is self-initiated. |
| Two English static fallbacks differed from their initialized interfaces. | Aligned the initial knowledge excerpt and `HUMAN INPUT / LAB EXAMPLE` label with the existing dynamic English copy. Main English editorial headlines were retained. |

## Repeatable checks

Run from the project directory:

```sh
python3 scripts/build.py
python3 scripts/check.py
python3 scripts/routes.test.py
node --test scripts/ops-state.test.mjs scripts/i18n-runtime.test.mjs
```

- **425 paired catalog keys**, including recursive structures and interpolation placeholders.
- Four generated documents, 90 local references, IDs/accessible relationships, asset fingerprints, reciprocal `en`/`tr`/`x-default`, canonical, sitemap, robots and social metadata pass.
- **126 literal runtime keys** plus computed key families are checked; six controller imports resolve through one locale runtime URL.
- **59 Operations tests** pass, covering 48 source/direction combinations, cancellation, approval, reset and complete curated EN/TR result presentation.
- **16 locale runtime tests** pass. Four tests fail against the original runtime and pass with the fixes: failed history loading, cancelling pending history translation, replacement scroll anchors and removed-anchor section fallback.
- **12 route/catalog tests** pass against a temporary real HTTP server: status/body language, GET/HEAD, aliases, query retention, localized 404s, private path protection, cache policy, 304 revalidation, response headers and malformed catalog rejection.

Total: **87 automated tests**, in addition to the document/catalog validator and browser checks.

## Browser verification

Verified in the Codex Chromium preview at `http://127.0.0.1:4187`, using the actual local server and rendered controls.

### Routing, failure handling and orientation

- Fresh root with preference removed → English. Explicit Turkish selection → Turkish after reload and when returning through root. Clearing preference → root English again.
- Direct `/tr#lab-002`, language changes, Back and Forward retain coherent route, document language and section references.
- A browser-injected failure of the local Turkish catalog during real history traversal preserves the English page, repairs its URL and shows English retry feedback. Restoring the request and selecting TR succeeds.
- A deferred local catalog fetch during history traversal can be cancelled by choosing the current language; releasing the late response does not switch the document afterward.
- A settled mid-page switch retained the Capabilities offset within **0.21px**. A switch over replaced production-result content retained its offset within **0.04px**.
- The mobile menu stays open and localizes when switching languages. Escape closes it and restores visible keyboard focus to the menu control. Desktop → tablet → mobile resize and reload preserve the chosen language.
- Turkish 404 → English keeps the missing path, query and fragment, updates title and home links, and retains `noindex`.

### Interactive states

- Exact Operations acceptance flow: EN, choose knowledge + CRM, reply analysis, switch TR, apply, switch EN, reset. Sources and direction remain selected; only the chosen CRM record changes; pre-approval evidence remains unchanged; reset returns all four sources and initial workspace values.
- Empty source selection disables running and presents localized guidance. Knowledge-only analysis remains read-only. Switching during a running handoff analysis preserves processing and finishes with a Turkish result.
- Flow retains selected brief, inspected stage, completed steps and log across languages. All three briefs complete all six stages in manual and reduced-motion automatic modes in both languages at 375px. A normal animated automatic run continues through a locale switch and reaches its sixth localized log entry.
- All six production stages render in both languages at 375px. The executed Product result survives a language switch. All four capability tabs render correctly; Home keyboard navigation updates focus and selection together.
- Signal retains Contour mode, energy and pause across language changes. Hero and Signal canvas nodes remain the same; no extra document navigation is introduced by switching.
- The same cursor instance updates `EXPLORE` → `KEŞFET` while hovering. Target mode remains functional. Settled touch emulation removes the cursor; reduced motion sets its calm state and updates the motion control.
- Turkish input `çğıöşüi` becomes **`ÇĞIÖŞÜİ`**, preserving dotted/dotless I. Switching to English retains the submitted word; the contact wording preserves its original Turkish casing. Arial/Helvetica and Courier New remain the site's font stacks; Turkish glyphs were inspected in rendered headings, labels, names and the live hero.

### Responsive and visual comparison

Both languages were measured at **1920, 1440, 1366, 1280, 1101, 1024, 900, 801, 768, 601, 430, 390 and 375px**: 26 layouts. The final run found no page overflow, clipped-width headings/controls, off-viewport measured controls or header collisions. Language targets remain 44 × 44px. All page-end footer lines clear the floating selector.

Desktop section captures compare the hero, practice/experiment introduction, Operations, Flow, capabilities, AI-native production, studio/founders and contact. Signal was inspected live. Mobile captures specifically inspect the hero, open menu, long capabilities/studio headings, experiment disclosure and Operations controls. Dynamic production and Flow states were also measured at the narrowest required width.

### Accessibility, SEO and performance

- Axe-core WCAG A/AA checks on settled EN/TR pages at 1440 and 390px return **zero automated violations**. Canvas/complex color contrast remains a manual-review item. An initial scan during the existing production fade reported transitional opacity; the settled result was separately checked. This is not a screen-reader or full accessibility certification.
- Keyboard language activation, menu Escape/focus return, capability tab navigation, localized accessible names and reduced-motion controls were checked.
- Runtime title, description, Open Graph title/locale, canonical and `html lang` update together. Hreflang references remain reciprocal and point to the configured public origin. The universal branded social image is retained; supporting metadata is localized.
- First English load did not fetch an alternate catalog. Repeated in-document switching fetched Turkish once, used one locale runtime URL, kept two canvas elements and one desktop cursor, and produced no console warnings/errors in the test tab.
- The runtime increased by **347 bytes gzip**. Current estimates: EN HTML 17,792 bytes gzip; TR HTML 19,072; locale runtime 2,969; EN catalog 10,083; TR catalog 10,965. These are local compressed-size estimates, not field performance scores.
- Company email remains `info@atashalci.com`. Founder destinations remain `https://www.ardacaganatas.com` and `https://www.onursalci.com`. No LinkedIn link, client claims, retired Collection Management System references or external prototype writes were introduced.

## Evidence and release boundary

New browser evidence is saved beside the project under `../atashalci-labs-review/localization-final/`: `responsive-matrix.json`, `routing-stress.json`, `dynamic-states.json`, `accessibility.json`, `metadata.json`, and EN/TR desktop/mobile screenshots. Earlier evidence and the initial `LOCALIZATION-AUDIT.md` remain historical records; this document describes the final independent review.

The original Sites identity and configured origin are unchanged. This audit verifies the local application and preview HTTP behavior. Publication, production-host redirects/cache headers, social-crawler rendering on the deployed domain, physical devices, Safari/Firefox and field Core Web Vitals remain outside the verified scope. No publication was requested or performed.
