# Components: Navigation and Search

last-checked: 2026-10-25
scope: Apple HIG navigation/search components (path controls, search fields, sidebars, tab bars, token fields) for iOS, iPadOS, macOS.

## Path controls ([HIG](https://developer.apple.com/design/human-interface-guidelines/path-controls))
- macOS only. Shows file system path of selected file/folder (Finder: View > Show Path Bar).
- Standard style: linear list of root disk, parent folders, selected item, each with icon and name; long paths hide names between first and last. Editable: drag item onto control to select and show its path.
- Pop up style: like pop-up button, shows icon/name of selected item; menu lists root disk, parents, item. Editable adds a Choose command; drag also works.
- Put path control in the window body, not window frame; never in toolbar/status bar (Finder: bottom of window body).
- `NSPathControl`.

## Search fields ([HIG](https://developer.apple.com/design/human-interface-guidelines/search-fields))
- Editable text field with Search icon, Clear button, placeholder; supports scope bars and tokens.
- Placeholder text states what can be searched.
- Search as the user types when possible (continuously refined results).
- Consider suggestions: recent searches before typing, predictive suggestions while typing.
- Simplify results: most relevant first; consider categorizing.
- Consider filtering results (scope bar in results area).
- Scope bar: filter among clearly defined categories, broad to narrow (Mail iPhone: all mailboxes -> current mailbox). Default to broader scope; let people narrow.
- Tokens: visual encapsulation of a search term, selectable/editable as one item, filters further terms (filter by contact in Mail, photos in Messages). Use for common terms/items. Pair with suggestions so people discover available tokens. macOS counterpart: token fields.
- iOS: three entry points: tab in tab bar, toolbar (bottom/top), inline with content. Choose by layout/content/navigation.
- iOS search as tab: always visible while switching sections. Two styles:
  - Standard tab: uniform with other tabs; opens a search landing page with field at top. Choose to offer suggestions, discovery, exploration (rich content, e.g. Apple TV genres).
  - Button appearance: separate button; focuses field and shows keyboard immediately; returns to prior tab on exit. Choose for quick, transient search.
- iOS search in toolbar: bottom toolbar as expanded field or toolbar button (animates into field above keyboard); top toolbar (navigation bar) as button (animates into field above keyboard, or at top if no room at bottom).
- Place search at bottom if room (own toolbar or added to existing; best when search is a priority: Settings, Mail, Notes). Place at top when covering bottom content would interfere with primary function or no bottom toolbar (Wallet passes stack).
- iOS inline field: when adjacency to searched content clarifies scope (several search fields, location matters; Music library filter). At top: above the list it searches; consider pinning to top toolbar on scroll.
- iPadOS, macOS: similar placement; keep search consistent across iPad and Mac versions.
- Trailing side of toolbar for common cases (split-view apps searching across columns: Mail, Notes, Voice Memos; results shown in detail, e.g. Freeform filtering boards). Lets people navigate results while selection stays visible.
- Top of sidebar when filtering sidebar content/navigation (Settings); good with rich detail view and clear separation from sidebar.
- As item in sidebar or tab bar for a dedicated discovery area (rich suggestions, categories; Music, TV). Always available across sections.
- Dedicated-area field: focus immediately on arrival. Exception: iPad with only virtual keyboard, leave unfocused so keyboard doesn't cover view.
- Account for window resizing: iPad field resizes fluidly; in compact views keep search contextually useful (Notes, Mail place it above the content list column).
- Other platforms: out of scope.

## Sidebars ([HIG](https://developer.apple.com/design/human-interface-guidelines/sidebars))
- Leading-side navigation between app areas or top-level collections (folders, playlists). Needs lots of space; tab bar is more compact; for many apps use adaptable tab bar that converts to sidebar.
- Liquid Glass: sidebars float above content in iOS, iPadOS, macOS. Extend visually rich content beneath it (horizontal scroll or background extension effect that mirrors/blurs adjacent content under it; `backgroundExtensionEffect()`); don't stop an image abruptly at sidebar edge.
- Let people customize sidebar contents/order when possible.
- Use disclosure controls to group hierarchy in content-heavy apps.
- Prefer familiar SF Symbols; custom icon: custom symbol rather than bitmap.
- Let people hide the sidebar via platform-native interactions (iPadOS edge swipe; macOS show/hide button or Show Sidebar/Hide Sidebar in View menu). **Never** hide by default (discoverability).
- Max two hierarchy levels; deeper: split view with content list between sidebar and detail. Two levels: succinct group titles, no unnecessary words.
- Sidebar icon colors must serve a purpose. Default: app accent color. macOS: people set a system accent color and expect sidebar icons to follow it; fixed colors only sparingly for meaning/emphasis (Mail VIP yellow).
- iOS, iPadOS: `sidebarAdaptable` tab view style: choose sidebar or tab bar at launch; button toggles; adapts to platform, rotation, window width. Sidebar only: `NavigationSplitView` in primary pane or `UISplitViewController`.
- iOS, iPadOS: consider tab bar first (more content space); adaptable sidebar form exposes extra less-used areas.
- Without SwiftUI: `UICollectionLayoutListConfiguration.Appearance.sidebar`.
- macOS: row height, text, glyph size depend on sidebar size (small, medium, large); set programmatically, people can change in General settings.
- macOS: consider auto-hide/reveal on window resize (Mail viewer collapses sidebar when small).
- macOS: **never** put critical info/actions at sidebar bottom (windows often moved so bottom edge is hidden).
- Other platforms: out of scope.

## Tab bars ([HIG](https://developer.apple.com/design/human-interface-guidelines/tab-bars))
- Navigate top-level sections; preserves navigation state per section.
- Navigation only, not actions (actions: toolbar).
- Keep tab bar visible when navigating between sections (hidden bar loses orientation); exception: modal covering it.
- Use appropriate number of tabs; fewer is easier. For complex structure consider sidebar or tab bar that adapts to sidebar.
- Avoid overflow: when width limits visible tabs, trailing tab becomes More (iOS/iPadOS) listing the rest; hard to notice/reach; limit occurrences.
- **Never** disable or hide tab bar buttons when content unavailable (looks unstable); explain why a section is empty.
- Tab labels: single words where possible; shown beneath (compact) or beside (regular) the icon.
- Prefer SF Symbols (adapt to regular/compact); prefer filled symbols/icons. Custom icons: dimensions in Apple Design Resources.
- Badge (red oval, white number or exclamation point) only for critical new/updated info; reserve to keep meaning.
- Liquid Glass: avoid tab label colors similar to content layer backgrounds; with colorful content use monochrome tab bar or an accent color with enough differentiation.
- iOS: tab bar floats above content at bottom on Liquid Glass background (content peeks through).
- iOS: with attached accessory (Music MiniPlayer) may minimize tab bar on scroll down and move accessory inline; exits by tapping a tab or scrolling to top. `TabBarMinimizeBehavior`, `UITabBarController.MinimizeBehavior`.
- iOS: tab bar can hold a dedicated search tab at trailing end (see search fields).
- iPadOS: tab bar near top of screen; fixed, or with button converting to sidebar (`tabBarOnly`, `sidebarAdaptable`). Sidebar without conversion: navigation split view.
- iPadOS: prefer tab bar for navigation; offer sidebar conversion for complex apps.
- iPadOS: let people customize tabs (add/remove favorites, e.g. Music playlist); default list of five or fewer for continuity between compact and regular sizes. `TabViewCustomization`, `UITab.Placement`.
- macOS: no additional considerations (tab-based windows: see menu bar).
- Other platforms: out of scope.

## Token fields ([HIG](https://developer.apple.com/design/human-interface-guidelines/token-fields))
- macOS only. Text field converting text to tokens that can be selected, dragged to reorder or move between fields (Mail address fields); optional suggestion list; per-token context menu (edit, VIP, contact card).
- Tokens can also represent search terms (see search fields).
- Add value with a context menu per token (info/edit options).
- Consider extra token-creating triggers; default is typing a comma; add e.g. Return.
- Consider customizing suggestion delay; default is immediate, which can distract while typing.
- `NSTokenField`.
