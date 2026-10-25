# Foundations

last-checked: 2026-10-25
scope: HIG foundations (accessibility through writing) for native iOS, iPadOS, macOS; numeric per-platform tables live in platforms/ios.md, platforms/ipados.md, platforms/macos.md.

## Accessibility ([HIG](https://developer.apple.com/design/human-interface-guidelines/accessibility))
- Interface must be intuitive (familiar, consistent interactions), perceivable (no single channel for info: sight, hearing, speech, touch), adaptable (support system accessibility features, let people personalize).
- Audit with Accessibility Inspector; communicate support via App Store Accessibility Nutrition Labels.
- Other platforms (tvOS, visionOS, watchOS): out of scope.

### Vision
- Support larger text: let people enlarge text/icons; ideally at least 200% enlargement. Custom UI or Dynamic Type (see Typography, platform files).
- Custom type styles: follow platform default/minimum sizes (iOS/iPadOS 17 pt default, 11 pt min; macOS 13 pt default, 10 pt min; see platforms/ios.md, platforms/macos.md).
- Thin custom font weight: go larger than recommended sizes.
- Meet minimum contrast (WCAG AA used by Accessibility Inspector; APCA also valid); use a contrast calculator:

| Text size | Text weight | Min contrast ratio |
|---|---|---|
| Up to 17 pt | All | 4.5:1 |
| 18 pt | All | 3:1 |
| All | Bold | 3:1 |

- If default colors miss minimum contrast, at least provide higher-contrast scheme when Increase Contrast is on.
- Check contrast in both light and dark appearances.
- Prefer system-defined colors: auto-adapt to Increase Contrast and light/dark.
- Never convey info by color alone (red-green, blue-orange pairs hard for color blind): add shapes/icons; consider letting people customize color schemes (chart colors, game characters).
- Describe interface and content for VoiceOver (screen reader); label elements.

### Hearing
- Never communicate dialogue or crucial info through audio alone. Offer text equivalents, with customizable text presentation:
  - Captions: textual equivalent of audible info, synced live (cutscenes, clips).
  - Subtitles: onscreen dialogue in preferred language (TV, film).
  - Audio descriptions: spoken narration of visual-only info, in natural pauses.
  - Transcripts: full text of audible + visual info (podcasts, audiobooks).
- Pair audio cues (success chime, error sound) with matching haptics. iOS/iPadOS: Music Haptics, Audio graphs.
- Augment audio cues with visual cues, esp. when action is off screen; point visually to where to interact.

### Mobility
- Offer sufficiently sized controls: default/minimum control sizes per platform (iOS/iPadOS 44x44 pt default, 28x28 pt min; macOS 28x28 pt default, 20x20 pt min; see platform files).
- Spacing as important as size: about 12 pt padding around elements with a bezel; about 24 pt around elements without a bezel (around visible edges).
- Simplest gesture possible for frequent actions; avoid custom multifinger/multihand gestures.
- Offer alternatives to gestures: core functionality reachable via more than one physical interaction (e.g. swipe-to-dismiss plus a button; swipe-to-delete plus edit-mode delete buttons).
- Support Voice Control: label elements appropriately.
- Integrate Siri and Shortcuts (voice-only tasks; Action button, Home Screen, Control Center).
- Support and test mobility assistive tech: VoiceOver, AssistiveTouch, Full Keyboard Access, Pointer Control, Switch Control; label elements.

### Speech
- Allow keyboard-only navigation (Full Keyboard Access). Never override system-defined or accessibility keyboard shortcuts.
- Support Switch Control (external hardware, game controllers, sounds).

### Cognitive
- Keep actions simple, intuitive, consistent; prefer system gestures/behaviors over custom gestures to learn.
- Minimize time-boxed UI (auto-dismiss on timer); prefer explicit dismissal.
- Games: consider difficulty accommodations (reduce success criteria, adjust reaction time, control assistance).
- Never autoplay audio/video without discoverable start/stop controls; consider global opt-out for autoplay.
- Respond to Dim Flashing Lights setting in video playback (opt out of bright frequent flashes).
- Be cautious with fast-moving, blinking animations (distraction, dizziness, epileptic episodes). When Reduce Motion is on, reduce automatic and repetitive animation (zooming, scaling, peripheral motion):
  - Tighten springs to reduce bounce.
  - Track animations directly to gestures.
  - Avoid animating depth changes in z-axis layers.
  - Replace x/y/z transitions with fades.
  - Avoid animating into and out of blurs.
- Optimize for Assistive Access (iOS/iPadOS streamlined mode):
  - Identify core functionality; remove noncritical workflows and UI.
  - Break multistep workflows into single interaction per screen.
  - Always ask confirmation twice for hard-to-recover actions (e.g. deleting a file).

### Platform considerations
- iOS, iPadOS, macOS: no additional considerations. visionOS comfort guidance: out of scope.

## App icons ([HIG](https://developer.apple.com/design/human-interface-guidelines/app-icons))
- Icon must express app purpose and personality, be recognizable at a glance; appears on Home Screen, search, notifications, settings, share sheets.
- Specs (layout size, appearances, color spaces): platforms/ios.md, platforms/ipados.md, platforms/macos.md.

### Layer design
- Prefer layered icons (background + one or more foreground layers) over flattened image; system applies Liquid Glass effects (specular highlights, refraction, translucency) that adapt to size and system version.
- Author foreground layers in design tool, import to Icon Composer (ships with Xcode): define background, place layers, apply effects, annotate default/dark/mono variants, preview across system versions, export to Xcode.
- Prefer clearly defined edges on foreground layers; no soft or feathered edges.
- Vary opacity across foreground layers for depth; import fully opaque layers and adjust transparency in Icon Composer to preview interplay with system effects.
- Background stands out and emphasizes foreground; gradients must respond well to system lighting. Icon Composer supports solid colors and gradients: custom background images rarely needed. If imported, background must be full-bleed and opaque.
- Prefer vector (SVG, PDF) layers; outline artwork, convert text to outlines. Mesh gradients and raster art: PNG (lossless).

### Icon shape
- iOS, iPadOS, macOS: provide square layers; system masks to rounded corners matching device bezel and UI curvature.
- Must provide unmasked layers: pre-masked layers hurt specular highlights and make jagged edges.
- Keep primary content centered to avoid truncation by masking; use grids in app icon production templates (Apple Design Resources).

### Design
- Embrace simplicity: one core idea, minimal shapes, simple background (solid or gradient); need not fill the canvas. Fine detail looks busy under system shadows/highlights and is lost at small sizes.
- Keep design visually consistent across all supported platforms.
- Consider filled, overlapping shapes with transparency/blur for depth (semi-transparent outer shape, not outline-only).
- Text only when essential to experience or brand (no accessibility/localization support, too small, cluttered). A mnemonic first letter is fine; avoid action words ("Watch", "Play") and context terms ("New", "For visionOS").
- Prefer illustrations to photos; avoid extremely thin line weights and sharp corners; don't replicate standard UI components or use screenshots.
- Never use replicas of Apple hardware products (copyrighted).

### Visual effects
- Let system do blur and effects; omit specular highlights, drop shadows between layers, bevels, blurs, glows. Custom effects are static and can conflict; if used, test in Icon Composer, simulator (Device Hub) or on device.
- Group layers (Icon Composer or design tool) to apply effects at group level; groups expose extra Liquid Glass options (specular highlights, refraction, translucency).

### Appearances
- iOS, iPadOS, macOS: people choose default, dark, clear, or tinted Home Screen icons; system generates variants you don't provide, or design your own for each.
- Keep core visual features consistent across default, dark, clear, tinted; never swap elements between variants.
- Dark and tinted icons must sit well beside system icons and widgets; dark is more subdued, clear and tinted more so; must stay visible, legible, recognizable.
- Base dark icon on the light icon: complementary colors, avoid excessively bright images; color backgrounds give most contrast in dark icons.
- Alternate app icons (iOS, iPadOS): optional via app settings; each must relate closely to content, never be mistakable for another app. Alternates need their own dark, clear, tinted variants. All icons subject to App Review Guidelines.

### Platform considerations
- iOS, iPadOS, macOS: none additional. tvOS, visionOS, watchOS: out of scope.

## Branding ([HIG](https://developer.apple.com/design/human-interface-guidelines/branding))
- Use brand voice and tone in all written communication.
- Apply accent/brand color judiciously: minimize on controls; use for primary actions or status indicators (unread badges, selected tab icon). To express brand through color, put it in the content layer (scrolls beneath Liquid Glass controls, picked up dynamically); not on all controls.
- Custom font OK if legible at all sizes and supports bold text and Dynamic Type; prefer custom for headlines/subheads, system fonts for body and captions (better small-size legibility).
- Express brand through familiar components; if customized, keep sizing, placement, behavior familiar for platform.
- Branding defers to content: no screen space for brand-asset-only elements; keep it refined and unobtrusive.
- Use standard patterns consistently even in stylized UI: expected locations, standard symbols for common actions, established navigation and modality conventions.
- Don't show logo throughout app unless essential for context.
- Never use launch screen as branding; use a welcome/onboarding screen instead.
- Follow Apple trademark guidelines: no Apple trademarks in app name or images.
- Platform considerations: none additional.

## Color ([HIG](https://developer.apple.com/design/human-interface-guidelines/color))
- System color values, grays, increased-contrast variants: platforms/ios.md (iOS/iPadOS), platforms/macos.md.

### Best practices
- Never use the same color for different meanings; keep color use consistent for status/interactivity (e.g. brand color marking borderless buttons interactive must not style noninteractive text).
- All colors must work in light, dark, increased contrast. Prefer system colors (variants built in). Custom color: supply light and dark variants plus an increased-contrast option per variant with significantly higher differentiation.
- Even single-appearance apps: provide both light and dark colors to support Liquid Glass adaptivity.
- Test under varied lighting: bright surroundings make colors look darker/muted; dark environments brighter/saturated.
- Test on different devices: True Tone adjusts white point; reading/photo/video/game apps can strengthen or weaken via `UIWhitePointAdaptivityStyle`. On Mac, test color profiles (P3, sRGB) in System Settings > Displays.
- Consider artwork and translucency effects on nearby colors (e.g. Maps light scheme in map mode, dark in satellite); colors look different behind translucent elements like toolbars.
- For user-chosen color, prefer system color controls (`ColorPicker`): consistent, saved colors available across apps.

### Inclusive color
- Never rely on color alone to differentiate objects, indicate interactivity, or convey essential info; add text labels or glyph shapes.
- Avoid colors that hamper perception: insufficient contrast, color-blind-indistinguishable pairs.
- Consider cultural color meaning (red = danger in some cultures, positive in others; e.g. stock rise is green in English, red in Chinese).

### System colors
- Never hard-code system color values; documented values are design reference only and may change per release. Use APIs (`Color`).
- iOS, iPadOS, macOS define dynamic system colors, semantically named by purpose (view backgrounds per hierarchy level; labels, links, separators); adapt to light/dark automatically.
- Never redefine semantic meaning of dynamic colors (no separator color as text color, no secondary label color as background).

### Liquid Glass color
- Liquid Glass has no inherent color: takes color from content behind. Can tint some elements (colored/stained glass) to emphasize e.g. primary call to action (system prominent buttons do this). Symbols/labels on it can be colored.
- Small elements (toolbars, tab bars) adapt light/dark to underlying content; default symbols/text monochrome (darker over light content, lighter over dark). Larger elements (sidebars) are more opaque for legibility.
- Apply color sparingly to glass and its symbols/text; only for elements that benefit from emphasis (status, primary actions).
- Emphasize primary actions by coloring the background, not symbol or text (e.g. accent on Done button). Never color the background of multiple controls (only Done tinted in a toolbar, not all buttons).
- Colorful backgrounds/rich content: avoid similar colors in control labels; prefer monochromatic toolbars/tab bars or an accent with sufficient differentiation. Mostly monochromatic content: brand color as accent works well.
- Mind color placement in content layer: avoid overlap of similar colors between content and controls; resting state (e.g. top of scroll view) must keep clear legibility, though colorful content may scroll under controls.

### Color management
- Apply color profiles to images; sRGB is accurate on most displays.
- Use wide color (Display P3) where it helps (photos, video, data, status indicators): Display P3 profile at 16 bits per channel, export PNG. Need a wide-color display to design P3.
- P3 usually fine on sRGB, but similar P3 colors may be hard to tell apart and P3 gradients may clip on sRGB; provide per-color-space image/color variants via the asset catalog if needed.

### Platform considerations
- iOS, iPadOS: background colors come in system and grouped sets, each with primary/secondary/tertiary. Use grouped set (`systemGroupedBackground`, `secondarySystemGroupedBackground`, `tertiarySystemGroupedBackground`) for grouped table views; otherwise system set (`systemBackground`, `secondarySystemBackground`, `tertiarySystemBackground`). Primary = overall view; secondary = grouping within it; tertiary = grouping within secondary. Foreground colors table: platforms/ios.md.
- macOS: dynamic system color table and accent color rules: platforms/macos.md.
- tvOS, visionOS, watchOS: out of scope.

## Typography ([HIG](https://developer.apple.com/design/human-interface-guidelines/typography))
- Numeric tables (default/min sizes, Dynamic Type, text styles, tracking): platforms/ios.md, platforms/ipados.md, platforms/macos.md.

### Ensuring legibility
- Follow recommended default and minimum text sizes per platform, for custom and system fonts (iOS/iPadOS 17 pt default, 11 pt min; macOS 13 pt default, 10 pt min).
- Thin custom font: go larger than recommended sizes.
- Test legibility in different contexts (e.g. game text on every platform); if hard to read: larger size, more contrast (text or background colors), or legibility-optimized typefaces like system fonts. Text over busy scenes: give it a visible background (e.g. shaded lozenge).
- Avoid light weights: prefer Regular, Medium, Semibold, Bold; avoid Ultralight, Thin, Light (hard to see, esp. small).

### Conveying hierarchy
- Adjust weight, size, color to emphasize; keep relative hierarchy and visual distinction when text size changes.
- Minimize number of typefaces; too many obscure hierarchy, hurt readability, feel inconsistent.
- Prioritize important content on text-size change: not every word should grow (e.g. tab titles needn't grow with tabbed window content; game dialog over transient hit-damage values).

### Using system fonts
- Two families: San Francisco (SF Pro, SF Compact, SF Arabic, SF Armenian, SF Georgian, SF Hebrew, SF Mono; rounded variants of Pro/Compact/Arabic/Armenian/Georgian/Hebrew for soft UI or alternative voice) and New York (NY, serif).
- System fonts are variable fonts with dynamic optical sizes (Text/Display merged continuously); discrete optical sizes only needed for design tools lacking variable-font support.
- Weights Ultralight to Black; SF also has widths incl. Condensed and Expanded. SF Symbols use equivalent weights for precise matching with adjacent text.
- Prefer SF Symbols to convey concepts or objects, esp. within text.
- Text styles = combination of weight, point size, leading per text size; form hierarchy; scale proportionately with system text size and Larger Text accessibility.
- Prefer built-in text styles with system fonts: ensures Dynamic Type and larger accessibility sizes where available.
- Modify text styles via symbolic traits when needed: bold trait adds hierarchy level; adjust leading: loose leading for wide columns or long passages, tight leading for height-constrained areas (e.g. list row). Never use tight leading for 3+ lines.
- Use `Font.Design` constants (default for system font, serif for New York); never embed system fonts in the app.
- Mockups: system font adjusts tracking per point size at runtime; mimic with tracking tables, no need to pick discrete optical sizes.

### Using custom fonts
- Custom fonts must be legible at various distances/conditions; follow minimum sizes per style and weight.
- Must implement the accessibility behavior system fonts get free: Dynamic Type (where available), Bold Text. Unity games: Apple's Unity plug-ins, or other way to adjust text size.

### Supporting Dynamic Type
- Dynamic Type (iOS, iPadOS) = systemwide text size setting. Size tables: platforms/ios.md.
- Layout must adapt to all font sizes; verify text and glyphs legible at all. Test with Larger Accessibility Text Sizes on (Settings > Accessibility > Display & Text Size > Larger Text).
- Scale meaningful interface icons with font size; SF Symbols scale automatically.
- Minimize truncation as size grows: aim to show as much useful text at largest accessibility size as at largest standard size. Never truncate in scrollable regions unless people can open a view for the rest. Labels: allow as many lines as needed (`numberOfLines`).
- Adjust layout at large sizes: inline items (glyphs, timestamps) and container boundaries crowd text, so stack with text above secondary items; reduce columns of multicolumn text (`isAccessibilityCategory`).
- Keep information hierarchy consistent at any size (primary elements stay toward top).

### Platform considerations
- iOS, iPadOS: SF Pro is system font; NY also available.
- macOS: SF Pro is system font; NY available for Mac Catalyst apps. macOS has no Dynamic Type. Use dynamic system font variants to match standard controls: see platforms/macos.md.
- tvOS, visionOS, watchOS: out of scope.

## Dark Mode ([HIG](https://developer.apple.com/design/human-interface-guidelines/dark-mode))
- Systemwide dark palette; people expect all apps to respect it. System may also raise perceptual contrast.

### Best practices
- Never offer an app-specific appearance setting (extra work, looks broken).
- Must look good in light and dark; Auto setting can switch while app runs.
- Test legibility in both modes, incl. Increase Contrast and Reduce Transparency (separately and together); dark text on dark background can get less legible.
- Dark-only appearance only in rare cases (e.g. immersive media viewing where UI should recede).

### Dark Mode colors
- Palette: dimmer backgrounds, brighter foregrounds; not strict inversions.
- Use adaptive semantic colors (`labelColor`, `controlColor` macOS; `separator` iOS/iPadOS). Custom color: Color Set in asset catalog with bright and dim variants. Never hard-code or use non-adaptive colors.
- Contrast ratio never below 4.5:1; custom foreground/background aim for 7:1, esp. small text.
- Soften white backgrounds in content images (slightly darken) so they don't glow.

### Icons and images
- Use SF Symbols (auto-adapt) with dynamic colors or vibrancy.
- Design separate light/dark interface icons if needed (e.g. subtle outline on full-moon icon on light; border on dark droplet icon on dark).
- Full-color images/icons must look good in both: reuse one asset if it works, else adjust or make separate assets; combine via asset catalog into one named image.

### Text
- Use system label colors (primary through quaternary) for labels.
- Use system views for text fields/text views (auto vibrancy handling); don't draw text yourself when a system view works.

### Platform considerations
- iOS, iPadOS: two background sets, base (dimmer, recedes) and elevated (brighter, advances) to show depth when dark interfaces layer (popover, modal sheet, multitasking apps, multiple windows). Prefer system background colors; custom backgrounds break these distinctions.
- macOS: graphite accent color makes window backgrounds pick up desktop picture color (desktop tinting). Add some transparency to custom component backgrounds so they pick up window color; only for components with a visible background or bezel and only in a neutral (non-colored) state; never when state uses color (color would fluctuate).
- Other platforms: out of scope.

## Icons ([HIG](https://developer.apple.com/design/human-interface-guidelines/icons))
- Interface icon (glyph) = streamlined shapes, touches of color, one straightforward idea; unlike app icons. Design your own or use SF Symbols; both use black + clear, system tints the black areas.
- Recognizable, highly simplified design; familiar visual metaphors directly tied to the action or content.
- Consistent across all app icons (custom + system mixed): same size, level of detail, stroke weight, perspective; adjust dimensions of lighter-weight icons for equal visual weight.
- Match icon weight to adjacent text weight unless emphasizing one.
- Add padding for optical alignment on asymmetric custom icons (e.g. download icon sits too low if geometrically centered); bake the padding into the asset, then geometrically center the asset. Adjustments are tiny but matter.
- Selected-state variant only if necessary: not needed in standard toolbars, tab bars, buttons (system updates selected state).
- Inclusive images: gender-neutral human figures; avoid images hard to recognize across cultures/languages.
- Text in icon only when essential; localize individual characters; for suggested text passages use an abstract representation with a flipped right-to-left version.
- Custom icons: vector (PDF, SVG) auto-scales, no high-res versions needed; PNG doesn't scale, supply multiple versions. Alternative: custom SF Symbol with a scale matching adjacent text emphasis.
- Provide alternative text (accessibility description) for custom icons for VoiceOver.
- Never replicate Apple hardware (designs date quickly); if needed use only Apple Design Resources images or Apple-product SF Symbols.

### Standard icons (SF Symbols for common actions)
| Group | Action: symbol |
|---|---|
| Editing | Cut: `scissors`; Copy: `document.on.document`; Paste: `document.on.clipboard`; Done/Save: `checkmark`; Cancel/Close: `xmark`; Delete: `trash`; Undo: `arrow.uturn.backward`; Redo: `arrow.uturn.forward`; Compose: `square.and.pencil`; Duplicate: `plus.square.on.square`; Rename: `pencil`; Move to/Folder: `folder`; Attach: `paperclip`; Add: `plus`; More: `ellipsis` |
| Selection | Select: `checkmark.circle`; Deselect/Close: `xmark`; Delete: `trash` |
| Text formatting | Superscript: `textformat.superscript`; Subscript: `textformat.subscript`; Bold: `bold`; Italic: `italic`; Underline: `underline`; Align Left: `text.alignleft`; Center: `text.aligncenter`; Justified: `text.justify`; Align Right: `text.alignright` |
| Search | Search: `magnifyingglass`; Find (also Find and Replace, Find Next/Previous, Use Selection for Find): `text.page.badge.magnifyingglass`; Filter: `line.3.horizontal.decrease` |
| Sharing | Share (also Export): `square.and.arrow.up`; Print: `printer` |
| Users | Account (also User, Profile): `person.crop.circle` |
| Ratings | Dislike: `hand.thumbsdown`; Like: `hand.thumbsup` |
| Layer ordering | Bring to Front: `square.3.layers.3d.top.filled`; Send to Back: `square.3.layers.3d.bottom.filled`; Bring Forward: `square.2.layers.3d.top.filled`; Send Backward: `square.2.layers.3d.bottom.filled` |
| Other | Alarm: `alarm`; Archive: `archivebox`; Calendar: `calendar` |

### Platform considerations
- iOS, iPadOS: none additional. macOS document icons: platforms/macos.md. Other platforms: out of scope.

## Images ([HIG](https://developer.apple.com/design/human-interface-guidelines/images))
- Scale factors per platform: platforms/ios.md, platforms/ipados.md, platforms/macos.md.

### Resolution
- Point = abstract unit; maps to variable pixels on 2D displays. Scale factor: @1x = 1 px per pt, @2x = 2:1, @3x = 3:1.
- Provide high-resolution assets for all bitmaps, for every supported device. Name by suffix "@1x", "@2x", "@3x" in the asset catalog.
- Design at lowest resolution and scale up. Vector shapes: place control points at whole values so they align to the raster grid at 1x and stay aligned at 2x, 3x.

### Formats
| Image type | Format |
|---|---|
| Bitmap/raster | De-interlaced PNG |
| PNG not needing full 24-bit color | 8-bit color palette |
| Photos | JPEG (optimized as needed) or HEIC |
| Flat icons, interface icons, flat artwork needing high-res scaling | PDF or SVG |

### Best practices
- Include a color profile with each image (see Color management).
- Always test images on a range of actual devices (pixelation, stretching, compression).

### Platform considerations
- iOS, iPadOS, macOS: none additional. tvOS, visionOS, watchOS: out of scope.

## Inclusion ([HIG](https://developer.apple.com/design/human-interface-guidelines/inclusion))
- Inclusive design is iterative; examine your assumptions; stay open to evolving understanding.

### Inclusive by design
- Investigate goals and perspectives; use empathy: words/images may be incomprehensible or mean something unintended.
- Perspectives span: age, gender identity, race/ethnicity, sexuality, physical and cognitive attributes, permanent/temporary/situational disabilities, language, culture, religion, education, political/philosophical opinions, social/economic context.
- Don't frame as hunting offensive content only; inoffensive is not inclusive. Aim for welcoming experience.

### Welcoming language
- Plain, inclusive, direct language; review copy for exclusion.
- Check tone from different perspectives (academic tone implies high education required); be clear, direct, respectful.
- Address people as you/your; avoid "the user"/"the player". Reserve we/our for software or company (else may read as condescending).
- Define specialized/technical terms before use, make definitions easy to find; prefer plain language (easier to read and translate).
- Replace colloquial expressions with plain language (culture-specific, hard to translate, may carry exclusionary history, e.g. "peanut gallery", "grandfathered in").
- Consider carefully before including humor (subjective, hard to translate, may confuse, irritate, insult).

### Being approachable
- Require no prior skills or knowledge; give a clear path to deeper understanding.
- Clear, straightforward interface consistent with each platform.
- Build in learning: onboarding, step by step, skippable.

### Gender identity
- Avoid unnecessary gender references (e.g. "Subscribers can post recipes" not "his or her recipes"); helps localization for gendered-pronoun languages.
- Avoid gendered avatars, emoji, glyphs, game characters; let people customize.
- Generic person: nongendered human image (SF Symbols has figure and person symbols).
- Ask gender only when required (health, legal); offer inclusive options (nonbinary, self-identify, decline to state); optionally let people specify pronouns.

### People and settings
- Portray range of human characteristics and activities (race, body type, age, physical capability); avoid stereotypical occupations or behaviors (male doctors only, female nurses, heroes/villains along racial/gender lines).
- Review settings and objects: avoid unnecessary affluence; prefer familiar, relatable places, homes, activities, items.

### Avoiding stereotypes
- Become aware of own biases; don't base design on assumptions (e.g. nuclear-family definition).
- Avoid context-specific experiences for security questions (college subject, first car make); use universal ones (favorite activity, first friend's name, quality describing you best).

### Accessibility
- Support VoiceOver, Display Accommodations, closed captioning, Switch Control, Speak Screen.
- Never assume a disability prevents someone from wanting the experience.
- Each disability is a spectrum; everyone experiences disability (age, temporary, situational).
- Avoid images/language excluding people with disabilities: include them in diverse depictions; never use disability to express a negative quality.
- People-first writing: accomplishments/goals before disability; for a specific person/community, find how they self-identify.
- Prioritize simplicity and perceivability (sight, hearing, touch).

### Languages
- People choose language for text and region for dates, times, money. Internationalize first, then provide translated text and resources per locale.
- Inclusive practices (plain language, no gender references, diverse people, no stereotypes/culture-specific content) ease localization. SF Symbols help: language-specific glyphs and glyphs usable in LTR and RTL.
- Colors carry culture-specific meaning (white = death/grief vs purity/peace); verify color messaging per locale.

### Platform considerations
- None additional.

## Layout ([HIG](https://developer.apple.com/design/human-interface-guidelines/layout))
- Note: crawled page has no per-device screen/safe-area size tables; use Apple Design Resources templates for those.

### Visual hierarchy
- Order content by importance: top and leading side first (reading order). For RTL, prefer standard system components that adapt automatically.
- Align elements to ease scanning; aligned items read as related, indented items as subordinate.
- Group related items with negative space, container shapes, or separator lines.
- Progressive disclosure: disclosure triangles, menus, nested views, scrollable sections (esp. media apps) to cut initial content and choices.
- Differentiate controls from content with Liquid Glass; use a scroll edge effect to elevate controls instead of solid/semi-opaque background beneath them. Extend full-screen background content beneath sidebars, toolbars, tab bars.
- If sidebars/inspectors cover important parts of a full-bleed background image, use a background extension effect (flips and blurs image beneath adjacent components): `backgroundExtensionEffect()`, `UIBackgroundExtensionView`.

### Adaptability
- Adapt to display sizes, orientation, window sizes, multitasking states; use SwiftUI or Auto Layout.
- Handle: size classes (compact/regular, both axes); screen sizes; orientations and aspect ratios; Dynamic Island; external display, Display Zoom, resizable windows on iPad and Mac; text-size changes; locale features (LTR/RTL, date/time/number formats, font variation, text length).
- Layout must stay familiar on rotate, window resize, added display, device switch: respect safe areas, margins, guides; use layout modifiers to fine-tune.
- Orientation-locked apps (e.g. landscape-only game) must still resize well across devices and window sizes.
- Prepare for text-size changes: stack horizontally adjacent views vertically; grow table rows/containers so text isn't cropped or overlapping; single-line rows may need to grow to multiple lines. Unity: Apple's accessibility plug-in.
- Preview on multiple devices, size classes, localizations, text sizes; test largest and smallest layouts first; use Device Hub simulation (e.g. iPad resize, iPhone Mirroring on Mac).
- Scale background artwork on display change (cropped, letterboxed, pillarboxed): never change aspect ratio, scale to fill the screen; windows can be very wide/short or tall/narrow, so art may need to extend beyond standard aspect.

### Size classes
- iOS, iPadOS: two classes per axis (compact/regular); horizontal = narrow/wide, vertical = short/tall. Set by device type, window config, multitasking state (full screen, Slide Over, iPhone Mirroring on Mac); every combination possible.
- Decide layout from size classes, never device type (idiom) or orientation.
- Consider all size class combinations (landscape-only compact-height iPhone layout may waste vertical space on iPad; compact-portrait-only leaves extra space at regular width on iPad).
- Keep functionality the same as size classes change; only the amount visible may change (e.g. switch tab bar to sidebar, expose overflow-menu items in larger spaces). Layout stays recognizable and familiar to the platform (idiom unchanged on resize).

### Guides and safe areas
- Layout guides: rectangular regions for positioning, aligning, spacing; system guides give standard margins and restrict text width for readability; custom guides possible (`UILayoutGuide`, `NSLayoutGuide`).
- Must respect safe area (not covered by hardware features or toolbar, tab bar, status bar) so Dynamic Island etc. never obstruct content/controls.

### Platform considerations
- iOS, iPadOS: none additional.
- macOS: avoid controls or critical info at the bottom of a window (windows often moved partly below screen). Avoid displaying content behind the camera housing at the top edge of the window (`NSPrefersDisplaySafeAreaCompatibilityMode`).
- tvOS, visionOS, watchOS: out of scope.

## Materials ([HIG](https://developer.apple.com/design/human-interface-guidelines/materials))
- Two material types: Liquid Glass (controls and navigation, floats above content) and standard materials (differentiation within content layer). Materials let color pass through background to foreground to build hierarchy.

### Liquid Glass
- Forms a functional layer for controls/navigation (tab bars, sidebars) above content; content scrolls and peeks through.
- Never use Liquid Glass in the content layer; use standard materials there (e.g. app backgrounds). Exception: transient interactive controls like Sliders and Toggles take Liquid Glass appearance while activated.
- Use Liquid Glass effects sparingly: system components adopt it automatically; on custom controls limit to most important functional elements (overuse distracts from content). `Applying Liquid Glass to custom views`.
- Two variants, regular and clear (look can change with system settings: preferred Liquid Glass look, Reduce Transparency, Increase Contrast). Use clear only for components over visually rich backgrounds.
- Regular: blurs and adjusts luminosity of background to keep legibility; scroll edge effects add blur and reduce opacity of background content. Most system components use it. Use when background may hurt legibility or component has lots of text (alerts, sidebars, popovers).
- Clear: highly translucent; for components floating above media (photos, video) for immersion.
- Dimming layer for clear glass: bright underlying content, consider dark dimming layer at 35% opacity (`clear`); sufficiently dark content, or standard AVKit playback controls (own dimming), need none.
- See Color section: Liquid Glass color.

### Standard materials
- Use `UIBlurEffect`, `UIVibrancyEffect`, `NSVisualEffectView.BlendingMode` to structure content beneath Liquid Glass.
- Choose material/effect by semantic meaning and recommended use, never by apparent color (system settings change appearance).
- Use system vibrant colors on top of any material (e.g. not `systemGray3` for a symbol on a material).
- Thicker (more opaque) = better contrast for text and fine features; thinner (more translucent) = keeps background context visible. See `Material`.

### Platform considerations
- iOS, iPadOS: four standard materials for content layer: ultra-thin, thin, regular (default), thick. Vibrancy levels: platforms/ios.md.
- macOS: standard materials with designated purposes plus vibrant versions; choose when to allow vibrancy in custom views/controls (test varied contexts); choose a blending mode: behind window or within window. Details: platforms/macos.md.
- tvOS, visionOS, watchOS: out of scope.

## Motion ([HIG](https://developer.apple.com/design/human-interface-guidelines/motion))
- System components include motion and adapt to accessibility settings and input method (e.g. Liquid Glass motion stronger for touch, more subdued for trackpad). Rules below apply to custom motion.

### Best practices
- Add motion purposefully; support the experience without overshadowing it; no gratuitous or excessive animation (distraction, disconnection, discomfort).
- Make motion optional: never the only way to communicate important info; supplement with haptics and audio.

### Providing feedback
- Realistic feedback motion following gestures and expectations (view revealed by sliding down must not dismiss by sliding sideways).
- Brief, precise feedback animations feel lightweight and convey info better than prominent ones.
- Generally avoid adding motion to frequent UI interactions; custom elements shouldn't make people attend to unnecessary motion each time.
- Let people cancel motion; don't force waiting for animation completion, esp. when repeated.
- Consider animated symbols (SF Symbols 5 or later, also custom symbols).

### Leveraging platform capabilities
- Games: default settings look great per platform; consistent 30 to 60 fps typically smooth; let people customize visuals for performance or battery (e.g. power modes when external power detected).

### Platform considerations
- iOS, iPadOS, macOS: none additional. visionOS, tvOS, watchOS: out of scope.

## Privacy ([HIG](https://developer.apple.com/design/human-interface-guidelines/privacy))
- Must provide privacy practices details (data collected) on submit/update for App Store product page (manage in App Store Connect).

### Best practices
- Request only data actually needed; no requests before the person shows interest in the feature; make permission requests as specific as possible.
- Be transparent on how data is collected/used. Always respect Hide My Email and Mail Privacy Protection; know app-tracking obligations.
- Process data on device where possible (Apple Neural Engine, custom CreateML models) to avoid server round trips.
- Adopt system-defined privacy protections and security best practices (e.g. CloudKit encryption and key management, iOS 15+).

### Requesting permission
- Must request permission for: personal data (location, health, financial, contact, other PII); user-generated content (emails, messages, calendar, contacts, gameplay info, Apple Music activity, HomeKit, audio/video/photo); protected resources (Bluetooth peripherals, home automation, Wi-Fi, local networks); device capabilities (camera, microphone); advertising identifier (tracking). (visionOS ARKit data: out of scope.)
- System alert shows your copy; people can review/change in Settings > Privacy.
- Request only when app clearly needs access; ideally when the person uses the feature needing it (e.g. Location button after interest in a location feature).
- Avoid permission requests at launch unless data/resource is required for app to function (e.g. navigation app location).
- Purpose string (usage description): brief, complete sentence, straightforward, specific, easy to understand; sentence case, active voice, ends with period. Good: "The app records during the night to detect snoring sounds." Bad: "Microphone access is needed for a better experience." (passive, vague); "Turn on microphone access." (imperative, no justification).

### Pre-alert screens
- Prefer context that explains the request. Custom screen before system alert (camera, microphone, location, contact, calendar, tracking) only if essential:
  - Include only one button, clearly leading to the system alert. Title it "Continue" or "Next", never "Allow" (looks like alert's allow button, causes accidental allow).
  - No additional actions (no Close/Cancel/leave-without-alert) unless needed for legal consent.

### Tracking requests
- Tracking is sensitive; a custom screen describing benefits is OK. To track at launch, must show the system alert before collecting any tracking data.
- Never precede the system alert with a screen that could confuse or mislead (exploits quick dismissal; leads to App Store rejection).
- Prohibited: offering incentives, a screen that looks like a request, an image of the alert, annotating the screen behind the alert. A consent screen before/after the ATT alert to comply with local privacy law is allowed (App Review Guidelines 5.1.1 (iv)).

### Location button
- iOS, iPadOS (Core Location): button grants temporary one-time authorization at the moment a task needs it; instantly recognizable. First tap shows a standard alert (explains limits, location indicator); afterwards tap = one-time permission without reconfirming; expires when app use stops.
- No authorization status: tap = Allow Once. Previously While Using the App: tap changes nothing. (`LocationButton`, `CLLocationButton`.)
- Use for lightweight sharing tied to features (attach location to message/post, find store, identify building/plant/animal); especially if people often choose Allow Once.
- Customizable: system title ("Current Location", "Share My Current Location"), filled or outlined glyph, background color, title/glyph color, corner radius. Nothing else.
- System warns on low contrast or too much translucency; fix them. Text must fit without truncation at all accessibility text sizes and in translations.
- If problems persist, system withholds location access on tap; avoid.

### Protecting data
- Use system security technologies for local storage, authorization, network transport.
- Avoid relying solely on passwords: prefer passkeys; if passwords stay, require two-factor authentication; use biometrics (Face ID, Touch ID) to protect logged-in apps (`Local Authentication`).
- Store sensitive info in a keychain.
- Never store passwords or secure content in plain-text files, even with file permissions.
- Avoid custom authentication schemes; prefer passkeys, Sign in with Apple, Password AutoFill.

### Platform considerations
- iOS, iPadOS: none additional.
- macOS: sign with valid Developer ID if distributing outside the store; use app sandboxing (required for Mac App Store); never assume who is signed in (fast user switching, multiple active people).
- tvOS, visionOS, watchOS: out of scope.

## Right to left ([HIG](https://developer.apple.com/design/human-interface-guidelines/right-to-left))
- System UI frameworks support RTL by default (components flip automatically); standard elements and layouts may need no changes. Rules below for fine-tuning.

### Text alignment
- Match text alignment to interface direction if system doesn't (left-aligned in LTR becomes right-aligned in RTL). Images placeholder content isn't flipped.
- Align a paragraph (3+ lines) by its language, not current context; keep 1-2 line blocks aligned to context reading direction.
- Consistent alignment for all items in a list: reverse all, including items in a different script.

### Numbers and characters
- RTL languages use different number systems: Hebrew uses Western Arabic numerals; Arabic may use Western or Eastern Arabic numerals (varies by country, region, even area).
- Number-centric apps: determine proper display per supported locale; others rely on system number representations.
- Never reverse digit order within a specific number (541, phone, credit card).
- Reverse order of numerals showing progress or counting direction (progress bars, sliders, rating controls; any ordered sequence); never flip the numerals themselves.

### Controls
- Flip controls showing progress from one value to another (sliders, progress indicators); also reverse positions of glyphs/images depicting start and end values (e.g. volume speaker glyphs).
- Flip controls navigating or accessing items in fixed order: back button points right in RTL; next/previous flip to match reading order.
- Never flip a control referring to an actual direction or onscreen area ("to the right" always points right).
- Balance adjacent Latin and RTL scripts: Arabic/Hebrew look small next to all-caps Latin (no uppercase); increase RTL font size by about 2 points.

### Images
- Avoid flipping photos, illustrations, artwork (changes meaning; copyright risk). If content tied to reading direction, create a new version.
- Reverse positions of images when their order is meaningful (chronological, alphabetical, favorites).

### Interface icons
- SF Symbols provides RTL variants and localized symbols (Arabic, Hebrew, others); custom symbols can specify directionality.
- Flip icons representing text or reading direction (left-aligned bars become right-aligned).
- Consider localized versions of icons displaying text/letters (signature, rich text, I-beam pointer in Latin, Hebrew, Arabic). Icons using letters for non-reading concepts: consider a text-free alternative.
- Flip icons showing forward/backward motion (e.g. speaker sound waves emanate from the reading-forward side).
- Never flip logos (confusing, legal risk) or universal signs/marks (checkmark).
- Avoid flipping icons of real-world objects unless used for direction (clock stays same); right-handed tools (pencil) needn't flip.
- Complex custom icons: consider components and visual balance before flipping. Some components keep one design language (e.g. SF Symbols keeps same backslash for negation in LTR and RTL); some must flip (badge depicting actual UI; badge that modifies meaning, e.g. plus on cart moves to top-left if the cart flips, for balance). Components implying handedness (tool): preserve tool orientation, flip the base image if necessary.

### Platform considerations
- None additional.

## SF Symbols ([HIG](https://developer.apple.com/design/human-interface-guidelines/sf-symbols))
- Use symbols wherever interface icons appear (toolbars, tab bars, context menus, inline with text). Availability varies by OS version: new symbols/features unavailable on earlier systems.
- Must follow SF Symbols license: never use symbols (or confusingly similar images) in app icons, logos, or any trademarked use.

### Rendering modes
- Four modes: monochrome (one color, all layers), hierarchical (one color, opacity per layer level), palette (two or more colors, one per layer; two colors for a 3-level symbol means secondary and tertiary share a color), multicolor (intrinsic colors, e.g. `leaf` green, `trash.slash` red; some layers recolorable). Symbols organize paths into primary/secondary/tertiary layers.
- Use system-provided colors so symbols adapt to accessibility accommodations, vibrancy, Dark Mode (`renderingMode(_:)`).
- Verify rendering mode in every context (size, background contrast); automatic = symbol's preferred mode, but still check legibility.

### Gradients
- SF Symbols 7+: gradient rendering from a single source color; works in all rendering modes, system and custom colors, custom symbols; any size, best at larger sizes.

### Variable color
- Represents changing characteristic (capacity, strength) over thresholds between 0 and 100% in any rendering mode; layers receive color as value passes system-defined thresholds (e.g. `speaker.wave.3` waves; none colored at zero).
- Layers can opt out (speaker body doesn't change).
- Use variable color for change only, never depth; use hierarchical mode for depth/hierarchy.

### Weights and scales
- Nine weights (ultralight to black) matching SF font weights for precise text matching.
- Three scales: small, medium (default), large, defined relative to SF cap height. Scale adjusts emphasis vs adjacent text without breaking weight matching. (`imageScale(_:)`, `UIImage.SymbolScale`, `NSImage.SymbolConfiguration`).

### Design variants
- Variants: outline (most common, text-like), fill, slash, enclosed (circle, square, rectangle); slash/enclosed often combine with outline/fill. Slash = unavailable; fill = selection.
- Language/script-specific variants (Latin, Arabic, Hebrew, Hindi, Thai, Chinese, Japanese, Korean, Cyrillic, Devanagari, Indic numerals) adapt automatically to device language.
- Outline for toolbars, lists, beside text; enclosed shapes improve small-size legibility; fill gives emphasis (iOS tab bars, swipe actions, accent-colored selection).
- Often the container picks the variant (iOS tab bar fill, toolbar outline): don't specify unnecessarily.

### Animations
- Work on all symbols, rendering modes, weights, scales, and custom symbols; control playback (once or repeat until condition), speed, reverse-before-repeat. (`SymbolEffect`).
- Appear / Disappear: gradually emerge / recede.
- Bounce: brief elastic scale up or down, returns to initial; plays once by default; signals action occurred or needed.
- Scale: persistent size change until reset; draw attention to selection or give feedback.
- Pulse: varies opacity over time (annotated layers, optionally all); ongoing activity until a condition is met.
- Variable color: incrementally varies layer opacity, cumulative or iterative; progress/ongoing activity (playback, connecting, broadcasting); can autoreverse, hide inactive layers. Open loop (linear layers) vs closed loop (complete shape; seamless playback).
- Replace: swaps symbols; configurations: down-up (state change), up-up (state change with forward progression), off-up (emphasizes next state/action).
- Magic Replace: smart transition between related shapes (slashes draw on/off, badges appear/disappear); default replace; falls back to down-up for unrelated symbols (fallback direction customizable).
- Wiggle: back-and-forth along an axis; highlight overlookable change or call to action; reinforce direction.
- Breathe: smoothly increases/decreases presence (opacity and size); status change or ongoing activity (e.g. recording). Pulse changes opacity only.
- Rotate: indicator or real-world imitation; task in progress; whole or by layer (e.g. desk fan blades).
- Draw On / Draw Off (SF Symbols 7+): draws along guide-point path onscreen/offscreen; all layers, staggered, or one at a time; progress (download) or reinforce meaning.
- Apply animations judiciously (too many overwhelm/distract); each must serve a clear purpose and not confuse in combination; use to convey info efficiently as feedback; match app tone and brand.

### Custom symbols
- Export template of a similar symbol, edit in a vector tool.
- Never customize symbols depicting Apple products/features (copyrighted; Info badge in SF Symbols app, inspector shows restrictions); display only.
- Annotate layers with a color or hierarchy level (primary/secondary/tertiary); supports rendering modes you choose.
- Match system symbols in level of detail, optical weight, alignment, position, perspective; be simple, recognizable, inclusive, directly related to action/content (see Icons).
- Negative side margins for optical horizontal alignment with badges/wide elements; name pattern like "left-margin-Regular-M".
- For layer animation, annotate layers in SF Symbols app; Z-order sets color order for variable color (front-to-back or back-to-front); animate by layer groups.
- Test custom symbols with all animation presets; draw whole shapes (e.g. full person shape plus offset path annotated as erase layer, no manual cutout) to preserve layer information.
- Avoid building common variants (enclosures, badges) yourself; use the component library.
- Provide alternative text (accessibility descriptions) for VoiceOver.
- Never design replicas of Apple products.

### Platform considerations
- None additional.

## Writing ([HIG](https://developer.apple.com/design/human-interface-guidelines/writing))
### Getting started
- Determine app voice: who you address, familiar vocabulary, intended feeling (banking: trust; game: fun). Keep a list of common terms for consistency.
- Match tone to context (physical and in-app situation): serious/direct for errors or alerts, light for congratulations.
- Be clear: easily understood words, drop unneeded words, read aloud when in doubt.
- Write for everyone: simple, plain language; accessibility and localization in mind; no jargon or gendered terms.

### Best practices
- Consider each screen's purpose: most important info first; format for readability; split multiple ideas across screens and consider flow.
- Action oriented: active voice, clear labels; button and link labels almost always start with a verb; no cute/clever labels ("Send" over "Let's do it!"); never "Click here", use descriptive link text (matters for screen readers).
- Build consistent language patterns.
- Capitalization: choose a style per UI element type and apply consistently (title case formal, sentence case casual; e.g. title case for all alerts).
- Multistep flows: consistent action labels; begin with "Get Started"; step labels like "Continue" or "Next" (pick one); end with "Done".
- Use possessive pronouns (my, your) sparingly ("Favorites" over "Your Favorites"); be consistent, don't switch perspective. Never use "we" (unclear referent, esp. errors: "Unable to load content" over "We're having trouble loading this content").
- Write for each device: consistent language, adjusted per device; describe gestures correctly (tap on touch devices, not click). Small screens need brevity; big screens need large text hence brevity too; consider shared-viewing contexts.
- Empty states: give clear next steps with a button or link; useful, in-context content; showcase voice; never show crucial info that disappears.
- Error messages: help avoid errors first; show as close to the problem as possible; no blame; say how to fix ("Choose a password with at least 8 characters" over "That password is too short"); skip "oops!"/"uh-oh"; if language can't fix a widespread error, rethink the interaction.
- Choose delivery method by urgency, importance, context, need for immediate action, supporting info (see Notifications, Alerts, Action sheets); match tone.
- Settings labels: clear, practical; add explanation when needed describing what happens when on (opposite inferred); link/button directly to a setting instead of describing its location.
- Text fields: label all fields; hint/placeholder text showing format ("name@example.com", "Your name"); errors right next to field with how to enter correctly ("Use only letters for your name" over "Don't use numbers or symbols"); no robotic "Invalid name".

### Platform considerations
- None additional.
