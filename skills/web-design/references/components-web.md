# Components for the web

last-checked: 2026-10-25
scope: HIG component rules that transfer to web apps, translated to HTML/CSS/ARIA. pt = CSS px. Translation table and settled conflicts: see SKILL.md. Native-only components (widgets, Live Activities, controls, complications, Dock menus, menu bar extras, panels, window chrome, status bars, activity rings) are skipped.

## Buttons → `<button>` ([HIG](https://developer.apple.com/design/human-interface-guidelines/buttons))
- `<button>` for actions, `<a href>` for navigation. Never `div` + click.
- **Must** hit region 44x44 px for primary touch targets (never under 24x24 px); space between buttons so they are distinguishable and tappable.
- **Must** style `:hover`, `:active` (press) and `:focus-visible` on custom buttons.
- Prominent (filled, accent) style for the single most likely action; 1-2 prominent buttons per view. Show preference by style, not size; equal sizes for a related set.
- Label: short, verb first ("Add to Cart"); icon only when universally familiar, with `aria-label` or visible text. Title-style caps for button labels in the HIG; match repo casing.
- Roles: normal, primary (default; Enter submits), cancel, destructive (destructive color). **Never** make a destructive action the primary/default, even if most likely.
- Non-instant action: show a spinner inside the button, change label ("Checking out…"), `aria-busy="true"`, keep width stable. In a form, Continue/Next becomes available once the required data is in (HIG Entering data).
- Opens another dialog/page needing more input: trailing ellipsis in label.
- Icon-only toggles: show state through background and `aria-pressed`, not color alone.
- Help button (circular `?`): max 1 per view, in the content, not in a toolbar.

## Toggles and switch → `<button role="switch" aria-checked>` / `<input type="checkbox">` ([HIG](https://developer.apple.com/design/human-interface-guidelines/toggles))
- Use only for two opposing states. Choosing among options: select/radios.
- Name what it affects with a visible `<label>`, or `aria-labelledby` pointing at the row text (WCAG 4.1.2). Never rely on color alone for state; fill, shape, check or dot too.
- *(house)* Switch for a setting that applies immediately; checkbox in forms that submit. Checkbox for hierarchies of settings (indent dependents); mixed state = `aria-checked="mixed"` / `indeterminate` when children differ.
- Radio group: 2 to 5 mutually exclusive options, `<fieldset><legend>`; more than about 5: `<select>`. Multiple selections: checkboxes.
- One on/off setting: prefer checkbox (clearer state). Horizontal radios: spacing sized to longest label.

## Segmented control → radio group or `role="tablist"` ([HIG](https://developer.apple.com/design/human-interface-guidelines/segmented-controls))
- 2+ closely related choices on one object/state/view; grouping stays visible at any width.
- Count: about 5-7 max on wide layouts, about 5 max on narrow.
- Equal widths; text or icons, not mixed; nouns/noun phrases. Icon-only segments need `aria-label` and a tooltip.
- Single selection = radio group (`role="radiogroup"` or native radios styled). Switching a view = tabs (`role="tablist"`, arrow keys). Never mix action buttons and selection in one control.
- Entirely separate app sections: navigation, not a segmented control.

## Pop-up and pull-down buttons → `<select>` / menu button ([HIG](https://developer.apple.com/design/human-interface-guidelines/pop-up-buttons), [pull-down](https://developer.apple.com/design/human-interface-guidelines/pull-down-buttons))
- Pop-up = flat list of mutually exclusive options, shows current value: native `<select>`, or a select-only combobox (`role="combobox"` trigger + `role="listbox"` popup). Menu closes on choice.
- Pull-down = commands tied to the button's purpose (Add → types, Sort → attributes): `<button aria-haspopup="menu" aria-expanded>` opening `role="menu"`. Closes, then action runs.
- Pop-up: pick a useful default (most likely), make effect predictable with a label before or on the button; good when space is tight. Optional "Custom" item.
- Pull-down: at least 3 items (1-2: use buttons/toggles); not all of a view's actions in one; primary actions stay visible. Menu title only if it adds meaning.
- Destructive items: destructive color; confirm per settled conflicts.
- Icon after label only when it adds value.
- "More" (ellipsis) menu for low-priority actions: weigh space vs discoverability; give it `aria-label="More actions"`.

## Menus → `role="menu"` / `menuitem` ([HIG](https://developer.apple.com/design/human-interface-guidelines/menus))
- Use `role="menu"` only for action menus (arrow keys, Home/End, type-ahead, Esc closes, focus returns to trigger). Site nav is links, not a menu role.
- Item labels: clear, succinct, verb for actions; drop articles; ellipsis when more input is needed.
- Unavailable items: dimmed + `aria-disabled="true"`, still in the menu (SKILL.md settled conflict). Keep the menu openable even if all items are unavailable.
- Group related items with separators (`role="separator"`); frequent/important first; keep logically related commands together even if importance differs.
- Submenus: one level, chevron, sparingly; when a term repeats across more than 2 items. More than about 5 items in a submenu: make it a separate menu. Prefer a submenu to indenting. Parent item stays available.
- Toggled items: one item with a state label (Show Map / Hide Map), add a verb if ambiguous; or `menuitemcheckbox`/`menuitemradio` with check for attributes in effect. Offer a clear-all item when several attributes toggle.
- Icons: standard icons for common actions, sparingly; all items in a group have icons or none.
- Show the shortcut beside the item when one exists.
- Dynamic items (changed by a modifier key): **never** the only route to a task; single modifier only; not in context menus.

## Context menus → `contextmenu` event + `role="menu"` ([HIG](https://developer.apple.com/design/human-interface-guidelines/context-menus))
- Secondary click, Shift+F10 / Menu key, long-press on touch. Don't suppress the native menu on text inputs, links or images unless replacing it with something better.
- Keep short and relevant; no advanced items; consistent across the app.
- **Must** expose every item elsewhere in the main UI (toolbar, row action, menu). Context menu is a shortcut only.
- One submenu level; no more than about 3 groups.
- Hide unavailable items (don't dim); Cut/Copy/Paste may show dimmed.
- Most frequent items nearest the pointer/touch point; destructive items last, destructive color.
- Title only when it clarifies (e.g. count of selected items). Use familiar icons for Copy/Share/Delete.
- Shortcuts: show in main menus, not in context menus.
- Edit commands on selected text: use the native menu; offer undo/redo; differentiate Delete (remove) from Cut (copy then remove). Custom commands after the system ones, few, verb labels.

## Toolbars → `role="toolbar"` / `<header>` actions ([HIG](https://developer.apple.com/design/human-interface-guidelines/toolbars))
- Acts on content, navigates, orients: title, back/search, action buttons and menus. Tab bar/nav is for switching sections, not actions.
- `role="toolbar"` with `aria-label`; arrow keys move between items (roving tabindex) when it has 3+ controls.
- Three groups max, placed leading / center / trailing: leading = back, sidebar toggle, title, document menu; center = common controls; trailing = always-available items, inspector toggles, search, More menu, primary action (Done, Submit).
- Group by function and frequency; separate navigation and critical actions (Done, Close, Save) from the rest; consistent placement across screens.
- Title: describes location, under 15 characters, never the app name; may be empty if redundant.
- Back: standard back affordance with symbol; consistent app-wide; don't hide it.
- Symbols over text for clear actions, text where symbols fail (Edit). Don't draw borders around icon buttons (container shows affordance). Separate text actions from symbol actions with space.
- Define overflow: lowest-priority items move to a More menu as width shrinks; avoid layouts that overflow by default. One prominent primary action, trailing.
- Optionally hide the toolbar for distraction-free content, with a reliable way to bring it back.

## Tab bars (mobile nav) → `<nav>` of links or `role="tablist"` ([HIG](https://developer.apple.com/design/human-interface-guidelines/tab-bars))
- Top-level sections only; navigation, not actions. Keep the bar visible when moving between sections; preserve each section's state.
- Few tabs; *(house)* 5 or fewer on narrow screens (see SKILL.md Mobile nav). Overflow into a "More" tab is hard to find; limit it.
- **Never** hide or disable a tab when its content is empty; explain the empty state.
- Labels: one word where possible; label beside icon on wide, beneath on narrow. Filled icons for the selected state. Mark current with `aria-current="page"`.
- Badge (count or `!`) only for critical new/updated info.
- Real navigation between pages = `<nav>` + links; client-side view switching within a page = tabs pattern.
- Many sections or deep structure: use a sidebar on wide screens, adaptive to the bar on narrow.

## Tab views → `role="tablist"` / `tab` / `tabpanel` ([HIG](https://developer.apple.com/design/human-interface-guidelines/tab-views))
- Mutually exclusive panels of closely related content in one area; each self-contained, controls affect only their panel.
- Labels: nouns/noun phrases describing the panel. Avoid more than 6 tabs; beyond that use another pattern (menu, sidebar).
- Don't use a select to switch tabs (two clicks, hidden choices) unless there are too many.
- Roving tabindex, arrow keys between tabs, `aria-selected`, `aria-controls`; panel `tabindex="0"` if it has no focusable content.

## Sidebars → `<nav aria-label>` + `<ul>` ([HIG](https://developer.apple.com/design/human-interface-guidelines/sidebars))
- Leading-side navigation between areas or top-level collections; needs width. On narrow screens collapse to the tab bar or an off-canvas drawer.
- Max 2 hierarchy levels; deeper: add a content-list column between sidebar and detail (split view). Group titles succinct.
- Let people hide/show it with a visible button (`aria-expanded`); **never** hidden by default on wide screens. Optionally customizable order/contents.
- Group a content-heavy hierarchy with disclosure controls. One icon set, matching the text; icon color serves meaning (default: accent).
- **Never** put critical info or actions at the bottom edge of a sidebar.
- Optionally auto-collapse when the window is narrow.

## Split views → CSS grid/flex panes ([HIG](https://developer.apple.com/design/human-interface-guidelines/split-views))
- Adjacent panes: selecting in the primary pane shows content in the secondary (list → detail); optional third pane.
- Persistently highlight the current selection in each pane leading to the detail (`aria-current`/`aria-selected`).
- Prefer multi-pane on wide layouts only; on narrow, show one pane at a time with a clear back route (container queries, not device sniffing).
- Resizable divider: `role="separator"` with `aria-valuenow`, keyboard arrows, set min/max pane widths so the divider stays visible. Thin divider (1 px). Allow hiding a pane with more than one way to reveal it (button, shortcut).
- Consider drag and drop between panes (with keyboard alternative).

## Search fields → `<input type="search">` in `role="search"` ([HIG](https://developer.apple.com/design/human-interface-guidelines/search-fields))
- Search icon, clear button, placeholder naming what is searched; the visible label rule still applies (icon + `aria-label` is acceptable for a standard search field).
- Search as the user types when feasible (debounce); most relevant results first; consider categories.
- Suggestions: recent searches before typing, predictions while typing (`role="combobox"` + `listbox`, `aria-activedescendant`). Offer a way to clear history.
- Scope: a scope filter among clearly defined categories, broad → narrow, default to the broader scope. Show current scope (placeholder, chips, title).
- Tokens (chips) encapsulate a search term, selectable and removable as a unit; pair with suggestions so people discover them.
- Placement: top of a sidebar to filter it; trailing side of the toolbar for global search with results in the detail pane; inline above the list it filters; a dedicated search area when discovery matters (focus the field on arrival, except where the virtual keyboard would cover the view).
- Keep search in one clearly identified place for all content; local filters are fine for distinct sections.

## Token fields → chips input ([HIG](https://developer.apple.com/design/human-interface-guidelines/token-fields))
- Text input converting entries into tokens that can be selected, removed, reordered or moved between fields (email recipients, tags).
- Create on comma by default; consider Enter/Tab too. Keyboard: Backspace selects then removes the last token, arrows move between.
- Optional suggestion list; consider a delay so it doesn't distract while typing. Per-token menu for edit/info.
- Each token: accessible name and a remove button with label.

## Path controls (breadcrumbs) → `<nav aria-label="Breadcrumb"><ol>` ([HIG](https://developer.apple.com/design/human-interface-guidelines/path-controls))
- Shows the path to the current item: root, ancestors, current. Long paths: hide the middle names, keep first and last. Current item `aria-current="page"`.
- Compact form: a pop-up showing the current item, menu lists ancestors.
- Place it in the content area, not in the toolbar/status strip.

## Alerts → `<dialog role="alertdialog">` ([HIG](https://developer.apple.com/design/human-interface-guidelines/alerts))
- Sparingly, only essential info with useful actions. Never merely to inform; show non-actionable info in context.
- Skip for common undoable actions (use undo toast). Alert for uncommon, destructive, non-undoable ones.
- **Never** at page load. On a startup problem (offline) show cached/placeholder content plus a quiet label.
- Structure: title, optional text, up to 3 buttons; text field only when input resolves it (e.g. password).
- Tone: direct, neutral, approachable; no blame, no masked severity. Title: specific, what happened and why, never "Error"/"Error 329347", no more than 2 lines. Complete sentence = sentence caps + period; fragment = no period.
- Informative text only if it adds value; short sentences. Don't explain buttons; if needed say "choose" + the exact label.
- Buttons: 1-2 words, verb tied to the message ("Delete Draft", "Reply"); "OK" only for purely informational alerts; avoid Yes/No. Cancel always labeled "Cancel".
- Order (see SKILL.md Settled conflicts): likeliest/default trailing (stacked: top), Cancel leading (stacked: bottom). Destructive style only for a destructive action the person did not deliberately choose. With a destructive action include Cancel; Cancel is never the default; a lone default button is "Done" not "Cancel".
- Esc dismisses (focus returns to the trigger); `aria-labelledby` title, `aria-describedby` message; focus first control inside (Cancel for a destructive confirm, per SKILL.md), trap focus, inert background.
- Avoid scrolling alerts: keep title and text short. Caution icon only for unexpected data loss, not for routine save/overwrite.
- Repeating alert: offer a "don't show again" checkbox.

## Sheets → modal `<dialog>` ([HIG](https://developer.apple.com/design/human-interface-guidelines/sheets))
- Scoped task tied to the current context: collect specific info or a simple task, then return. Bottom sheet on narrow screens, centered card on wide.
- Buttons: Cancel/Close dismisses without saving; Done dismisses after saving; Back goes to the previous step, **never** to dismiss. Done alone gives no exit: pair with Cancel or Back. **Never** show Cancel, Done and Back together.
- Single view: Cancel leading, Done trailing. Multi-step: step 1 Cancel + inactive Done; later steps Back + inactive Done; last step Back + Done.
- One sheet at a time; if one triggers another, close the first (optionally reopen after).
- Complex or long flows: use a full page/route instead of a sheet.
- Support Esc and (on touch) swipe-down to dismiss; with unsaved changes confirm first. Visible title naming the task.
- Resizable bottom sheet: detents of about half and full height; include a grabber that is also a button (tap cycles detents). Use the half detent for progressive disclosure; skip it for tall content like compose.
- Repeated input + watching results (find/replace): non-modal panel, not a modal sheet.
- Use non-modal side panels/drawers for supplementary content affecting the main task.

## Popovers → Popover API / anchored non-modal panel ([HIG](https://developer.apple.com/design/human-interface-guidelines/popovers))
- Transient panel after click on a control; small amount of info or a few related tasks. `popover` attribute / `aria-expanded` on the trigger.
- Anchor to the trigger with a pointer (arrow) as direct as possible; never cover the trigger or essential content. Size to content.
- Close on outside click or Esc, or on item selection; multi-select stays open until explicit dismissal. Close/Cancel/Done button only for clarity.
- **Always** save work when a non-modal popover auto-closes; discard only on explicit Cancel.
- One at a time; **never** cascade popovers; allow switching from one popover to another with a single click.
- Nothing over a popover except an alert. **Never** for warnings (easy to miss): use an alert.
- Narrow screens: use a bottom sheet/full-screen modal instead.
- Animate size changes so it reads as the same panel.

## Action sheets → `<dialog>` list of choices ([HIG](https://developer.apple.com/design/human-interface-guidelines/action-sheets))
- For choices tied to an action the person started (cancel a draft: delete, save, keep editing); alert is for unexpected problems.
- Sparingly. Short single-line title; message only if needed. Include Cancel if the action can destroy data, at the bottom; destructive choices in destructive style at the top.
- Never let it scroll; fewer buttons = faster, fewer accidents. On wide screens a menu or popover anchored to the trigger is acceptable.

## Scroll views → `overflow: auto` ([HIG](https://developer.apple.com/design/human-interface-guidelines/scroll-views))
- Keep native scrolling and keyboard scrolling (arrows, Space, PageUp/Down, Home/End); custom scrollbars must keep native behavior.
- Make scrollability apparent: let partial content peek at the edge; indicators may be hidden by the OS.
- Avoid nesting scroll containers of the same axis; mixed axes are fine.
- Page-by-page scrolling (`scroll-snap`) where it fits; overlap by one unit (row, line) to keep context.
- Auto-scroll only when relevant content is offscreen and only as far as needed: search hit/selection hidden, caret offscreen, pointer past the edge during selection (`scroll-margin`, `scrollIntoView({block:'nearest'})`).
- Zoom: set sensible min/max scale.
- Floating bars over scrolling content: give visual separation (shadow/blur edge) only when content actually scrolls under it; one edge effect per container.
- With a page control, hide the redundant scrollbar on that axis.

## Page controls (carousels) → dots as `role="tablist"` or buttons ([HIG](https://developer.apple.com/design/human-interface-guidelines/page-controls))
- Dots for a flat, ordered, sequential list of pages (carousel). Not for hierarchy.
- About 10 dots max; more peers: grid or other arrangement. Centered, near the bottom of the carousel.
- Current dot is solid. Dots are buttons (`aria-label="Page 3 of 7"`, `aria-current`); also give Previous/Next buttons and arrow keys.
- Animate the transition for click/tap, never for scrubbing.
- Max 2 distinct indicator icon types; don't tint them (current-page contrast drops).
- Hide the scrollbar on the same axis. Carousels must not autoplay without a pause control.

## Lists and tables → `<ul>` / `<table>` / `role="grid"` ([HIG](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables))
- Real `<table>` with `<th scope>` for tabular data; `role="grid"` only for editable cell navigation. Prefer text rows (scannable); many images or widely varying sizes: collection.
- Succinct row text; long content: list titles, content in a detail view. When clipped, ellipsis in the middle keeps both ends (file names, IDs); `text-overflow` + `title`/expansion tooltip.
- Multi-column: descriptive headings, nouns/short noun phrases, no trailing punctuation. Single column without a heading: add a label.
- Selection feedback: navigation lists persistently highlight the selected row; option lists highlight then show a checkmark.
- Sortable headings: click sorts, click again reverses; `aria-sort`, button inside `<th>`.
- Let people resize columns on wide data tables. Alternating row backgrounds are optional help for wide tables.
- Allow editing and reordering when sensible (drag + keyboard alternative); a drill-in row has a trailing chevron, an "info" button only reveals extra info and never navigates.
- Avoid an alphabet index strip next to trailing-edge controls.

## Outline views (tree grid) → `role="treegrid"` / `role="tree"` ([HIG](https://developer.apple.com/design/human-interface-guidelines/outline-views))
- Hierarchical data with disclosure triangles; non-hierarchical: use a table. Hierarchy shown in the first column only.
- `aria-expanded`, `aria-level`; Right/Left expand/collapse, Up/Down move. Click triangle expands one item; Alt/Option-click expands all descendants.
- Retain expansion state across sessions. Headings as for tables; click-to-sort at each level; resizable columns.
- Edit on single click of a cell; double-click can do another action (open). Center-ellipsis for clipped cell text. Offer a search field for long outlines.

## Collections → CSS grid of cards ([HIG](https://developer.apple.com/design/human-interface-guidelines/collections))
- Image-based or visual content in a standard row/grid; text content belongs in a list/table.
- Padding around items so hover/focus effects are visible and don't overlap.
- Keep selection standard (click/tap); add custom gestures only when needed.
- Animate insert, delete, reorder as feedback (respect reduced motion).
- Don't reflow layout during interaction unless the person caused it.

## Disclosure controls → `<details>` / `aria-expanded` button ([HIG](https://developer.apple.com/design/human-interface-guidelines/disclosure-controls))
- Hide details until relevant; most-used controls always visible, advanced ones collapsed.
- Triangle/chevron: points inline-start when collapsed, down when expanded; click toggles; content reflows.
- Label states what is hidden ("Advanced Options"), not "More". Mark with `aria-expanded` and `aria-controls`.
- A disclosure button tied to one control sits next to the control it reveals; max 1 per view.

## Labels → `<label>`, text elements ([HIG](https://developer.apple.com/design/human-interface-guidelines/labels))
- Static, copyable text. Use four emphasis levels via tokens: primary, secondary (subheads, supplemental), tertiary (unavailable), quaternary (watermark); all still meet contrast except deliberately inactive text.
- Keep error messages, IDs, addresses and similar values selectable (`user-select` not `none`).
- Small text only; editable small text is an input, long is a textarea.

## Boxes → `<fieldset>` / bordered `<section>` ([HIG](https://developer.apple.com/design/human-interface-guidelines/boxes))
- Group related content with a border or background; keep it small relative to its container.
- Use spacing and alignment for sub-groups; avoid nested boxes.
- Title only if it clarifies: brief phrase, sentence case, no ending punctuation; `<legend>` or `aria-labelledby` so screen readers get it.

## Text fields → `<input>` ([HIG](https://developer.apple.com/design/human-interface-guidelines/text-fields))
- Small specific input (name, email); longer: textarea. Visible `<label>` always; placeholder is a hint ("name@example.com") that vanishes, never the label.
- `type="password"` for sensitive data; correct `type`, `autocomplete`, `inputmode`, `enterkeyhint` (see Virtual keyboards).
- Size to the expected text. Stack multiple fields vertically, consistent widths, spacing that pairs label and field.
- Logical tab order (DOM order). Validate when sensible: email on blur, others as the person corrects; show the error next to the field, `aria-invalid`, `aria-describedby`. Validate username and password before focus leaves the field; *(house)* don't flag a field while the person is still typing in it.
- Numeric data: `inputmode="numeric"`/`decimal`, format by locale (`Intl.NumberFormat`); don't assume separators.
- Overflowing text: clip, wrap or ellipsis; offer an expansion tooltip for clipped values.
- Clear button at the trailing end for search/URL-like fields. Leading icon indicates purpose, trailing offers extras.
- Combine with a datalist/combo box when typed value plus suggestions fit.

## Text views → `<textarea>` / `contenteditable` ([HIG](https://developer.apple.com/design/human-interface-guidelines/text-views))
- Multi-line, any height, scrolls on overflow; leading alignment, primary text color. Long, editable or formatted text.
- Keep it legible: `rem` sizes, supports 200% text size and bold-text preferences.
- Make useful read-only text selectable and copyable.
- Match the keyboard to content (`inputmode`).
- Rich text editor: keep native undo/redo, spellcheck and standard shortcuts working.

## Combo boxes → `<input list>` + `<datalist>`, or an ARIA combobox ([HIG](https://developer.apple.com/design/human-interface-guidelines/combo-boxes))
- Text field plus list: type a custom value or pick a predefined one; custom entries don't get added to the list.
- Default: a meaningful list item hinting at the hidden choices (empty is fine). Intro label signals item types. Offer likely choices; list items no wider than the field.
- Pick one: native `<input list>` + `<datalist>` (no ARIA), or a full ARIA combobox (`role="combobox"` input, DOM `role="listbox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`). Never mix: `aria-activedescendant` can't point at `<datalist>` options.

## Pickers → `<select>`, `<input type="date|time">` ([HIG](https://developer.apple.com/design/human-interface-guidelines/pickers))
- Medium-to-long lists of distinct values; short lists: radios or a menu; huge sets: searchable list/table.
- Predictable, logically ordered values (alphabetical countries). Show the picker in context near the field (popover), not a view switch.
- Date/time: native `type="date"`/`time` or a calendar popover; time minutes default to 60 values (0-59); a coarser interval must divide evenly into 60 (e.g. 0/15/30/45). Compact inline field plus popup when space is tight; allow keyboard entry too.
- Countdown-style durations: hours and minutes, max 23 h 59 min.
- Locale controls value format and order.

## Sliders → `<input type="range">` ([HIG](https://developer.apple.com/design/human-interface-guidelines/sliders))
- Track plus thumb between a min and max; filled portion from min to thumb. Optional icons at the ends show meaning.
- Min at the inline-start (RTL aware), max at inline-end; vertical: min at bottom, max at top.
- Pair with a text input (exact value) and/or a stepper for wide ranges. Optional tick marks and min/max labels (not every tick); show value on hover/drag; live feedback as it changes.
- Native range input: keep arrow/PageUp/Home/End keys; `aria-valuetext` for units. Don't use a slider for media volume without a mute control and output context; use the player's volume UI.
- Circular slider only for repeating/unbounded values (rotation).

## Steppers → `<input type="number">` / +/- buttons ([HIG](https://developer.apple.com/design/human-interface-guidelines/steppers))
- Increment/decrement pair that shows no value itself; sits beside a field showing it. Make the affected value obvious.
- With a text field when large changes are likely; alone for small changes. Shift-click (or hold) for bigger steps, e.g. 10x.
- `aria-label` each button ("Increase quantity"); the field stays editable.

## Color wells → `<input type="color">` ([HIG](https://developer.apple.com/design/human-interface-guidelines/color-wells))
- A control that sets the color of an element and opens a picker. Prefer the native picker (familiar, consistent); custom pickers must be keyboard-operable and expose a hex/text input.
- Label it with the property it changes; show the current color with a non-color cue (hex text).

## Image wells (dropzones) → `<input type="file" accept="image/*">` + drop target ([HIG](https://developer.apple.com/design/human-interface-guidelines/image-wells))
- Editable image slot: drop, paste or choose a file; selected well supports copy, paste, delete (Delete/Backspace clears).
- A required image reverts to the default image when cleared.
- Dropzone must also work by keyboard and click (button opens file picker); announce result in a live region.

## Virtual keyboards → `inputmode`, `enterkeyhint`, `autocomplete` ([HIG](https://developer.apple.com/design/human-interface-guidelines/virtual-keyboards))
- Match the keyboard to content: `type="email"`, `type="tel"`, `type="url"`, `inputmode="numeric"` (PIN, digits), `inputmode="decimal"`, `inputmode="search"`; meaning also helps autocorrect.
- Set the Return key label to the action: `enterkeyhint="search|go|next|send|done"`.
- `autocomplete` tokens (`email`, `given-name`, `tel`, `street-address`, `one-time-code`, `current-password`, `new-password`) so the system fills data.
- Don't let the keyboard cover the focused field or primary button: scroll into view, use `visualViewport`, `interactive-widget` viewport option, `scroll-padding`.
- Custom in-page input widgets (a numeric pad) must make sense; people must see the benefit over the system keyboard. Controls above the keyboard stay relevant to the task.
- Voice/dictation and paste must keep working.

## Progress indicators → `<progress>` / `role="progressbar"` ([HIG](https://developer.apple.com/design/human-interface-guidelines/progress-indicators))
- Show the app isn't stalled; visible only while the operation runs.
- Determinate (bar fills inline-start to end, `value`/`max`) when duration is known; indeterminate spinner otherwise. Prefer determinate (lets people decide to wait or abandon).
- Pace honestly (not 90 percent in 5 seconds then 5 minutes for the rest). Keep it moving; on a stall explain and offer a way out.
- Switch indeterminate → determinate when the duration becomes known. **Never** switch a circular indicator to a bar mid-task.
- Description accurate and specific; not "Loading"/"Authenticating". Consistent location. `aria-valuenow`/`aria-valuetext`; spinners use `role="status"` with text.
- Allow cancel when feasible; if interruption has side effects, also offer Pause; if cancelling loses progress, confirm.
- Pull-to-refresh: still refresh content automatically; title adds info (last updated), never instructions.
- Spinners for background work or tight spaces (inside a field, beside a button); don't label a spinner that follows a user action.

## Gauges → `<meter>` ([HIG](https://developer.apple.com/design/human-interface-guidelines/gauges))
- A value within a range, optionally with range context. `<meter min max low high optimum value>` with a visible label.
- Succinct labels for the current value and both ends; screen readers read what is visible.
- Linear or circular; capacity style fills up to the value. Continuous fill for large ranges; discrete segments each fill fully, never partially.
- Change color at significant levels (very low/high, past middle) plus a text or icon cue; never color alone. Gradients can convey purpose (cold-to-hot).

## Rating indicators → icon row, `role="img"` or radio group ([HIG](https://developer.apple.com/design/human-interface-guidelines/rating-indicators))
- Row of symbols (stars) ranking an item; whole symbols only, constant spacing, no scaling with width.
- Make changing a rating easy, inline in the list (radio group with arrow keys, `aria-label="3 of 5 stars"`).
- Custom symbols only when the meaning is still clear (star is the recognized rating symbol).

## Charts → SVG/canvas + text alternative ([HIG](https://developer.apple.com/design/human-interface-guidelines/charts))
- A chart highlights few key points; for raw data with no analysis goal give a table people can scan, search and sort.
- Pick the mark by message: bar = compare categories or sums over time; line = change over time; point = relation of two properties, outliers, clusters. Combine marks when clearer. Prefer common types; teach novel ones.
- Axes: fixed range when min/max are meaningful, dynamic when values vary widely. Bars usually start at zero; skip zero when it hides meaningful difference. Familiar tick sequences (0, 5, 10); fewer/lighter grid lines when points are inspectable.
- Data most prominent, axes and descriptions support. Titles/subtitles state the main message in plain language; units in the title on compact layouts.
- **Must** be accessible: text summary (chart type, axes, bounds, key takeaway), data table or per-mark labels, keyboard navigation along the logical axis, `role="img"` + `aria-label` for static charts; arrow-key focus stops per mark for interactive ones.
- Label rules: context first (date/place) then value; no subjective words ("rapidly"); unambiguous formats ("June 6" not "6/6", "60 minutes" not "60m"); describe what data is, not how it looks (no color names). Hide decorative tick text from AT.
- **Never** require interaction to reveal critical data; tooltips/scrub are extras. Expand hit targets to the whole plot area; allow scrubbing and keyboard stepping.
- **Never** rely on color alone: add shape/pattern/direct labels. Visible gaps between adjacent areas (stacked segments).
- Make changes noticeable without animation only (live region message), honoring reduced motion.
- Align with the surrounding layout (flush leading edge, labels on the trailing side).
- Same dataset in several charts: same type, colors, marks and annotations. See patterns-web.md Charting data.

## Image views → `<img>` / `<picture>` ([HIG](https://developer.apple.com/design/human-interface-guidelines/image-views))
- Display images with `alt` (empty `alt=""` for decorative). An interactive image is a `<button>` or link wrapping the image.
- Icons: use an icon set (inline SVG), not bitmaps.
- Text over images needs strong contrast: scrim/background layer.
- Set `width`/`height` or `aspect-ratio` to avoid layout shift; serve sizes matching the display size.

## Activity views → Web Share API ([HIG](https://developer.apple.com/design/human-interface-guidelines/activity-views))
- Open the system share UI from a Share button only (`navigator.share()` on user gesture); feature-detect with `navigator.canShare`; fall back to Copy link.
- Never duplicate common system actions (Print, Copy) with your own; give similar custom actions a distinct title ("Print Transaction").
- Custom action titles: succinct verb or short verb phrase, no company or product name.
- Keep the flow minimal (ideally one step). Lengthy work continues in the background with status in the main UI; notify only for problems, not plain completion.

## The menu bar → `role="menubar"` (desktop-class editor apps only) ([HIG](https://developer.apple.com/design/human-interface-guidelines/the-menu-bar))
- Only for desktop-class document/editor web apps. Everything else: toolbar + menus per Menus. Never reproduce the OS menu bar's chrome.
- Order: App name, File, Edit, Format, View, app-specific, Window, Help. Support the default menus and order.
- Always show the same items; disable instead of hiding when not actionable. Standard shortcuts on standard items; custom ones only when needed. One-word titles preferred.
- File: New (name the item type), Open (… if a picker is needed), Open Recent (most recent first, clear item), Close, Save (autosave, per SKILL.md), Duplicate (prefer to Save As/Export/Copy To), Rename…, Move To…, Export As… (formats the app doesn't normally handle), Print….
- Edit: Undo/Redo (name the target: "Undo Typing"), Cut, Copy, Paste, Paste and Match Style, Delete ("Delete", not Erase/Clear), Select All, Find submenu. Format: Font, Text. View: Show/Hide Toolbar, Sidebar, Full Screen (labels reflect state; provide View menu even if short).
- App-specific menus between View and Window; list every command even if available elsewhere (discoverability, shortcuts, keyboard users); order from most to least general.
- Dynamic (modifier-changed) items: never the only route; single modifier.
- **Must** make every function reachable without the menu bar (it may be hidden/unfamiliar). Every toolbar item also exists as a menu command when a menu bar is offered.
- Keyboard: `Alt`/`F10` focus, arrows, Esc.

## Keyboard shortcuts on the web
- Keyboard support is a baseline: every control reachable and operable by keyboard (see a11y.md). Respect standard shortcuts; use a custom shortcut for a unique frequent action rather than repurposing a standard one. Repurpose only when the standard action makes no sense in the app.
- Use shortcuts only for frequent app-specific commands; too many are hard to learn. Shortcuts are an accelerator, never the only route.
- Modifier use: Cmd (macOS) / Ctrl (elsewhere) = main modifier; Shift = secondary, complementing a related shortcut; Alt/Option = sparingly for power commands; avoid Control on macOS (system-wide use). Detect platform for labels; don't hardcode ⌘.
- **Must** write multiple modifiers in this order: Control, Option, Shift, Command (⌃⌥⇧⌘; on Windows/Linux Ctrl, Alt, Shift).
- **Never** add Shift to a shortcut that uses the upper character of a two-character key (Help is ⌘?, not ⇧⌘/).
- **Never** derive a shortcut by adding a modifier to an existing one for an unrelated command.
- Don't use extra modifiers with characters missing on some layouts; if a non-Command modifier is needed, use it only with letters. Use `event.key` for characters and `event.code` for physical positions; support RTL and non-US layouts.
- Never take browser-reserved shortcuts (new/close tab, address bar, reload, find in page, history, print by default, zoom). Don't `preventDefault` them; that includes Ctrl+Tab, Cmd/Ctrl+-/= (zoom, WCAG 1.4.4), Cmd/Ctrl+G/Shift+G (find next) and Cmd/Ctrl+J (downloads), unless scoped to a focused canvas or editor surface. Prefer Cmd/Ctrl+K style or single keys only when the focus is not in an input.
- HIG standard shortcuts usually safe in a web editor/app (when focus is in your UI, not a text field you didn't build): Cmd/Ctrl+Z Undo, Shift+Cmd/Ctrl+Z Redo (Ctrl+Y on Windows), X/C/V cut/copy/paste, A select all, Shift+A deselect, B/I/U toggle bold/italic/underline in rich text, S save (only if you override page save; autosave first), E use selection for find, ⌘? help, Esc cancel, Cmd+. cancel, Shift+Tab reverse focus, bracket keys for align left/right, ⌘, settings (but browsers on macOS use it for their own settings: expose a menu item too and don't rely on it).
- Browsers reserve or conflict with: T, W, N, R, L, Q, P, F, H, M (Cmd/Ctrl) and F5/F11; skip those or require a non-conflicting scope (e.g. inside a custom canvas editor).
- Discoverability: show the shortcut next to the menu/toolbar item and in tooltips; provide a "Keyboard shortcuts" help dialog (often `?`); single-key shortcuts must be remappable or disableable (WCAG 2.1.4) and only active when focus is not in a text input.
- Keyboard users: Tab order follows reading order; arrow keys inside composite widgets; Control-style arrow moves focus between cells in grids; don't add your own navigation for standard controls (buttons, switches) beyond ARIA patterns.
- Focus: never move focus without user action except when the focused item disappears (then move to a neighbor). Use `:focus-visible` rings; focus rings for fields, full-row highlight for list items, ring/halo for cell-filling items. Focus groups (sidebar, list, grid) are entered by Tab and navigated with arrows.

## Pointer and touch
- Hover is an enhancement; never the only way to reveal an action or info (touch has no hover). Use `@media (hover: hover) and (pointer: fine)` for hover-only styling.
- Hover effects: subtle, consistent; scale only where it won't crowd neighbors (not table rows; use tint); **never** add a shadow without scale; no gratuitous effects.
- Use standard cursors: `pointer` for links/clickable content, `text` over text, `grab`/`grabbing` for draggable content, `not-allowed` for an invalid drop, `crosshair` for precise selection, `copy` for copy drops, resize cursors on resizers, `context-menu` when Ctrl-click opens one. Don't set `pointer` on non-interactive elements. Never show instructional text beside the pointer.
- Hit regions: 44x44 px minimum on touch; about 12 px padding around bordered controls and about 24 px around borderless ones on pointer UIs (too small needs precision, too large is hard to leave). Adjacent custom buttons share contiguous hit regions so the pointer shape doesn't flicker between them.
- Pointer and touch give the same result for the same interaction (modifier + click = same as touch equivalent). Differentiate only for value (a scrubber: drag both; click also seeks precisely).
- Standard gestures: tap = activate/select; swipe = scroll, reveal actions, dismiss; drag = move; touch and hold = more controls (a context menu); double tap = zoom; pinch = zoom; two-finger rotate = rotate. Use them with their standard meaning; never invent a custom gesture for a standard action or give a familiar gesture a unique meaning.
- Respond immediately with feedback predicting the result; show unavailable gestures clearly (don't look frozen).
- Custom gestures only for specialized frequent tasks (drawing, maps); discoverable, distinct, and **never** the only way: always a visible button or keyboard path. Shortcut gestures supplement standard ones (keep the Back button beside edge-swipe).
- **Never** hijack the browser back/forward swipe, edge swipes, pull-to-refresh or pinch-zoom: avoid `touch-action`/`overscroll-behavior` tricks that break them; keep browser Back working with real history entries (`history.pushState` for views/modals).
- Don't redefine system-wide trackpad gestures. Support secondary click, Ctrl-click, scroll, pinch zoom as expected.
- Multi-selection by pointer: click-drag rectangle (band selection) in grids; Shift/Cmd/Ctrl-click ranges and toggles.
- Auto-minimizing controls (video controls, sticky toolbars) reveal on hover or focus and hide again.
- Tooltips: see patterns-web.md Offering help. Motion sensors (gyroscope/accelerometer) only for a tangible benefit, never for UI manipulation outside active play; request with a purpose explanation.
