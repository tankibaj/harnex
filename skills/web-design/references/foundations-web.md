# Foundations for the web

last-checked: 2026-10-25
scope: HIG foundations that transfer to web apps, translated to HTML/CSS; neutral look, no Apple fonts or system color values. Translation table and settled conflicts: see SKILL.md.

## Color ([HIG](https://developer.apple.com/design/human-interface-guidelines/color))
- Semantic tokens, not raw values: `--bg`, `--fg`, `--accent`, ... (list in SKILL.md Theme tokens). Name by purpose, never by hue.
- **Never** redefine a token's meaning: no `--separator` as text color, no `--fg-secondary` as background.
- **Never** same color for different meanings. One color = one job (interactive, status, selection). If accent marks links, plain text is not accent.
- Define every token for light, dark, and `prefers-contrast: more`. Even single-theme apps: define both light and dark values.
- Increased contrast: more differentiation per token, not a tint tweak. Minimum: still meets a11y.md contrast table.
- Accent restraint: primary action + status (unread badge, selected tab) only. Not body text, not every button.
- Colorful or image-heavy content: keep control colors neutral so controls and content do not blend. Brand color lives in content, not all controls.
- **Never** color alone for status, links, selection, errors, chart series: add text, icon, shape, pattern (WCAG 1.4.1).
- Avoid pairs hard for color-blind users (red/green, blue/orange) as the only differentiator.
- Cultural meaning varies (red = danger vs good luck; white = purity vs mourning; stock up = green vs red). Check per locale; keep status text explicit.
- Wide gamut: optional `color(display-p3 ...)` inside `@supports (color: color(display-p3 1 1 1))`, sRGB value first as fallback. Similar P3 colors may look alike on sRGB, P3 gradients may clip: verify on sRGB.
- Attach an sRGB (or P3) profile to raster images; sRGB is safe default.
- Test in bright and dim ambient light and on several displays: colors read muted in bright light, saturated in dark.
- User-chosen color: native `<input type="color">` before a custom picker.
- Glass/translucent surfaces shift nearby colors: re-check contrast on top of them (see Materials).

## Dark Mode ([HIG](https://developer.apple.com/design/human-interface-guidelines/dark-mode))
- Follow `prefers-color-scheme` by default (`color-scheme: light dark` on `:root` so native controls and scrollbars follow).
- A manual toggle is allowed on the web (explicit `[data-theme]`, stored per viewer); default = system. HIG says no app-specific appearance setting for native apps; on the web, shared devices and embeds make an override common. Settled here, not HIG.
- Must look good in both themes; system theme can change while the page is open (listen to `matchMedia` change, never read once).
- Palette: dimmer backgrounds, brighter foregrounds; **not** a mechanical inversion. Re-pick every token.
- Contrast **never** below 4.5:1 in dark; custom text/background aim 7:1 for small text.
- Elevated surfaces: base background darkest, raised layers (popover, dialog, sheet, card on card) slightly lighter via `--bg-elevated`. Depth by lightness, not by shadow alone.
- Soften content images with white backgrounds: `filter: brightness(.9)` or `@media (prefers-color-scheme: dark)` swap to a dark asset; avoid glowing white rectangles.
- Full-color icons/images: one asset if it works in both, else a `<picture>` with `media="(prefers-color-scheme: dark)"` source. Flat icons: `currentColor`.
- Dark-only UI only when content demands it (immersive media viewing).
- Test dark with increased contrast and reduced transparency, separately and together.

## Layout ([HIG](https://developer.apple.com/design/human-interface-guidelines/layout))
- Hierarchy by importance: most important content top and inline-start (reading order). DOM order = visual order (a11y.md).
- Align elements: aligned = related, indented = subordinate. Group with whitespace, container shapes, or separators.
- Progressive disclosure: `<details>`, disclosure buttons (`aria-expanded`), menus, nested views, tabs, to cut initial content and choices.
- Controls vs content: distinguish them (elevation, border, optional glass) but do not hide content behind solid bars; let content run under floating controls when safe.
- Decide layout by available width, never by device or UA sniffing: media queries on viewport, container queries (`@container`) on the component's own box.
- Same functionality at every width; only the amount visible changes (nav bar to drawer, extra actions into an overflow menu). Layout stays recognizable.
- Handle: width and height changes, orientation, resizable windows, browser zoom, text-size changes, locale (RTL, date/number formats, text length). Test smallest and largest first.
- Safe areas: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` and `padding: env(safe-area-inset-top)` etc. **Must** keep controls and content out of notches, rounded corners, home indicator.
- Never `user-scalable=no` or `maximum-scale=1` (WCAG 1.4.4).
- *(house)* Readable measure: cap running text around 60-80 characters (`max-inline-size: 70ch`); wider columns hurt reading.
- Text-size change: stack inline items (icon, timestamp, badges) under text; fewer columns; rows grow, never clip. Use `min-block-size`, never fixed `height`, on text containers.
- Reflow at 320 CSS px wide (400% zoom) without two-dimensional scroll, except data tables, maps, code (WCAG 1.4.10).
- Never truncate in scrollable regions unless a view exposes the rest; allow wrap, avoid `text-overflow: ellipsis` on primary content.
- Background art: never change aspect ratio; `object-fit: cover`, let it extend for very wide or tall windows.
- Primary elements stay toward the top at any text size.

## Typography ([HIG](https://developer.apple.com/design/human-interface-guidelines/typography))
- Neutral font stack (`system-ui, sans-serif` or the repo's brand font). Do not mimic Apple's fonts. Few typefaces; too many blur hierarchy.
- Sizes in `rem`, never `px`, so user font-size settings apply. Body 16-17 px; **nothing under 11 px**, *(house)* prefer 12 px+.
- Avoid weights below 400 (no Thin/Light/Ultralight): use 400, 500, 600, 700. If a thin custom face is mandatory, go larger than the table below.
- Hierarchy through weight, size, color; keep relative hierarchy when text scales. Not every word must grow: tab labels and chrome may stay put while content scales.
- Custom fonts must stay legible at all sizes, honor user zoom, and survive bold-text preferences (no fixed-width boxes). `font-display: swap`; fallback metrics close to the web font.
- Leading: loose for long passages and wide columns (*(house)* 1.5+); tight (*(house)* about 1.2-1.3) only for height-constrained single lines (list row, button); **never** tight for 3+ lines.
- WCAG 1.4.12: layout must survive line-height 1.5, paragraph spacing 2x, letter-spacing .12em, word-spacing .16em without clipping.
- Suggested ramp, derived from iOS Large (default) sizes; a suggestion, not a rule. Scale as a whole for your brand.

| Role | px | rem | Line px | Weight |
|---|---|---|---|---|
| Large title | 34 | 2.125 | 41 | 400, 700 emph. |
| Title 1 | 28 | 1.75 | 34 | 400, 700 emph. |
| Title 2 | 22 | 1.375 | 28 | 400, 700 emph. |
| Title 3 | 20 | 1.25 | 25 | 400, 600 emph. |
| Headline | 17 | 1.0625 | 22 | 600 |
| Body | 17 | 1.0625 | 22 | 400, 600 emph. |
| Callout | 16 | 1 | 21 | 400 |
| Subhead | 15 | 0.9375 | 20 | 400 |
| Footnote | 13 | 0.8125 | 18 | 400 |
| Caption 1 | 12 | 0.75 | 16 | 400 |
| Caption 2 | 11 | 0.6875 | 13 | 400 |

- iOS leading is about 1.3x; for web paragraphs prefer `line-height: 1.5` on body and long text, the ramp's leading only for short UI text.
- Large text must still work: ramp sizes at the iOS largest accessibility step reach about 53 px for body; verify layouts at 200% and beyond.
- Use `clamp()` for fluid headings only with a `rem` floor and cap; never `vw` alone (breaks zoom).

## Icons ([HIG](https://developer.apple.com/design/human-interface-guidelines/icons))
- One icon set per product; same size, level of detail, stroke weight, perspective across all icons, custom and library mixed.
- Size in `em` so icons scale with adjacent text; stroke weight matches text weight unless emphasizing.
- Simple, familiar metaphor tied directly to the action or object. Icon-only buttons need an accessible name (`aria-label`) and a tooltip; prefer icon + text when meaning is not universal.
- Optical alignment: asymmetric glyphs (download arrow) get padding baked into the SVG, then center the box geometrically.
- Selected-state variant (filled) only when needed; state also via `aria-pressed`/`aria-current`, not just icon.
- Inclusive: gender-neutral figures; avoid imagery that is culture-specific.
- Text in icons only when essential; localize it. Suggested text passages: abstract bars, mirrored in RTL.
- Vector (SVG) for interface icons; inline or sprite, `fill="currentColor"`, `aria-hidden="true"` when decorative.
- Standard action to icon (generic names; pick from your set):

| Action | Icon |
|---|---|
| Done, Save confirm | checkmark |
| Cancel, Close, Deselect | x |
| Delete | trash |
| Undo / Redo | curved arrow back / forward |
| Add | plus |
| More (overflow only) | ellipsis (three dots) |
| Edit, Rename | pencil |
| Compose, New | square with pencil |
| Duplicate | two overlapping squares |
| Copy / Paste | two documents / clipboard |
| Cut | scissors |
| Move to, Folder | folder |
| Attach | paperclip |
| Select | circle with checkmark |
| Search | magnifying glass |
| Filter | three horizontal lines narrowing |
| Share, Export | box with arrow up |
| Print | printer |
| Account, Profile | person in circle |
| Like / Dislike | thumb up / thumb down |
| Archive | archive box |
| Calendar, Alarm | calendar, alarm clock |
| Text formatting | bold, italic, underline, align left/center/right/justify |

- Reserve ellipsis for overflow; give other menus a distinct icon (chevron, caret).
- Do not use Apple's symbol artwork or replicas of Apple hardware.

## Images ([HIG](https://developer.apple.com/design/human-interface-guidelines/images))
- High-resolution for every bitmap: `srcset` with `1x/2x/3x` (density) or `w` descriptors with `sizes`; design at lowest resolution, scale up.
- Formats: photos JPEG, or AVIF/WebP with fallback; flat artwork, icons, logos SVG; PNG only for raster needing lossless; 8-bit palette PNG where 24-bit is wasteful.
- Vector control points on whole pixel values for crisp edges at 1x.
- Include a color profile per image (sRGB safe).
- Set `width`/`height` (or `aspect-ratio`) to avoid layout shift; `loading="lazy"` below the fold.
- Meaningful images need `alt`; decorative get `alt=""` (rules in a11y.md).
- Test on real devices and densities: pixelation, stretching, compression.

## Motion ([HIG](https://developer.apple.com/design/human-interface-guidelines/motion))
- Purposeful: motion supports the experience, never gratuitous; excess causes distraction and discomfort.
- Optional: **never** the only way to convey important information; pair with text or state change.
- Feedback motion realistic and directional: a panel revealed by sliding down does not dismiss sideways.
- Brief and precise beats prominent. Avoid motion on frequent interactions (typing, row selection, repeated toggles).
- Cancellable: never force waiting for an animation; input during it works at once.
- Durations are the house heuristic from SKILL.md Settled conflicts (150-250 ms, up to 300-400 ms for large surfaces, ease-out), not HIG.
- Prefer `transform` and `opacity`; avoid animating layout properties.
- Respect `prefers-reduced-motion: reduce` (WCAG 2.3.3). Concrete substitutions:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: .01ms !important;
  }
}
```

| Normal | Reduced |
|---|---|
| Slide, zoom, scale in/out | Cross-fade (opacity) |
| Springy overshoot | Linear/ease-out, no bounce |
| Parallax, depth/z-axis shifts | Static |
| Animated into/out of blur | Fade without blur |
| Auto-playing loops, carousels | Static first frame, manual controls |
| Smooth scroll | `scroll-behavior: auto` |
| Motion tied to gestures | Keep direct tracking (it is the user's own motion) |

- Fast blinking or flashing: **never** more than 3 flashes per second (WCAG 2.3.1); see a11y.md.

## Materials ([HIG](https://developer.apple.com/design/human-interface-guidelines/materials))
- Optional. Rules and fallbacks: SKILL.md (translation table: floating controls only, `@supports` solid fallback, off under `prefers-reduced-transparency`). That query is Chromium-only: also go solid under `prefers-contrast: more`.
- **Never** apply glass/blur in the content layer (page background, cards, reading surfaces); only to the functional layer that floats above it (nav bars, toolbars, popovers).
- Use sparingly: most important floating controls only; overuse distracts.
- Regular: blurs and adjusts luminosity behind; use when the surface holds lots of text or background may hurt legibility (popovers, menus, sidebars, dialogs).
- Clear: highly translucent, only over visually rich media (photo, video) for immersion. Over bright content add a dark dimming layer at 35% opacity.
- Thicker (more opaque) = better text contrast; thinner = more context. Choose by purpose, not by how it looks.
- Contrast is measured on the worst background that can scroll beneath; ensure the resting state is legible.
- `-webkit-backdrop-filter` plus `backdrop-filter`; test performance on low-end devices.

## Right to left ([HIG](https://developer.apple.com/design/human-interface-guidelines/right-to-left))
- Set `dir` (or `<html dir="rtl">`) and `lang`; use CSS logical properties everywhere: `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `text-align: start`, `border-start-start-radius`. Flex/grid follow `dir` for free.
- Text: align to interface direction. A paragraph of 3+ lines aligns by its own language (`dir="auto"`, `unicode-bidi: plaintext`); 1-2 line blocks follow context. Align every item in one list the same way, even when one is a different script.
- Numbers: **never** reverse digits inside one number (541, phone, card number). Numeral system varies by locale (Hebrew Western Arabic; Arabic Western or Eastern by region): use `Intl.NumberFormat`.
- Mirror:
  - Controls showing progress or order: sliders, progress bars, steppers, rating, sequences (reverse order, not the digits).
  - Back/next/previous arrows and chevrons, breadcrumb separators, disclosure carets, nav and drawer side.
  - Icons implying reading direction or forward/backward motion: text-align bars, list indents, reply/forward arrows, undo/redo.
  - Order-meaningful image sequences (chronological, alphabetical).
  - Implement with `[dir="rtl"] .icon-dir { transform: scaleX(-1); }`, or `:dir(rtl)`.
- **Never** mirror:
  - Logos, trademarks, universal marks (checkmark, plus, x).
  - Photos, illustrations, artwork (meaning and copyright); make a new version if tied to direction.
  - Controls naming a real direction or place ("right"), maps, clocks, *(house)* media transport (play/pause), real-world objects, right-handed tools.
  - Numerals themselves; code and URLs (wrap in `dir="ltr"`).
- Balance scripts: Arabic/Hebrew look small beside Latin caps; raise RTL font size by about 2 px.
- Complex icons: judge components and balance; a badge that modifies meaning (plus on a cart) moves with the base.
- Localized icons for ones containing letters; for non-reading concepts prefer a text-free glyph.
- Test with `dir="rtl"` plus a long string in every component.

## Branding ([HIG](https://developer.apple.com/design/human-interface-guidelines/branding))
- Brand voice and tone in all copy (writing.md).
- Brand color: minimal on controls; primary action and status only. Express brand in content.
- Custom font OK if legible at every size and zoom; custom for headings, a legible UI face for body and captions.
- Express brand through familiar components; keep sizing, placement, behavior conventional.
- Branding defers to content: no brand-only banners eating space; logo once in the header, not on every screen.
- Use standard patterns even in stylized UI: expected locations, standard icons for common actions, usual navigation and modality.
- No splash screens or forced tours (SKILL.md); onboarding/welcome screen instead if brand moment is needed.

## Privacy ([HIG](https://developer.apple.com/design/human-interface-guidelines/privacy))
- Collect only what the feature needs; ask nothing before the person shows interest in that feature; make each request specific.
- Be transparent on collection and use; link a readable privacy notice at point of collection.
- Process on the client where possible; minimize what goes to servers.
- Ask for permission (notifications, geolocation, camera, microphone, clipboard read, contacts via Contact Picker, Bluetooth/USB/serial, sensors) **in context**, after a user action that needs it, never on page load. Exception: the feature cannot work without it (a navigation app needs location).
- Browser prompt text cannot be changed; put the explanation in your UI before it. Pre-prompt screen only when essential:
  - One button, label "Continue" or "Next", never "Allow" (looks like the browser's Allow, causes accidental grants).
  - No extra actions (Close, Not now) unless legally required consent.
  - Use the browser prompt after it; handle `denied` with a plain explanation and a settings pointer, never nag.
- Purpose string = explanation text next to the trigger: brief, complete sentence, active voice, specific, sentence case, ends with a period. Good: "Your location is used to find stores near you." Bad: "Location is needed for a better experience." (passive, vague); "Allow location." (command, no reason).
- Prefer one-shot, scoped access: Geolocation single `getCurrentPosition` on a "Use my location" button over `watchPosition`; `<input type="file">`/File System Access picker over broad access.
- Tracking: sensitive. Consent screens for local privacy law are fine; never pre-checked, never bundled, never misleading, no incentive-for-consent, no fake browser prompts.
- Protect data: HTTPS only, secure cookies (`Secure; HttpOnly; SameSite`), no secrets in localStorage.
- Avoid relying on passwords: prefer passkeys (WebAuthn, `navigator.credentials`, conditional UI `autocomplete="username webauthn"`); if passwords remain, require 2FA, support password managers (`autocomplete="current-password"`/`"new-password"`, allow paste).
- Avoid custom auth schemes; use standard OAuth/OIDC or passkeys.
- Never store passwords or secure content in plain text.

## Inclusion ([HIG](https://developer.apple.com/design/human-interface-guidelines/inclusion))
- Inclusive design is iterative; examine assumptions. Inoffensive is not inclusive: aim for welcoming.
- Perspectives: age, gender identity, race, ethnicity, sexuality, physical and cognitive attributes, permanent/temporary/situational disability, language, culture, religion, education, social and economic context.
- Language rules (plain language, you/your, no gendered terms, no idioms, humor caution): writing.md.
- No prior skills required; give a clear path to deeper understanding; skippable step-by-step help.
- Gender: ask only when required (health, legal); offer inclusive options (nonbinary, self-describe, decline), optional pronouns. Nongendered default avatars.
- People and settings in imagery: range of age, body type, ability, ethnicity; avoid stereotyped roles; avoid unnecessary affluence; relatable places and objects.
- Security questions: universal prompts, not context-specific experiences (college major, first car).
- Disability: never assume it prevents wanting the experience; never use it as a negative metaphor; people-first wording unless the community prefers otherwise.
- Languages: internationalize first (`lang`, `Intl`, text expansion, RTL), then localize; users pick language and region separately for dates, times, currency.
- Check color meaning per locale (see Color).
