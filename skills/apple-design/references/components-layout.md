# Components: Layout and Organization

last-checked: 2026-10-25
scope: Apple HIG layout/organization components (boxes, collections, column views, disclosure controls, labels, lists and tables, outline views, split views, tab views) for iOS, iPadOS, macOS.

## Boxes ([HIG](https://developer.apple.com/design/human-interface-guidelines/boxes))
- Box groups related content with visible border or background; may have a title.
- Keep box small relative to its container; near-full-size box loses separation and crowds content.
- Use padding and alignment for sub-grouping inside a box; avoid nested boxes (busy, constrained).
- Title: only if it clarifies contents; brief phrase; sentence-style capitalization; no ending punctuation, except in a settings pane where a colon is appended. Title also helps VoiceOver predict contents.
- iOS, iPadOS: default secondary and tertiary background colors.
- macOS: title displays above box by default.
- Other platforms: out of scope.

## Collections ([HIG](https://developer.apple.com/design/human-interface-guidelines/collections))
- Collection: ordered content in customizable, visual layout; best for image-based content.
- Use standard row or grid layout; avoid custom layouts that confuse.
- Text content: prefer a table/list.
- Make items easy to choose: adequate padding around images so focus/hover effects are visible and content doesn't overlap.
- Defaults: tap select, touch-and-hold edit, swipe scroll. Add custom gestures only if needed.
- Animate insert, delete, reorder (standard or custom) as feedback.
- iOS, iPadOS: be careful with dynamic layout changes; keep them understandable and trackable; avoid changing layout during interaction unless from explicit action.
- macOS: no additional considerations.
- Other platforms: out of scope.

## Column views ([HIG](https://developer.apple.com/design/human-interface-guidelines/column-views))
- macOS only (not iOS/iPadOS). Column view (browser): hierarchy as vertical columns, one per level; parent items marked with triangle; selecting parent shows children in next column.
- Use for deep hierarchies with frequent back/forth navigation when sorting isn't needed (Finder column view). For iPadOS hierarchy use split view.
- Show root level in first column.
- Show info about selected leaf item (preview, creation/modification date, type, size).
- Let people resize columns (long names).
- `NSBrowser`.

## Disclosure controls ([HIG](https://developer.apple.com/design/human-interface-guidelines/disclosure-controls))
- Hide details until relevant. Put most-used controls at top of hierarchy, always visible; advanced stuff hidden by default.
- Disclosure triangle: shows/hides info for a view or list items (Finder hierarchy, Keynote export advanced options). Points inward from leading edge when collapsed, down when expanded; click/tap toggles; view resizes to fit.
- Give disclosure triangle a descriptive label naming what is hidden ("Advanced Options").
- Disclosure button: shows/hides functionality tied to one control (macOS Save sheet, next to Save As field). Points down when collapsed, up when expanded; view expands/collapses.
- Place disclosure button near the content it reveals; clear relationship.
- Max one disclosure button per view.
- macOS: `NSButton.BezelStyle.disclosure` (triangle), `.pushDisclosure` (button).
- iOS, iPadOS: use SwiftUI `DisclosureGroup`.
- Other platforms: out of scope.

## Labels ([HIG](https://developer.apple.com/design/human-interface-guidelines/labels))
- Label: static, uneditable, copyable text (in buttons, menu items, list items, views). Small text only: editable small -> text field; large -> text view.
- Prefer system fonts; Dynamic Type supported by default; keep custom/styled text legible.
- Use the four system label colors for importance:

| Level | Use | iOS/iPadOS | macOS |
|---|---|---|---|
| Label | primary info | `label` | `labelColor` |
| Secondary | subheading, supplemental | `secondaryLabel` | `secondaryLabelColor` |
| Tertiary | unavailable item/behavior | `tertiaryLabel` | `tertiaryLabelColor` |
| Quaternary | watermark | `quaternaryLabel` | `quaternaryLabelColor` |

- Make useful text selectable (error message, location, IP address).
- iOS, iPadOS: no additional considerations. macOS: uneditable label = `NSTextField` with `isEditable` off.
- Other platforms: out of scope.

## Lists and tables ([HIG](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables))
- Rows in one or more columns; support grouping, hierarchy, select, add, delete, reorder. Multicolumn sortable tables for complex data.
- Prefer text in lists/tables (scannable). Widely varying sizes or many images: use a collection.
- Allow editing when sensible; reordering is valued even without add/remove. iOS/iPadOS: must enter edit mode before selecting items.
- Selection feedback: navigation hierarchy table persistently highlights selected row; options list highlights briefly then shows a checkmark.
- Keep item text succinct (less truncation/wrapping). For large text per item, list titles and show content in detail view.
- Preserve readability when clipped: middle ellipsis keeps beginning and end.
- Multicolumn: descriptive headings, nouns/short noun phrases, title-style capitalization, no ending punctuation. Single-column without heading: add label or header for context.
- Style: match data and platform. iOS/iPadOS grouped style uses headers, footers, extra space; macOS bordered style uses alternating row backgrounds. See `ListStyle`.
- Row style fits content (small leading image plus label). `UIListContentConfiguration` lays out rows/headers/footers on iOS/iPadOS.
- iOS, iPadOS: info button (detail disclosure button in rows) only reveals more info about row content; **never** for hierarchy navigation; use disclosure indicator accessory (`UITableViewCell.AccessoryType.disclosureIndicator`) to drill in.
- iOS, iPadOS: avoid an index (alphabet strip at trailing side) in tables with trailing-edge controls such as disclosure indicators; they conflict.
- macOS: let people click column heading to sort; clicking sorted column reverses direction.
- macOS: let people resize columns.
- macOS: consider alternating row colors in multicolumn tables.
- macOS: hierarchical data -> outline view, not table.
- Other platforms: out of scope.

## Outline views ([HIG](https://developer.apple.com/design/human-interface-guidelines/outline-views))
- macOS only. Hierarchical data in scrolling rows/columns; parents have disclosure triangles. Extra columns show attributes (size, date). Good for text; often in leading pane of a split view.
- Non-hierarchical data: use table instead.
- Expose hierarchy in first column only.
- Column headings: descriptive nouns/short noun phrases, title-style capitalization, no punctuation (no trailing colon). Always in multi-column outline views; single-column without heading needs a label or other context.
- Consider click-to-sort headings (asc/desc). Secondary-column sorting may be implemented behind the scenes. Clicking primary heading sorts at each hierarchy level; clicking sorted heading reverses.
- Let people resize columns.
- Easy expand/collapse: click triangle expands that item; Option-click expands all subfolders.
- Retain expansion state across sessions.
- Consider alternating row colors in multi-column outline views.
- Editing: single-click a cell to edit; double-click can do something else (open file). Optionally allow reorder, add, remove rows.
- Truncate cell text with centered ellipsis rather than clipping.
- Consider a search field in the toolbar for lengthy outlines.
- `OutlineGroup` (SwiftUI), `NSOutlineView`.

## Split views ([HIG](https://developer.apple.com/design/human-interface-guidelines/split-views))
- Adjacent panes (tables, collections, images, custom). Typical: show multiple hierarchy levels; selecting in primary pane shows contents in secondary; optional tertiary pane. Commonly with a sidebar for navigation. Rarely for supplementary functionality (Keynote navigator, notes, inspector around canvas).
- Persistently highlight current selection in each pane leading to the detail view.
- Consider drag and drop between panes.
- iOS: prefer split view in regular, not compact, size class (iPhone portrait too narrow).
- iPadOS: two vertical panes (Mail) or three (Keynote). Windows resize fluidly: design for narrow, compact, intermediate widths; ensure logical navigation between panes. `NavigationSplitView`, `UISplitViewController`.
- macOS: panes arranged vertically, horizontally, or both; dividers drag to resize (`VSplitView`, `HSplitView`).
- macOS: set reasonable min/max pane sizes so the divider stays visible and usable.
- macOS: let people hide a pane when sensible (Keynote hides navigator/notes while editing).
- macOS: provide multiple ways to reveal hidden panes (toolbar button, menu command with keyboard shortcut).
- macOS: prefer thin divider (1 pt); use thicker only with specific need (e.g. strong linear elements on both sides make thin one hard to see). `NSSplitView.DividerStyle`.
- Other platforms: out of scope.

## Tab views ([HIG](https://developer.apple.com/design/human-interface-guidelines/tab-views))
- macOS only (tabbed control on top edge of content area). Mutually exclusive panes in same area.
- Use for closely related content; each pane self-contained, controls affect only that pane.
- Label each tab with what pane contains: nouns/short noun phrases (verb OK sometimes), title-style capitalization.
- Avoid pop-up button to switch tabs (two clicks, hidden choices); acceptable if too many panes for tabs.
- Avoid more than 6 tabs; otherwise use another approach (e.g. view options in pop-up button menu).
- Tabbed control can be hidden for programmatic switching; then content area can be borderless (solid or transparent), bezeled, or line-bordered.
- Inset the tab view with window-body margin on all sides (room for unrelated controls); edge-to-edge is unusual.
- `NSTabView`.
- iOS, iPadOS: not supported; consider a segmented control for similar function (for app-level tabs see Tab bars).
- Other platforms: out of scope.
