---
name: apple-design
description: "Designs, builds or reviews native Apple app UI (iOS, iPadOS, macOS, Mac Catalyst) to Apple's Human Interface Guidelines: every rule, including Liquid Glass, Dynamic Type, system colors, standard components and the platform's hard numbers. Use when working on SwiftUI, UIKit or AppKit views, an Xcode project, or when asked to check an Apple app against the HIG. Not for web UI: that is web-design."
---

# Apple design (HIG)

Native Apple apps follow the Human Interface Guidelines (HIG) in full. The
rules live in `references/`, one file per HIG section, paraphrased with a
link to the page each rule comes from. Load only the files the task needs.

## Scope
- iOS, iPadOS, macOS, Mac Catalyst. watchOS, tvOS, visionOS and CarPlay are
  out of scope: say so and use the HIG pages directly.
- Rule voice: **Must** / **Never** are hard rules; a plain imperative is the
  HIG's strong default. Deviate only with a written reason in the code or PR.

## Route
1. Always: `references/principles.md` (8 principles, the tie-breaker).
2. The platform file: `references/platforms/ios.md`, `ipados.md`, or
   `macos.md` (sizes, Dynamic Type, system colors, platform rules). An app
   on several platforms: each one.
3. By what the change touches:

| Touches | Load |
|---|---|
| Color, type, icons, images, layout, motion, dark mode, materials, a11y, copy, privacy | `references/foundations.md` |
| A flow: forms, loading, feedback, modality, onboarding, search, settings, undo, accounts, notifications, media | `references/patterns.md` |
| Charts, image or text views, web views | `references/components-content.md` |
| Lists, tables, collections, split views, tab views, disclosure, labels | `references/components-layout.md` |
| Buttons, menus, context menus, toolbars, menu bar, share | `references/components-menus.md` |
| Tab bars, sidebars, search fields, path or token fields | `references/components-navigation.md` |
| Alerts, sheets, popovers, action sheets, windows, panels, scroll views | `references/components-presentation.md` |
| Pickers, toggles, sliders, steppers, text fields, segmented controls, keyboards | `references/components-selection.md` |
| Progress, gauges, ratings | `references/components-status.md` |
| Widgets, Live Activities, notifications, controls, App Shortcuts | `references/components-system.md` |
| Gestures, keyboard shortcuts, pointer, Pencil, focus, game controls | `references/inputs.md` |
| Apple Pay, Sign in with Apple, IAP, maps, AI/ML features, VoiceOver, iCloud, other Apple technologies | `references/technologies.md` |

## Defaults that hold everywhere
- Prefer system components (SwiftUI/UIKit/AppKit) over custom ones: they get
  Liquid Glass, Dynamic Type, Dark Mode, accessibility, and RTL for free.
- Semantic system colors and text styles, never hard-coded values or fixed
  font sizes. Every custom color has light, dark and increased-contrast
  variants.
- Liquid Glass belongs to the controls and navigation layer, never the
  content layer; use it sparingly on custom controls.
- Hit targets and text sizes: the platform file's tables, never below the
  minimum column.
- SF Symbols for icons; standard symbols for standard actions.
- Support Dynamic Type up to the accessibility sizes, VoiceOver labels, Reduce
  Motion, Reduce Transparency, Increase Contrast, and right-to-left.

## Build mode
Before writing UI: name the platform(s), load the files per Route, then write
with system components first. State any deliberate deviation in one line with
its reason.

## Review mode
Walk the changed screens against the loaded files. Each finding:
`SEVERITY  file:line (or screen)  rule  [HIG page link]  fix in one line`.
- CRITICAL: blocks a task or excludes people (inaccessible, unreadable, a
  trap with no way back, data loss without warning).
- MUST-FIX: breaks a **Must**/**Never** rule or a hard number.
- NICE-TO-HAVE: a default not followed, with a concrete user cost.
Taste alone is not a finding.

## Freshness
Every reference file has a `last-checked:` date. The HIG changes often (its
pages carry change logs); when a rule seems out of date, check the linked
page and trust the page.
