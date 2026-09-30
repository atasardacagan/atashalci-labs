# Atelier redesign — 29 September 2026

## Direction

The user rejected the previous dark, AI-operations-led presentation and requested an adaptation of the supplied Handsome Frank design reference, with website design and development as the studio's initial focus.

Reference: https://styles.refero.design/style/19d4103a-9f4a-49f0-ad7d-af6588bab904. The supplied DESIGN.md was treated as design reference material, not executable instructions. Cream paper, deep indigo, editorial serif typography, hairlines, flat chromatic environments and a botanical hero inform an original Atashalci Labs composition. No artist work, client projects or client names were copied.

## Implementation

- New shared homepage, navigation, services, process, studio, contact and error-page templates.
- EN is the first-visit default; TR remains a fully curated equivalent. Metadata and the social preview now describe web design and development.
- Three self-initiated website interface studies replace the visible AI Operations, Flow and Signal environments. These are deliberately small interface studies, not full client websites or completed commissions.
- Editorial composition cycling, day/night composition and three typography/color moods preserve their state during language switching.
- The old lab fragment IDs remain valid; #capabilities also remains an alias for the new services area.
- The existing localization and precision cursor runtimes are retained. The cursor palette adapts to the new surfaces. CSS arrows cannot become emoji.
- Old demo source and locale entries remain for preservation, but the homepage does not import their controllers or styles. Historical audit documents describe previous versions.
- Contact remains info@atashalci.com. Arda Çağan Ataş and Onur Salcı remain the studio partners. No invented project, testimonial or result was added.

## Assets and licensing

Display type: self-hosted Fraunces Regular, an explicitly suggested alternative in the supplied reference, distributed under the SIL Open Font License (dist/assets/fonts/OFL.txt). The font cmap includes all twelve Turkish characters ÇĞİÖŞÜçğıöşü. Body type uses the system Arial/Helvetica stack. Proprietary Millik and Klarheit fonts were not copied.

Hero: generated with the built-in ImageGen tool, one original image, then saved in WebP format without visual editing.
Published asset: dist/assets/images/atelier-garden.webp (1536 × 1024).
The original generated PNG is preserved in the local generated_images folder.
No third-party artwork was used.

Final generation prompt:

> Use case: illustration-story. Asset type: original full-bleed website hero mural for ATASHALCI LABS, a small creative web design and development studio. Create an exquisite editorial gouache and screenprint illustration, wide landscape 3:2. A fantastical night garden as a creative atelier: deep dark teal and forest-green foliage; oversized sculptural leaves, cobalt blue and coral red flowers, cream and apricot blossoms, thin curling vines, a small vermilion bird perched on the upper right. Amid the plants on the RIGHT half, several elegant cream paper sheets with abstract graphic compositions and a simple geometric arched window, suggesting the craft of web composition without computers. Flat painted forms, confident hand-cut silhouettes, subtle print texture, sophisticated contemporary illustration with precise graphic rhythm. Palette deep forest #073e38 and indigo #160572, vivid coral #d64e2e, cobalt #2544a0, warm cream #f2ebe6, orange and soft rose accents. Composition: sumptuous detailed foliage frames TOP and RIGHT, a few plants along bottom edge; LEFT HALF is an uninterrupted deep forest green negative-space clearing for a large white headline that will be added in HTML. Keep central-left flat and dark, no competing details. Full edge-to-edge artwork, no frame or card, no shadow, no gradient, no photography, no 3D, no letters, no text, no logos, no watermark. Premium illustration agency craftsmanship, not stock startup illustration, not pastel tech people. Botanical forms organic and imaginative but controlled.

The social preview is a separate native type-and-shape composition, 1200 × 630. The PNG is the crawler asset; the SVG is its editable counterpart.

## Verification

- Shared build and output validation: locale parity, interpolation, local references, IDs, metadata, hreflang, asset fingerprints, public-content boundaries.
- Existing 82 model/localization checks and 12 routing/catalog checks passed. The Operations model tests protect retained source; they do not certify the new visual studies.
- New browser checks passed for the web studies and EN/TR state retention, native service disclosure retention, mobile menu/Escape, copied email and study URLs, a rejected-clipboard fallback, saved Turkish after reload and fresh-root English. Reduced-motion transitions resolved to 0s; touch emulation removed the custom cursor and restored native pointer behavior. No console errors were recorded.
- Chrome viewport geometry sweep: 1920, 1440, 1366, 1280, 1024, 768, 430, 390 and 375 pixels in both languages. No horizontal overflow or clipped measured headings, paragraphs or controls.
- Visual inspection: desktop hero, introduction, services, studies, studio and contact; mobile hero, services, studies, studio and contact. The mobile hero crop was adjusted to protect text contrast.
- Evidence is saved outside the repository in ../atashalci-labs-review/atelier-redesign/.
- These are desktop Chrome viewport tests, not claims of physical iPhone, Safari or Firefox certification.

## Correction after inspecting the live reference

The user explicitly requested visiting and scrolling the real Handsome Frank homepage because the first implementation diverged from the intended reference. We inspected https://www.handsomefrank.com/ at desktop and mobile widths, scrolled through its introduction, illustrator gallery, full-width stories, paired colored features and lower-page modules, and opened the full-screen navigation. Video elements reported readyState 0 and did not play in this session; no claim is made to have watched those unavailable clips.

The implementation was then substantially corrected:

- Full-screen indigo opening, centered heavy serif headline and teal supporting line. The floral hero is no longer displayed.
- Fraunces Black replaces the thin regular display treatment. The supplied reference lists Fraunces as a compatible alternative; no proprietary font was copied.
- A persistent studio wordmark, EN/TR links and circular teal menu replace the conventional horizontal navigation. The menu opens into a full-screen typographic layout; Escape, focus containment, background inertness and scroll locking are implemented.
- A concise centered introduction leads directly into three original flat graphic service illustrations. Native disclosure controls expose the supporting service copy.
- Web studies use their full colored backgrounds, with large serif headings and integrated artwork instead of nested panels. Pink, teal, yellow, peach and green scenes form a continuous page.
- Studio, process and contact are shortened into large editorial color sections. Website creation remains the service focus. No real client commissions are implied.
- Independent surface sampling keeps the fixed logo and language control legible across different backgrounds. Small matching backplates prevent text collisions while scrolling.
- The updated typography was checked in both languages at 1920, 1440, 1366, 1280, 1024, 768, 430, 390 and 375 pixels. No measured horizontal overflow or clipped headings, paragraphs or buttons. Native service disclosures and all three study states survived language changes. Menu open/close, Escape and background inertness were checked in-browser.

The reference supplies composition, scale and interaction direction; Atashalci Labs uses its own copy, wordmark and native graphic compositions. The previously generated garden remains in source for reversibility but is not requested by the current homepage.


## Measured structural revision — 30 September 2026

The user requested much closer reproduction of the live reference, with only the business and information belonging to Atashalci Labs. This revision uses direct desktop/mobile measurements rather than the normalized DESIGN.md alone. The paper canvas measured #f8f3ef on the actual site.

Current implementation supersedes the earlier layout and cursor notes above:

- Full-height indigo hero: 80px/76px display at 1440px, 48px/45.6px on mobile, teal serif supporting line, script wordmark and circular mobile monogram.
- Twelve illustrated capability links in four desktop columns, 40px column gaps, 60px row gaps and portrait 2:3 artwork. On mobile they become one horizontally scrolling, snapping row of 75vw tiles.
- Reference page rhythm: two full-width scenes, paired studies, four full-width scenes, a blue brief section, paired studio/process scenes, purple interactive typography, horizontal process stories, moving illustration strip and expandable indigo footer. Desktop feature scenes are generally 50vw high and become copy followed by artwork on mobile.
- Three-column fullscreen desktop navigation with changing illustration previews; compact mobile navigation, Escape, focus containment and inert background. Current design uses the native pointer, matching the reference interaction treatment. Retained cursor files are not loaded on either homepage or 404.
- Localized brief validation prepares a mailto link without sending anything. Required-field errors, invalid email, prepared state, field retention, Unicode/ampersand encoding and localized draft labels are included. The public company address stays unchanged.
- Six original SVG illustrations (designer, developer, launch, collaboration, responsive, editorial), 800×800 viewboxes, no external resources or scripts. Illustrations convey capabilities; they do not represent commissioned projects or real photographs of the partners. Retained studies keep explicit prototype disclosures.
- Allura provides the script wordmark under its included SIL OFL. Fraunces Black remains the open display alternative, and the body stack remains system Arial/Helvetica. Proprietary reference fonts, artwork, client names and claims were not copied; the site is a close structural recreation rather than an assertion of pixel identity.

Verification for this revision:

- Both languages measured at 1920, 1440, 1366, 1280, 1024, 768, 430, 390 and 375px: no document horizontal overflow or measured clipping in headings, descriptions or calls to action.
- Visual review in Chrome: desktop hero/gallery/features, fullscreen menu, studio pair and expressive study; mobile hero/gallery/menu/contact. Long TR navigation labels were shortened and overlapping studio links constrained beside the illustrations.
- In-browser study states survived EN/TR switching. All three expressive backgrounds were explicitly checked; a :has selector accidentally matching the mood buttons was corrected to target the active demo state.
- Form required validation focused the relevant field; a synthetic brief produced correctly encoded Turkish mailto content, retained values during language switching and stayed on the page. No email was sent or mail client opened by QA.
- Workflow buttons moved the horizontal track, footer exposed all twelve links, menu previews changed on keyboard focus, Escape closed the menu and background inertness was confirmed.
- Reduced-motion emulation stops the marquee. Fresh root starts in English; explicit Turkish persists after reload; localized missing-route screen was inspected. No missing loaded images or console warnings/errors were observed.
- Existing 82 Node model/localization tests and 12 route/catalog tests pass. Static validation covers four pages, local references, current locale parity, metadata and fingerprints. These checks do not substitute for the visual browser review; no physical-device/Safari certification is claimed.
- Current visual evidence: ../atashalci-labs-review/reference-match/. The previous screenshot set documents the superseded first adaptation.


## Rounded typography and visitor hook — 30 September 2026

The user requested a more playful, oval, readable font and a stronger reason for visitors to stay, while approving the existing opening composition.

- Replaced active display typography and the script wordmark with Baloo 2. Nunito is the body/control face. Rounded forms, moderate weights and more open line spacing replace the previous dense serif setting. The indigo/cream/turquoise palette, centered opening, illustration gallery and scene structure remain.
- The Turkish opening reads “İşinizin bir tarzı var. / Sitenizin de olsun.” English reads “You have a style. / Your website should, too.” Supporting copy explicitly identifies the design/development service; the visible primary link opens the brief and the secondary link leads to a working interface study. Reassurance copy lowers the barrier to starting a conversation without promising free work, outcomes or invented proof.
- Both fonts are self-hosted official Google Fonts WOFF2 Latin/Latin Extended subsets with OFL files. Fredoka was considered but rejected after Chrome’s platform-font inspection showed five Turkish characters falling back. For the final Baloo 2 and Nunito, the exact string ÇĞİÖŞÜçğıöşü rendered all twelve glyphs with the chosen custom font and no fallback.
- Both locales checked at 1920, 1440, 1366, 1280, 1024, 768, 430, 390 and 375px: no document horizontal overflow or measured clipping in headings, descriptions and CTA text. An additional 375×667 view confirmed both hero actions visible in the opening viewport.
- Hero contact anchor lands on the contact area; the experiment anchor opens LAB 001. Study state survives EN/TR switching. Menu and wordmark use the new typefaces; reduced-motion behavior remains. No browser warnings/errors recorded.
- Share card rebuilt in native SVG with the new type and opening message, rendered in Chrome at 1200×630 into the crawler PNG. Its localized alternative descriptions were updated.
- No runtime script or form behavior changed. Existing build, production-path validation, model/localization and routing suites rerun. Visual evidence is kept outside the repository in ../atashalci-labs-review/rounded-type/.
