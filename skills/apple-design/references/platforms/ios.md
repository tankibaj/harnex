# iOS

last-checked: 2026-10-25
scope: iOS (iPhone, incl. iPhone Duo) rules and hard numbers; tables marked iOS, iPadOS are shared with platforms/ipados.md.

## Designing for iOS ([HIG](https://developer.apple.com/design/human-interface-guidelines/designing-for-ios))
- Device traits: medium-size high-res display; held in one or both hands, portrait/landscape switching, viewing distance no more than a foot or two; Multi-Touch, virtual keyboards, voice, gyroscope/accelerometer, personal data, spatial interactions; sessions from 1-2 minutes to an hour or more; multiple apps open, frequent switching.
- System features to integrate: widgets, Home Screen quick actions, Spotlight, Shortcuts, activity views.
- Limit onscreen controls to focus on primary tasks and content; make secondary details/actions discoverable with minimal interaction.
- Adapt seamlessly to orientation, Dark Mode, Dynamic Type; let people choose configuration.
- Support one-handed reach: controls are easier in middle/bottom of display; support swipe-to-go-back and swipe actions on list rows.
- With permission, use platform data/capabilities instead of asking for typed input (payments, biometric authentication, location).

## Hard numbers
### Text and control size (iOS, iPadOS)
| Item | Default | Minimum |
|---|---|---|
| Text size | 17 pt | 11 pt |
| Control size | 44x44 pt | 28x28 pt |
- Padding between controls: about 12 pt around elements with a bezel; about 24 pt around elements without a bezel (around visible edges).
- Contrast minimums (WCAG AA): up to 17 pt text 4.5:1 (all weights); 18 pt text 3:1 (all weights); bold text 3:1 (any size). Dark Mode custom colors: never below 4.5:1, aim 7:1 for small text.
- Enlarge text at least 200% where possible (Dynamic Type).
- Avoid Ultralight, Thin, Light weights; prefer Regular, Medium, Semibold, Bold. System font: SF Pro (New York also allowed).

### Images (iOS)
| Platform | Scale factors |
|---|---|
| iOS | @2x and @3x |
- Point sizes in the tables below assume 144 ppi for @2x and 216 ppi for @3x designs.

### App icon specifications (iOS, iPadOS, macOS)
| Layout shape | Mask result | Layout size | Style | Appearances |
|---|---|---|---|---|
| Square | Rounded rectangle (system-masked) | 1024x1024 px | Layered | Default, dark, clear light, clear dark, tinted light, tinted dark |
- Color spaces: sRGB (color), Gray Gamma 2.2 (grayscale), Display P3 (wide-gamut color). System auto-scales to smaller sizes (Settings, notifications).
- Provide square, unmasked layers; keep primary content centered; no baked-in highlights, shadows, blurs.

### Dynamic Type sizes (iOS, iPadOS): size pt / leading pt per text style
Columns are Dynamic Type sizes; * = Large (default). Weight and emphasized weight constant across sizes. Point size based on 144 ppi @2x, 216 ppi @3x.

| Style | Weight | Emph. | xSmall | Small | Medium | Large* | xLarge | xxLarge | xxxLarge | AX1 | AX2 | AX3 | AX4 | AX5 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Large Title | Regular | Bold | 31/38 | 32/39 | 33/40 | 34/41 | 36/43 | 38/46 | 40/48 | 44/52 | 48/57 | 52/61 | 56/66 | 60/70 |
| Title 1 | Regular | Bold | 25/31 | 26/32 | 27/33 | 28/34 | 30/37 | 32/39 | 34/41 | 38/46 | 43/51 | 48/57 | 53/62 | 58/68 |
| Title 2 | Regular | Bold | 19/24 | 20/25 | 21/26 | 22/28 | 24/30 | 26/32 | 28/34 | 34/41 | 39/47 | 44/52 | 50/59 | 56/66 |
| Title 3 | Regular | Semibold | 17/22 | 18/23 | 19/24 | 20/25 | 22/28 | 24/30 | 26/32 | 31/38 | 37/44 | 43/51 | 49/58 | 55/65 |
| Headline | Semibold | Semibold | 14/19 | 15/20 | 16/21 | 17/22 | 19/24 | 21/26 | 23/29 | 28/34 | 33/40 | 40/48 | 47/56 | 53/62 |
| Body | Regular | Semibold | 14/19 | 15/20 | 16/21 | 17/22 | 19/24 | 21/26 | 23/29 | 28/34 | 33/40 | 40/48 | 47/56 | 53/62 |
| Callout | Regular | Semibold | 13/18 | 14/19 | 15/20 | 16/21 | 18/23 | 20/25 | 22/28 | 26/32 | 32/39 | 38/46 | 44/52 | 51/60 |
| Subhead | Regular | Semibold | 12/16 | 13/18 | 14/19 | 15/20 | 17/22 | 19/24 | 21/28 | 25/31 | 30/37 | 36/43 | 42/50 | 49/58 |
| Footnote | Regular | Semibold | 12/16 | 12/16 | 12/16 | 13/18 | 15/20 | 17/22 | 19/24 | 23/29 | 27/33 | 33/40 | 38/46 | 44/52 |
| Caption 1 | Regular | Semibold | 11/13 | 11/13 | 11/13 | 12/16 | 14/19 | 16/21 | 18/23 | 22/28 | 26/32 | 32/39 | 37/44 | 43/51 |
| Caption 2 | Regular | Semibold | 11/13 | 11/13 | 11/13 | 11/13 | 13/18 | 15/20 | 17/22 | 20/25 | 24/30 | 29/35 | 34/41 | 40/48 |

Standard sizes xSmall to xxxLarge; AX1 to AX5 are the larger accessibility sizes.

### System colors (RGB), SwiftUI API; visionOS uses default dark values (out of scope)
Never hard-code; for design reference only.

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

### System gray colors (RGB), iOS, iPadOS
SwiftUI equivalent of `systemGray` is `gray`.

| Gray (UIKit) | Light | Dark | Increased contrast light | Increased contrast dark |
|---|---|---|---|---|
| Gray (`systemGray`) | 142,142,147 | 142,142,147 | 108,108,112 | 174,174,178 |
| Gray (2) (`systemGray2`) | 174,174,178 | 99,99,102 | 142,142,147 | 124,124,128 |
| Gray (3) (`systemGray3`) | 199,199,204 | 72,72,74 | 174,174,178 | 84,84,86 |
| Gray (4) (`systemGray4`) | 209,209,214 | 58,58,60 | 188,188,192 | 68,68,70 |
| Gray (5) (`systemGray5`) | 229,229,234 | 44,44,46 | 216,216,220 | 54,54,56 |
| Gray (6) (`systemGray6`) | 242,242,247 | 28,28,30 | 235,235,240 | 36,36,38 |

### Dynamic foreground colors (UIKit)
| Color | Use | UIKit API |
|---|---|---|
| Label | A text label that contains primary content. | `label` |
| Secondary label | A text label that contains secondary content. | `secondaryLabel` |
| Tertiary label | A text label that contains tertiary content. | `tertiaryLabel` |
| Quaternary label | A text label that contains quaternary content. | `quaternaryLabel` |
| Placeholder text | Placeholder text in controls or text views. | `placeholderText` |
| Separator | A separator that allows some underlying content to be visible. | `separator` |
| Opaque separator | A separator that doesn’t allow any underlying content to be visible. | `opaqueSeparator` |
| Link | Text that functions as a link. | `link` |

### Dynamic background colors
- Two sets: system (`systemBackground`, `secondarySystemBackground`, `tertiarySystemBackground`) and grouped (`systemGroupedBackground`, `secondarySystemGroupedBackground`, `tertiarySystemGroupedBackground`). Use grouped for grouped table views, else system.
- Primary = overall view; secondary = grouping within; tertiary = grouping within secondary.
- Dark Mode: base (dimmer, recedes) vs elevated (brighter, advances) backgrounds for layered interfaces (popover, modal sheet, multitasking, multiple windows); prefer system backgrounds so these distinctions survive.

### Standard materials (content layer; alongside Liquid Glass)
- Four: ultra-thin, thin, regular (default), thick (increasing opacity/darkness).
- Vibrancy levels (`UIVibrancyEffectStyle`): labels `label` (default), `secondaryLabel`, `tertiaryLabel`, `quaternaryLabel` (avoid quaternary on thin and ultraThin: contrast too low; others OK on any material); fills `fill` (default), `secondaryFill`, `tertiaryFill` (any material); `separator` single default level (any material). Default = highest contrast, quaternary lowest.
- Clear Liquid Glass over bright content: dark dimming layer at 35% opacity.

### Tracking (iOS, iPadOS; same values for visionOS)
Format: tracking in 1/1000 em / tracking in pt. System font adjusts tracking at runtime per size; use only for mockups. Point size based on 144 ppi @2x, 216 ppi @3x. Not all apps express tracking as 1/1000 em.

| Size pt | SF Pro | SF Pro Rounded | New York |
|---|---|---|---|
| 6 | +41 / +0.24 | +87 / +0.51 | +40 / +0.23 |
| 7 | +34 / +0.23 | +80 / +0.54 | +32 / +0.22 |
| 8 | +26 / +0.21 | +72 / +0.57 | +25 / +0.20 |
| 9 | +19 / +0.17 | +65 / +0.57 | +20 / +0.18 |
| 10 | +12 / +0.12 | +58 / +0.57 | +16 / +0.15 |
| 11 | +6 / +0.06 | +52 / +0.56 | +11 / +.12 |
| 12 | 0 / 0.0 | +46 / +0.54 | +6 / +0.07 |
| 13 | -6 / -0.08 | +40 / +0.51 | +4 / +0.05 |
| 14 | -11 / -0.15 | +35 / +0.48 | +2 / +0.03 |
| 15 | -16 / -0.23 | +30 / +0.44 | +0 / +0.00 |
| 16 | -20 / -0.31 | +26 / +0.41 | -2 / -0.03 |
| 17 | -26 / -0.43 | +22 / +0.37 | -4 / -0.07 |
| 18 | -25 / -0.44 | +21 / +0.37 | -6 / -0.11 |
| 19 | -24 / -0.45 | +20 / +0.37 | -8 / -0.15 |
| 20 | -23 / -0.45 | +18 / +0.36 | -10 / -0.20 |
| 21 | -18 / -0.36 | +17 / +0.35 | -10 / -0.21 |
| 22 | -12 / -0.26 | +16 / +0.34 | -10 / -0.23 |
| 23 | -4 / -0.10 | +16 / +0.35 | -11 / -0.25 |
| 24 | +3 / +0.07 | +15 / +0.35 | -11 / -0.26 |
| 25 | +6 / +0.15 | +14 / +0.35 | -11 / -0.27 |
| 26 | +8 / +0.22 | +14 / +0.36 | -12 / -0.29 |
| 27 | +11 / +0.29 | +14 / +0.36 | -12 / -0.32 |
| 28 | +14 / +0.38 | +13 / +0.36 | -12 / -0.33 |
| 29 | +14 / +0.40 | +13 / +0.37 | -12 / -0.34 |
| 30 | +14 / +0.40 | +12 / +0.37 | -12 / -0.37 |
| 31 | +13 / +0.39 | +12 / +0.36 | -13 / -0.39 |
| 32 | +13 / +0.41 | +12 / +0.38 | -13 / -0.41 |
| 33 | +12 / +0.40 | +12 / +0.39 | -13 / -0.42 |
| 34 | +12 / +0.40 | +12 / +0.38 | -14 / -0.45 |
| 35 | +11 / +0.38 | +11 / +0.38 | -14 / -0.48 |
| 36 | +10 / +0.37 | +11 / +0.39 | -14 / -0.49 |
| 37 | +10 / +0.36 | +10 / +0.38 | - |
| 38 | +10 / +0.37 | +10 / +0.39 | -14 / -0.52 |
| 39 | +10 / +0.38 | +10 / +0.38 | - |
| 40 | +10 / +0.37 | +10 / +0.39 | -14 / -0.55 |
| 41 | +9 / +0.36 | +10 / +0.38 | - |
| 42 | +9 / +0.37 | +10 / +0.39 | -14 / -0.57 |
| 43 | +9 / +0.38 | +9 / +0.38 | - |
| 44 | +8 / +0.37 | +8 / +0.37 | -14 / -0.62 |
| 45 | +8 / +0.35 | +8 / +0.37 | - |
| 46 | +8 / +0.36 | +8 / +0.36 | -14 / -0.65 |
| 47 | +8 / +0.37 | +8 / +0.37 | - |
| 48 | +8 / +0.35 | +8 / +0.35 | -14 / -0.68 |
| 49 | +7 / +0.33 | +8 / +0.36 | - |
| 50 | +7 / +0.34 | +7 / +0.34 | -14 / -0.71 |
| 51 | +7 / +0.35 | +6 / +0.32 | - |
| 52 | +6 / +0.33 | +6 / +0.33 | -14 / -0.74 |
| 53 | +6 / +0.31 | +6 / +0.31 | - |
| 54 | +6 / +0.32 | +6 / +0.32 | -15 / -0.79 |
| 56 | +6 / +0.30 | +6 / +0.30 | - |
| 58 | +5 / +0.28 | +4 / +0.25 | -15 / -0.85 |
| 60 | +4 / +0.26 | +4 / +0.23 | - |
| 62 | +4 / +0.24 | +4 / +0.21 | -15 / -0.91 |
| 64 | +4 / +0.22 | +3 / +0.19 | - |
| 66 | +3 / +0.19 | +2 / +0.16 | -15 / -0.97 |
| 68 | +2 / +0.17 | +2 / +0.13 | - |
| 70 | +2 / +0.14 | +2 / +0.14 | -16 / -1.06 |
| 72 | +2 / +0.14 | +2 / +0.11 | -16 / -1.09 |
| 76 | +1 / +0.07 | +1 / +0.07 | - |
| 80 | 0 / 0 | 0 / 0.00 | -16 / -1.21 |
| 84 | 0 / 0 | 0 / 0.00 | - |
| 88 | 0 / 0 | 0 / 0.00 | -16 / -1.33 |
| 92 | 0 / 0 | 0 / 0.00 | - |
| 96 | 0 / 0 | 0 / 0.00 | -16 / -1.50 |
| 100 | - | - | -16 / -1.56 |
| 120 | - | - | -16 / -1.88 |
| 140 | - | - | -16 / -2.26 |
| 160 | - | - | -16 / -2.58 |
| 180 | - | - | -17 / -2.99 |
| 200 | - | - | -17 / -3.32 |
| 220 | - | - | -18 / -3.76 |
| 240 | - | - | -18 / -4.22 |
| 260 | - | - | -18 / -4.57 |

## Platform considerations folded in from foundations
- Color: grouped/system background sets (above); label/separator/link colors (above); respect Increase Contrast (increased-contrast columns).
- Dark Mode: base/elevated backgrounds (above).
- Materials: four standard materials and vibrancy values (above).
- Typography: SF Pro system font; Dynamic Type supported; see tables above; keep layout adapting to all sizes, minimal truncation at AX sizes, stacked layouts at large sizes.
- Accessibility: no additional iOS considerations beyond foundations.md.
- Layout: size classes drive layout (see foundations.md); keep functionality the same across size classes.
- Alternate app icons need their own dark, clear, tinted variants.
- Privacy: Location button available (Core Location); see foundations.md.
- Home Screen icon appearances user-selectable: default, dark, clear, tinted.

## Designing for iPhone Duo ([HIG](https://developer.apple.com/design/human-interface-guidelines/designing-for-iphone-duo))
- Two displays (outer, inner), each with front camera, hinge in center. Still designing for iPhone: iOS patterns and best practices apply. Standard system components + resizing support adapt automatically.
- Outer display in use when closed: system places toolbars and tab bars on the side to maximize vertical space; stay on side in landscape when opened. Outer camera at corner, always visible, aligned with side controls; inner camera hidden behind display until active.
- Device poses (book-like, on surface, on edges): do not design a custom layout per pose; use size classes. Compact width for outer display, regular width for inner; let layout expand instead of reinventing on resize. Preview poses with Device Hub in Xcode.

### Best practices
- Build to resize (two displays, many poses, Split View): use size classes, layout margins, safe area insets; avoid fixed widths and display-specific dependencies.
- Consistent experience across displays: same functionality and element state; keep information hierarchy, optionally show an extra hierarchy level on inner display (e.g. Mail: list or message when closed, both side by side when open).
- Same functionality in every pose: controls may overflow, content may move/resize; always give access to same controls and content.
- Follow the system's vertical layout for toolbars, tab bars, navigation controls (outer display wider and shorter, so controls move to side; inner display in landscape keeps them on side). Standard components do this automatically; refine as needed.
- Games: playable in every pose; may lock portrait or landscape but fill the screen as pose changes; keep text and control sizes consistent when resizing; prefer changing aspect ratio over letterbox/pillarbox, else fill padding with artwork.

### Dynamic layouts
- Use layout margins and safe area insets; avoid fixed widths and anything tied to a specific display (`safeAreaInsets`).
- Reserved regions (content avoids covering, or components adapt): outer front camera (always present; expands into Dynamic Island for Live Activities; system arranges side controls around it); inner front camera (only when active; UI moves aside); folding region (conditional; when partially open divides inner display into usable regions, excluding the center).
- System components (alerts, context menus, sheets) move to account for the fold; split views adapt column widths/margins to inner display symmetry. Custom components: `ReservedRegion` (SwiftUI), `UIView.ReservedRegion` (UIKit).
- Adapt on fold: prefer containers that adapt automatically (e.g. Notes split view resizing panes); grid layouts prefer an even number of columns; use `ReservedRegion` to keep important elements clear of center.
- Avoid extreme layout changes while folding: move only what's necessary to keep elements visible and tappable; favor small adjustments over rearrangement.
- Split views: expand on inner display, collapse to a single pane on outer (like regular/compact elsewhere); standard components adapt to reserved regions (`NavigationSplitView`, `UISplitViewController`).
- Arrangement views: container with primary and secondary views, organizes by display size, orientation, reserved regions. Types: split (divides area; horizontal when wider than tall, vertical when taller than wide) and overlay (stacked; when partially folded each side gets one, else primary atop secondary). Can limit split axes and collapse secondary in overlay. Use when layout already resembles one (HStack/VStack = split; ZStack = overlay). Keep navigation containers (navigation split views, tab views) outside arrangement views. (`ArrangementView`, `UIArrangementViewController`).

### Vertical controls
- Toolbars, tab bars, navigation controls move to the side on iPhone Duo (exception: inner display in portrait keeps standard horizontal bars). Side controls include Dynamic Island, status bar, toolbar (incl. navigation buttons), tab bar (order top to bottom on trailing edge).
- Two apps in Split View on inner display: each places controls on its outer edge (left app left).
- Controls align to hardware: same position relative to camera on outer display; same side in right-to-left languages.
- Account for asymmetry: use safe areas so controls (including those on the opposite edge) never cover content.
- Keep controls consistent across poses: similar relative positions so people don't relearn locations.
- Standard toolbar placement order: top of vertical axis for primary navigation (Back, Close), then prominent actions (Done); remaining items keep original groupings; system adds vertical space between top-bar and bottom-bar items.
- Prioritize frequently used items: overflow goes bottom to top by default; set visibility priority (groups first, then items) (`ToolbarItemVisibilityPriority`, `UIBarButtonItemVisibilityPriority`). Keep frequent actions first (Compose in Mail, New Note in Notes) and status-conveying items (badges) visible longer.
- Don't override default bar placement.
- Consider full display width where bars unnecessary (visual, immersive, non-scrolling, nothing conflicting with Dynamic Island or status bar; e.g. Calculator: 5 columns of 4 buttons on Duo outer vs 4 columns of 5 on iPhone 16 portrait). May combine: full-width background/header with inset scrollable content.
- Group related toolbar items (`ToolbarItemGroup`, `UIBarButtonItemGroup`) instead of manual spacing.
- Locate controls near the content they affect (e.g. Mail list controls stay above the leading pane).
- Give each non-text-only toolbar item both title and symbol (title used in overflow menus and expanded forms) (`Label`, `UIBarButtonItem`). Minimize text-based buttons (text labels force horizontal bars); prefer symbols.
- Limited space: navigation-focused experiences move toolbar items into overflow and keep tab bar (default); task-oriented experiences minimize tab bar to preserve toolbar actions (`ToolbarVerticalCompressionBehavior`, `UIVerticalBarCompressionBehavior`).
- Use the system overflow menu; move any custom overflow actions into it; reserve ellipsis symbol for overflow, distinct symbol for other menus (`ToolbarOverflowMenu`, `additionalOverflowItems`).
