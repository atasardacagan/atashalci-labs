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

