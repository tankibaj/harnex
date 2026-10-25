# macOS

last-checked: 2026-10-25
scope: macOS rules and hard numbers (incl. Mac Catalyst where noted).

## Designing for macOS ([HIG](https://developer.apple.com/design/human-interface-guidelines/designing-for-macos))
- Device traits: large high-res display, extendable with more displays (incl. iPad); stationary use, viewing distance about 1 to 3 feet; any combination of keyboard, pointing device, game controls, Siri; sessions of minutes to hours; many apps open, expect smooth active/inactive transitions.
- System features to integrate: menu bar, file management, full screen, Dock menus.
- Use large displays for more content in fewer nested levels and less modality, at comfortable information density.
- Let people resize, hide, show, move windows; support full-screen mode.
- Use the menu bar to expose all commands.
- Support high-precision input for pixel-perfect selection and edits.
- Handle keyboard shortcuts; support keyboard-only work styles.
- Support personalization: customizable toolbars, window configuration, colors and fonts.

## Hard numbers
| Item | Default | Minimum |
|---|---|---|
| Text size | 13 pt | 10 pt |
| Control size | 28x28 pt | 20x20 pt |
- Padding between controls: about 12 pt around elements with a bezel; about 24 pt around elements without a bezel.
- Contrast minimums (WCAG AA): up to 17 pt 4.5:1; 18 pt 3:1; bold 3:1. Dark Mode custom colors never below 4.5:1, aim 7:1.
- Images: scale factors @1x and @2x.
- App icon: 1024x1024 px square, layered (system masks to rounded rectangle); appearances default, dark, clear light, clear dark, tinted light, tinted dark; color spaces sRGB, Gray Gamma 2.2, Display P3.
- Document icon sizes: see Document icons below.
- Standard materials and vibrancy: see Materials below.

### Typography
- System font SF Pro; New York available for Mac Catalyst apps. macOS does not support Dynamic Type. Avoid Ultralight, Thin, Light weights.
- Emphasized variants via symbolic traits (`bold()` SwiftUI; `traitBold` in `UIFontDescriptor`); emphasized weights are medium, semibold, bold, or heavy.

#### macOS built-in text styles
Size and line height in points; point size based on 144 ppi @2x designs.

| Text style | Weight | Size (pt) | Line height (pt) | Emphasized weight |
|---|---|---|---|---|
| Large Title | Regular | 26 | 32 | Bold |
| Title 1 | Regular | 22 | 26 | Bold |
| Title 2 | Regular | 17 | 22 | Bold |
| Title 3 | Regular | 15 | 20 | Semibold |
| Headline | Bold | 13 | 16 | Heavy |
| Body | Regular | 13 | 16 | Semibold |
| Callout | Regular | 12 | 15 | Semibold |
| Subheadline | Regular | 11 | 14 | Semibold |
| Footnote | Regular | 10 | 13 | Semibold |
| Caption 1 | Regular | 10 | 13 | Medium |
| Caption 2 | Medium | 10 | 13 | Semibold |

#### Dynamic system font variants (match standard controls)
| Variant | API |
|---|---|
| Control content | `controlContentFont(ofSize:)` |
| Label | `labelFont(ofSize:)` |
| Menu | `menuFont(ofSize:)` |
| Menu bar | `menuBarFont(ofSize:)` |
| Message | `messageFont(ofSize:)` |
| Palette | `paletteFont(ofSize:)` |
| Title | `titleBarFont(ofSize:)` |
| Tool tips | `toolTipsFont(ofSize:)` |
| Document text (user) | `userFont(ofSize:)` |
| Monospaced document text (user fixed pitch) | `userFixedPitchFont(ofSize:)` |
| Bold system font | `boldSystemFont(ofSize:)` |
| System font | `systemFont(ofSize:)` |

#### macOS tracking values (SF Pro)
Format: tracking in 1/1000 em / tracking in pt. Runtime system font adjusts tracking automatically; for mockups. Based on 144 ppi @2x. Not all apps express tracking as 1/1000 em.

| Size pt | SF Pro |
|---|---|
| 6 | +41 / +0.24 |
| 7 | +34 / +0.23 |
| 8 | +26 / +0.21 |
| 9 | +19 / +0.17 |
| 10 | +12 / +0.12 |
| 11 | +6 / +0.06 |
| 12 | 0 / 0.0 |
| 13 | -6 / -0.08 |
| 14 | -11 / -0.15 |
| 15 | -16 / -0.23 |
| 16 | -20 / -0.31 |
| 17 | -26 / -0.43 |
| 18 | -25 / -0.44 |
| 19 | -24 / -0.45 |
| 20 | -23 / -0.45 |
| 21 | -18 / -0.36 |
| 22 | -12 / -0.26 |
| 23 | -4 / -0.10 |
| 24 | +3 / +0.07 |
| 25 | +6 / +0.15 |
| 26 | +8 / +0.22 |
| 27 | +11 / +0.29 |
| 28 | +14 / +0.38 |
| 29 | +14 / +0.40 |
| 30 | +14 / +0.40 |
| 31 | +13 / +0.39 |
| 32 | +13 / +0.41 |
| 33 | +12 / +0.40 |
| 34 | +12 / +0.40 |
| 35 | +11 / +0.38 |
| 36 | +10 / +0.37 |
| 37 | +10 / +0.36 |
| 38 | +10 / +0.37 |
| 39 | +10 / +0.38 |
| 40 | +10 / +0.37 |
| 41 | +9 / +0.36 |
| 42 | +9 / +0.37 |
| 43 | +9 / +0.38 |
| 44 | +8 / +0.37 |
| 45 | +8 / +0.35 |
| 46 | +8 / +0.36 |
| 47 | +8 / +0.37 |
| 48 | +8 / +0.35 |
| 49 | +7 / +0.33 |
| 50 | +7 / +0.34 |
| 51 | +7 / +0.35 |
| 52 | +6 / +0.31 |
| 53 | +6 / +0.33 |
| 54 | +6 / +0.32 |
| 56 | +6 / +0.30 |
| 58 | +5 / +0.28 |
| 60 | +4 / +0.26 |
| 62 | +4 / +0.24 |
| 64 | +4 / +0.22 |
| 66 | +3 / +0.19 |
| 68 | +2 / +0.17 |
| 70 | +2 / +0.14 |
| 72 | +2 / +0.14 |
| 76 | +1 / +0.07 |
| 80 | 0 / 0 |
| 84 | 0 / 0 |
| 88 | 0 / 0 |
| 92 | 0 / 0 |
| 96 | 0 / 0 |

### Color
- System colors (SwiftUI API), RGB, for design reference only; never hard-code. visionOS excluded. The systemwide list is shared with iOS; values:

| Color (SwiftUI) | Light | Dark | Increased contrast light | Increased contrast dark |
|---|---|---|---|---|
| Red (`red`) | 255,56,60 | 255,66,69 | 233,21,45 | 255,97,101 |
| Orange (`orange`) | 255,141,40 | 255,146,48 | 197,83,0 | 255,160,86 |
| Yellow (`yellow`) | 255,204,0 | 255,214,0 | 161,106,0 | 254,223,67 |
| Green (`green`) | 52,199,89 | 48,209,88 | 0,137,50 | 74,217,104 |
| Mint (`mint`) | 0,200,179 | 0,218,195 | 0,133,117 | 84,223,203 |
| Teal (`teal`) | 0,195,208 | 0,210,224 | 0,129,152 | 59,221,236 |
| Cyan (`cyan`) | 0,192,232 | 60,211,254 | 0,126,174 | 109,217,255 |
| Blue (`blue`) | 0,136,255 | 0,145,255 | 30,110,244 | 92,184,255 |
| Indigo (`indigo`) | 97,85,245 | 109,124,255 | 86,74,222 | 167,170,255 |
| Purple (`purple`) | 203,48,224 | 219,52,242 | 176,47,194 | 234,141,255 |
| Pink (`pink`) | 255,45,85 | 255,55,95 | 231,18,77 | 255,138,196 |
| Brown (`brown`) | 172,127,94 | 183,138,102 | 149,109,81 | 219,166,121 |

#### macOS dynamic system colors (AppKit)
| Color | Use | API |
|---|---|---|
| Alternate selected control text color | The text on a selected surface in a list or table. | `alternateSelectedControlTextColor` |
| Alternating content background colors | The backgrounds of alternating rows or columns in a list, table, or collection view. | `alternatingContentBackgroundColors` |
| Control accent | The accent color people select in System Settings. | `controlAccentColor` |
| Control background color | The background of a large interface element, such as a browser or table. | `controlBackgroundColor` |
| Control color | The surface of a control. | `controlColor` |
| Control text color | The text of a control that is available. | `controlTextColor` |
| Current control tint | The system-defined control tint. | `currentControlTint` |
| Unavailable control text color | The text of a control that’s unavailable. | `disabledControlTextColor` |
| Find highlight color | The color of a find indicator. | `findHighlightColor` |
| Grid color | The gridlines of an interface element, such as a table. | `gridColor` |
| Header text color | The text of a header cell in a table. | `headerTextColor` |
| Highlight color | The virtual light source onscreen. | `highlightColor` |
| Keyboard focus indicator color | The ring that appears around the currently focused control when using the keyboard for interface navigation. | `keyboardFocusIndicatorColor` |
| Label color | The text of a label containing primary content. | `labelColor` |
| Link color | A link to other content. | `linkColor` |
| Placeholder text color | A placeholder string in a control or text view. | `placeholderTextColor` |
| Quaternary label color | The text of a label of lesser importance than a tertiary label, such as watermark text. | `quaternaryLabelColor` |
| Secondary label color | The text of a label of lesser importance than a primary label, such as a label used to represent a subheading or additional information. | `secondaryLabelColor` |
| Selected content background color | The background for selected content in a key window or view. | `selectedContentBackgroundColor` |
| Selected control color | The surface of a selected control. | `selectedControlColor` |
| Selected control text color | The text of a selected control. | `selectedControlTextColor` |
| Selected menu item text color | The text of a selected menu. | `selectedMenuItemTextColor` |
| Selected text background color | The background of selected text. | `selectedTextBackgroundColor` |
| Selected text color | The color for selected text. | `selectedTextColor` |
| Separator color | A separator between different sections of content. | `separatorColor` |
| Shadow color | The virtual shadow cast by a raised object onscreen. | `shadowColor` |
| Tertiary label color | The text of a label of lesser importance than a secondary label. | `tertiaryLabelColor` |
| Text background color | The background color behind text. | `textBackgroundColor` |
| Text color | The text in a document. | `textColor` |
| Under page background color | The background behind a document’s content. | `underPageBackgroundColor` |
| Unemphasized selected content background color | The selected content in a non-key window or view. | `unemphasizedSelectedContentBackgroundColor` |
| Unemphasized selected text background color | A background for selected text in a non-key window or view. | `unemphasizedSelectedTextBackgroundColor` |
| Unemphasized selected text color | Selected text in a non-key window or view. | `unemphasizedSelectedTextColor` |
| Window background color | The background of a window. | `windowBackgroundColor` |
| Window frame text color | The text in the window’s title bar area. | `windowFrameTextColor` |

#### App accent colors
- From macOS 11, specify an accent color to customize buttons, selection highlighting, sidebar icons. Applied when System Settings > General > Accent color is multicolor.
- If person picks a non-multicolor accent, system uses that color across your app, replacing yours. Exception: sidebar icons with a fixed color you specify keep it (fixed color carries meaning). See Sidebars.

### Dark Mode (macOS)
- Graphite accent color makes window backgrounds pick up desktop picture color (desktop tinting).
- Add some transparency to custom component backgrounds so they pick up window color; only for components with a visible background or bezel, only in a neutral (non-colored) state; never when the state uses color (color fluctuates as window moves or desktop changes).

### Materials (macOS)
- Standard materials with designated purposes plus vibrant versions (`NSVisualEffectView.Material`); choose by semantic purpose, not look.
- Choose when custom views/controls allow vibrancy; system views use it per configuration and settings; test varied contexts.
- Blending mode: behind window or within window (`NSVisualEffectView.BlendingMode`); pick one that complements the design.
- Liquid Glass regular vs clear: clear over visually rich media; bright content: 35% dark dimming layer; never Liquid Glass in the content layer (see foundations.md).

### Layout (macOS)
- Never place controls or critical info at the bottom of a window (windows often moved partly below screen).
- Never display content behind the camera housing at the top edge of a window (`NSPrefersDisplaySafeAreaCompatibilityMode`).

### Privacy (macOS)
- Sign with valid Developer ID if distributing outside the store.
- Use app sandboxing (required for Mac App Store).
- Never assume who is signed in (fast user switching).

### Document icons
- Custom document type icon: traditionally paper with top-right corner folded. If you supply none, macOS composites app icon and file extension.
- Supply any combination of background fill, center image, text; system layers, positions, masks them onto the folded-corner shape.
- Simple images, uncomplicated shapes, reduced palette; must read at as small as 16x16 px. Reduce complexity at small sizes (fewer, thicker lines aligned to reduced pixel grid; drop lines entirely at 16x16 px).
- Single expressive background fill can work alone (no center image).
- Never place important content in the top-right corner of the background fill (system draws white folded corner on top).
- Background fill sizes: 512x512 px @1x / 1024x1024 px @2x; 256x256 @1x / 512x512 @2x; 128x128 @1x / 256x256 @2x; 32x32 @1x / 64x64 @2x; 16x16 @1x / 32x32 @2x.
- Center image: half the size of document icon canvas (32x32 px icon uses 16x16 px center canvas). Sizes: 256x256 @1x / 512x512 @2x; 128x128 @1x / 256x256 @2x; 32x32 @1x / 64x64 @2x; 16x16 @1x / 32x32 @2x.
- Center image margin about 10% of canvas; image ideally fills about 80% of canvas (256x256 px canvas: about 205x205 px area); parts may extend into margin for optical alignment.
- Succinct term: system shows file extension at bottom by default; give a short descriptive term if extension is unfamiliar (e.g. "scene" for scn); auto-scaled to fit, so keep short; capitalized by default.

## Platform considerations folded in from foundations
- Accessibility: no additional macOS considerations (control sizes above; Full Keyboard Access must work; never override system shortcuts).
- Icons: document icons above.
- Motion, Images, Branding, Inclusion, RTL, SF Symbols, Writing: none additional.
