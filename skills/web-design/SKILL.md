---
name: web-design
description: "Sets the behavior, accessibility, wording and structure of web app UI from the parts of Apple's Human Interface Guidelines that transfer to the web: principles, WCAG 2.2 AA accessibility, color and dark mode, layout, writing, and HIG components and patterns translated to HTML, CSS and ARIA. Use when building or reviewing web app screens, forms, dialogs, navigation or flows in any framework. Look-neutral: pairs with the repo's design system or a visual-style skill. Not for native Apple apps: that is apple-design."
---

# Web design (HIG-derived)

The HIG's principles and behavior rules, translated for the browser. The look
stays neutral: the repo's design system wins on visuals; this skill sets
behavior, accessibility, wording and structure. Where the HIG and common web
practice disagree, this file settles it once ("Settled conflicts").

## Route
1. Always: `../apple-design/references/principles.md` (the 8 principles). Installed without apple-design: Purpose, Agency, Responsibility, Familiarity, Flexibility, Simplicity, Craft, Delight ([HIG](https://developer.apple.com/design/human-interface-guidelines/design-principles)).
2. Then by what the change touches:

| Touches | Load |
|---|---|
| Any UI (contrast, targets, keyboard, screen readers, motion, zoom) | `references/a11y.md` |
| Buttons, dialogs, menus, nav, tabs, forms controls, lists, tables, search, progress | `references/components-web.md` |
| A settings page or form | `references/patterns-web.md` (Settings, Entering data) + `components-web.md` (Toggles, Text fields, Lists) + `writing.md` |
| A flow: forms, loading, feedback, modality, onboarding, search, settings, undo, accounts, permissions, notifications | `references/patterns-web.md` |
| Labels, errors, empty states, button text, tone | `references/writing.md` |
| Color, theming, type scale, layout, icons, images, motion, RTL | `references/foundations-web.md` |
| Apple Pay on the web, Sign in with Apple JS, MapKit JS | `references/apple-web-apis.md` |

## Translation table
| HIG | Web |
|---|---|
| Dynamic Type, text up to 200% | `rem` sizes, no fixed-height text containers; works at 200% browser zoom and a 200% default font size |
| Min text 11 pt, body 17 pt (iOS) | Body 16-17 px; nothing under 11 px, *(house)* prefer 12 px+ |
| 44x44 pt hit target (28x28 min) | 44x44 CSS px for primary touch targets; never under WCAG 2.2's 24x24 px |
| Contrast 4.5:1 (text ≤17 pt), 3:1 (≥18 pt or bold) | WCAG 1.4.3 thresholds, not the HIG's pt ones: 4.5:1 under 24 px (bold under 18.66 px), 3:1 at or above; aim for 7:1 on small custom text |
| Light / Dark / Increase Contrast | `prefers-color-scheme`, `prefers-contrast: more`; tokens for each |
| Reduce Motion, Reduce Transparency | `prefers-reduced-motion`, `prefers-reduced-transparency` (Chromium-only; also honor `prefers-contrast: more`) |
| Materials, Liquid Glass | Optional `backdrop-filter` on floating controls only, solid fallback (`@supports`), off under reduced transparency; never on content |
| Safe areas | `viewport-fit=cover` + `env(safe-area-inset-*)` |
| Size classes, not devices | Container and width queries; never sniff the device |
| Right to left | `dir`, CSS logical properties (`margin-inline-start`, `text-align: start`) |
| SF Symbols | One icon set, sized in `em`, stroke matched to text weight |
| VoiceOver | Semantic HTML first, then ARIA; names, roles, states, live regions |
| ⌘ shortcuts | ⌘ on macOS, Ctrl elsewhere; never take browser-reserved shortcuts |
| Alert | `<dialog>` with `role="alertdialog"` |
| Sheet | Modal `<dialog>` (bottom sheet on narrow screens) |
| Popover | Popover API / anchored non-modal panel; a full sheet on narrow screens |
| Segmented control | Radio group, or `role="tablist"` when it switches views |
| Toggle (switch) | `<button role="switch" aria-checked>`; checkbox inside forms |
| Pop-up button / pull-down button | `<select>` / menu button (`aria-haspopup="menu"`) |

## Settled conflicts
HIG-backed unless tagged *(house)*: a house default is this skill's call where
the HIG is silent. In Review mode a broken house default is NICE-TO-HAVE,
never MUST-FIX.
- Dialog buttons: primary on the trailing side, Cancel leading (stacked: Cancel
  last). Escape cancels.
- Destructive actions are never the primary or default button. Destructive
  style only when the person did not deliberately choose the action (see
  Alerts in `references/components-web.md`). *(house)* In a destructive
  confirm, initial focus goes to Cancel.
- Prefer undo (a toast with Undo) over "Are you sure?" for reversible actions;
  confirm only what cannot be undone.
- Button labels are verbs ("Delete Draft"); never OK, Yes or No when a verb
  fits.
- Documents autosave; transactions (pay, send, submit) use an explicit button.
- Ask for permissions (notifications, location, camera) in context, when the
  feature starts; never on page load.
- Unavailable items: dim in menus, hide in context menus, never disable a tab
  bar item (explain an empty section instead).
- *(house)* Mobile nav: keep the top-level sections visible (bottom bar or
  top nav, 5 or fewer); a hamburger only for secondary items.
- Visible label on every field; a placeholder is an example, never the label.
- No splash screens or forced tours.
- *(house)* Motion durations: the HIG gives none. House default: 150-250 ms for state
  changes, up to 300-400 ms for large surfaces, ease-out, nothing on frequent
  actions. This is a heuristic, not HIG.

## Theme tokens
Semantic CSS custom properties, not raw values: `--bg`, `--bg-elevated`,
`--fg`, `--fg-secondary`, `--fg-tertiary`, `--separator`, `--accent`,
`--accent-fg`, `--destructive`, `--focus-ring`. Define them for light, dark
(`@media (prefers-color-scheme: dark)`), an explicit `[data-theme]` override,
and `prefers-contrast: more`. Accent color only on the primary action and
status, never as body text. Map the tokens into the repo's styling system
(Tailwind theme, CSS modules, a component library) rather than adding one.

## Build mode
Load per Route, use the repo's components and tokens first, semantic HTML
before ARIA. State any deliberate deviation in one line with its reason.

## Review mode
Walk the changed screens and flows against the loaded files. Each finding:
`SEVERITY  file:line (or screen + viewport)  rule  [source]  fix in one line`.
Source is a HIG page link or a WCAG criterion.
- CRITICAL: blocks a task or excludes people (keyboard trap, unreadable,
  unlabeled control, data loss without warning).
- MUST-FIX: breaks a **Must**/**Never** rule, an untagged settled conflict, or
  WCAG 2.2 AA.
- NICE-TO-HAVE: a default not followed, with a concrete user cost.
Taste alone is not a finding.
