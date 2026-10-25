# Components: Menus, Buttons and Toolbars

last-checked: 2026-10-25
scope: Apple HIG menu, button, action and toolbar components (activity views, buttons, menus, menu bar, toolbars) for iOS, iPadOS, macOS.

## Activity views ([HIG](https://developer.apple.com/design/human-interface-guidelines/activity-views))
- iOS, iPadOS only (share sheet; sheet or popover by device/orientation). macOS has none, but supports share/action extensions.
- App-specific activities listed before system-wide ones; people can edit the list.
- **Never** duplicate common system actions (Print, Copy). For similar custom functionality, give a distinct title ("Print Transaction").
- Prefer a symbol for custom activity. Custom interface icon: centered in about 70x70 px area.
- Custom action title: succinct, single verb or short verb phrase; no company/product name (wraps/truncates when long). Share activity title (typically company name) shows under its icon.
- Exclude inapplicable system activities (can't reorder them); choose which custom tasks show per context.
- Open activity view with the Share button only; no alternative route to same thing.
- Share extensions: share from current context to apps/services. Action extensions: content-specific tasks (bookmark, copy link, edit inline image, translate selection) without leaving context.
- iOS/iPadOS: extensions appear in share sheet. macOS: Share button in toolbar or Share in context menu; action extensions via pointer hover over embedded content, toolbar button, or Finder quick action.
- Share extension: prefer system composition view. Action extension: include app name; any custom UI should echo app UI so the relation is clear.
- Keep extension interaction minimal (a few steps; ideally one tap/click).
- Avoid modal views above an extension (an alert is acceptable if needed); system already presents extension modally.
- Share extension uses app icon automatically. Action extension: use symbol or interface icon that identifies the task.
- Activity view dismisses on task completion: continue lengthy work in background, show status in main app. Notify for problems, not for plain completion.
- macOS: not supported (activity view).
- Other platforms: out of scope.

## Buttons ([HIG](https://developer.apple.com/design/human-interface-guidelines/buttons))
- Button = instantaneous action. Combines style (size/color/shape), content (symbol/icon, text, or both), role.
- **Must** give hit region at least 44x44 pt (any input: finger, pointer).
- Leave enough space around buttons to tell them apart and activate them.
- **Must** include a press state for custom buttons.
- Prominent style for most likely action in a view (system applies accent color to background). Keep to one or two prominent buttons per view.
- Distinguish preferred option by style, not size; same-size buttons signal a coherent set; different sizes look inconsistent. Prominent style for preferred, less prominent for the rest.
- Liquid Glass: avoid similar color for button labels and content layer backgrounds; if content is bright/colorful, keep default monochromatic button labels.
- Content: each button clearly communicates purpose. macOS shows tooltip on hover (brief phrase; see offering help).
- Use familiar icons for familiar actions (`square.and.arrow.up` = share); prefer SF Symbols (standard icons list).
- Text when short label is clearer than icon: few words, title-style capitalization, start with verb ("Add to Cart").
- Roles: normal (none), primary (default button), cancel, destructive. Primary uses accent color; destructive uses system red.
- Assign primary role to most likely choice; responds to Return; in sheet/editable view/alert, Return closes view automatically.
- **Never** assign primary role to a destructive action, even if most likely (people choose prominent button without reading).
- iOS, iPadOS: configure button to show activity indicator for non-instant actions; can change label ("Checkout" -> "Checking out…"); indicator replaces button image, sits next to label.
- macOS push button: standard type; text, symbol, icon, image or combo; can be default button; tintable.
- macOS flexible-height push button only for tall/variable content (two-line text, tall icon); same corner radius/padding. `NSButton.BezelStyle.flexiblePush`.
- macOS push button that opens another window/view/app: trailing ellipsis in title.
- macOS: consider spring loading (force click while dragging items over button, Magic Trackpad).
- macOS square (gradient) button: action related to a view (add/remove table rows); symbol or icon, no text; can act as push, toggle, pop-up; placed in/beneath its view.
- Square buttons in a view, not window frame; never in toolbar/status bar (use toolbar item). Prefer symbol. No introductory label. `NSButton.BezelStyle.smallSquare`.
- macOS help button: circular, question mark, in a view; opens app help. Use system one. Open topic for current context, else top of help. Max one per window. No introductory text. In a view, not toolbar/status bar.
- Help button placement: dialog with dismissal buttons (OK/Cancel): lower corner opposite dismissal buttons, vertically aligned with them. Dialog without dismissal buttons: lower-left or lower-right. Settings window/pane: lower-left or lower-right.
- macOS image button: image/symbol/icon; behaves as push, toggle, or pop-up; in a view, not window frame (toolbar: use toolbar item). Add about 10 px padding between image and button edges (edges define click area). Avoid system border (`isBordered`). Label, if any, below the button.
- Other platforms: out of scope.

## Menus ([HIG](https://developer.apple.com/design/human-interface-guidelines/menus))
- Menu items: command, option, or state affecting current selection/context. Guidance applies to all menu types.
- Item label: clear, succinct. Action items use verb/verb phrase (View, Close, Select). Title-style capitalization (capitalize all but articles, coordinating conjunctions, short prepositions; last word always capitalized).
- Drop articles (a, an, the) from labels.
- Show unavailable items dimmed, non-responsive. If all items unavailable, menu itself stays openable.
- Append ellipsis (…) when action needs more input before completing.
- Show associated keyboard shortcut in app menus.
- Icons: use standard icons for common actions (Share, Print, Search). Use sparingly and with purpose: key actions/features, file locations, devices, visual concepts (rotate/flip), user content (folders/docs). Skip when no clear icon exists. Uniform treatment in a group: icons on all items or none.
- iOS/iPadOS/visionOS may show unlabeled symbol-only items (see layouts).
- Organization: important/frequent items first; group related items with separators; keep logically related commands in the same group even if importance differs (Paste and Match Style with Paste).
- Mind menu length; split into menus or use a submenu. Exception: user-defined/dynamic content (Safari History/Bookmarks) may be long and scroll.
- Submenus: chevron after label. Use sparingly; consider when a term repeats in more than two items in a group (Sort by -> Date/Score/Time; use repeated term in label). Single level only. More than about 5 items: make a new menu. Submenu item stays available even when nested items unavailable. Prefer submenu over indenting.
- Toggled items: one item with changeable label reflecting state (Show Map / Hide Map). Add verb if ambiguous (Turn HDR On). Show both items if seeing both helps. Checkmark for attributes in effect (Format > Font). Offer a clear-all item (Plain) when multiple toggled attributes.
- In-game menus: use platform's default navigation interaction; keep menus readable/openable on every platform; enlarge tap targets when scaled to small screens.
- iOS, iPadOS layouts (`preferredElementSize`): Small = row of four symbol-only items on top, rest in list. Medium = row of three with symbol above short label, rest in list. Large (default) = all items in list.
- Choose small/medium to streamline: medium for three important actions (Notes: Scan, Lock, Pin); small only for closely related groups (Bold, Italic, Underline, Strikethrough) with recognizable symbols.
- macOS: no additional considerations.
- Other platforms: out of scope.

## Context menus ([HIG](https://developer.apple.com/design/human-interface-guidelines/context-menus))
- Hidden by default; reveal by touch-and-hold (iOS, iPadOS), Control-click (macOS, iPadOS), or secondary click on trackpad (macOS, iPadOS).
- Prioritize relevance; no advanced/rarely used items. Keep item count small (long menus hard to scan/scroll).
- Support context menus consistently across the app.
- **Must** also expose every context menu item in main interface (iOS/iPadOS toolbar; macOS menu bar lists all commands).
- Submenus: one level only, intuitive title.
- Hide unavailable items, don't dim (macOS exception: Cut, Copy, Paste may appear unavailable).
- Put most frequent items where first seen (nearest to touch/pointer; may reverse order depending on whether menu opens above or below).
- Show keyboard shortcuts in main menus, not context menus.
- Separators: no more than about 3 groups.
- iOS, iPadOS: list destructive items (Delete, Remove) at the end, mark as destructive (red text).
- Title only when it clarifies the effect (e.g. count of selected messages). Item labels short, clear; see Menus.
- Use same icons as system for Copy, Share, Delete etc.
- iOS, iPadOS: context menu or edit menu per item, not both.
- iPadOS: consider context menu for creating a new object (Files: new folder via long press/secondary click in empty area).
- iOS, iPadOS: menu can show a preview; tap to open or drag. Prefer graphical preview that clarifies the target (condensed content). Ensure preview animates well: set clipping path to match shape (rounded corners) so contours don't change; `UIContextMenuInteractionDelegate`.
- macOS: also called contextual menu.
- Other platforms: out of scope.

## Dock menus ([HIG](https://developer.apple.com/design/human-interface-guidelines/dock-menus))
- macOS only. Secondary click on Dock icon: system plus custom items; system items vary by open state.
- Succinct labels, logical organization (see Menus).
- Also offer custom Dock items elsewhere (menu bar, UI).
- Prefer high-value custom items: list open/recent windows; actions useful when app isn't frontmost or has no windows (Mail: Get New Mail, Compose).
- `applicationDockMenu(_:)`. iOS/iPadOS equivalent: Home Screen quick actions.

## Edit menus ([HIG](https://developer.apple.com/design/human-interface-guidelines/edit-menus))
- Edit commands for selected content (text, images, files, objects): Copy, Select, Translate, Look Up. iOS/iPadOS/visionOS auto-detect data type (address adds Get directions).
- iOS: compact horizontal list on touch-and-hold or double-tap select; trailing chevron expands to context menu.
- iPadOS: touch -> compact horizontal; keyboard/pointer -> context-menu style (vertical).
- macOS: context menu while editing plus the Edit menu in menu bar.
- Prefer system edit menu (`UIResponderStandardEditActions`); no custom duplicate.
- Reveal via system interactions only (touch-and-hold, secondary click); no custom gesture.
- Show only relevant commands; remove or dim inapplicable (no Copy/Cut without selection; no Paste with nothing to paste).
- Custom commands: after relevant system ones (custom formatting after system format section); few.
- Let people select/copy noneditable content text (captions, statuses), not control labels.
- Support undo and redo (no confirmation in edit menu).
- Avoid redundant controls duplicating edit menu functions.
- Differentiate deletion commands: Delete = Delete key; Cut copies to pasteboard then deletes.
- Custom command labels: short verb/verb phrase.
- iOS, iPadOS: must work in both styles (compact horizontal, vertical). Adjust placement when needed (default above/below insertion point/selection; pointer fixed in shape, position movable so it doesn't cover key content). `UIEditMenuInteraction`.
- macOS: Edit menu order is in the menu bar section.
- Other platforms: out of scope.

## Home Screen quick actions ([HIG](https://developer.apple.com/design/human-interface-guidelines/home-screen-quick-actions))
- iOS, iPadOS only. Touch-and-hold app icon (3D Touch: press harder). System also adds Remove App and Edit Home Screen.
- Each action: title, interface icon (left/right depending on icon position), optional subtitle; text left-aligned in LTR languages. Can update dynamically.
- Create actions for high-value tasks; at least one expected; max 4 total.
- Dynamic changes must be predictable (location, recent activity, time of day, settings).
- Succinct title communicating the result ("Directions Home", "New Message"); optional subtitle for context (unread counts). No app name or extraneous info; short to avoid truncation; plan for localization.
- Familiar interface icon per action; prefer SF Symbols (standard icons). Custom icon: use Quick Action Icon Template from Apple Design Resources.
- **Never** use emoji instead of symbol/icon (full color vs monochrome that adapts in Dark Mode).

## Pop-up buttons ([HIG](https://developer.apple.com/design/human-interface-guidelines/pop-up-buttons))
- Menu of mutually exclusive options; menu closes after choice; button shows current selection.
- Use for a flat list of exclusive options/states. Use pull-down button instead for actions, multi-select, or submenus.
- Provide useful default selection (most likely choice).
- Make options predictable without opening: introductory label or button label describing effect.
- Good when space limited and not all options needed visible.
- Optional Custom item for occasional extras; explanatory text below list allowed.
- iPadOS: in popover/modal, consider pop-up button instead of disclosure indicator to choose among a small, well-defined set for a list item (no detail navigation).
- iOS, macOS: no additional considerations. APIs: `changesSelectionAsPrimaryAction` (UIKit), `NSPopUpButton`.
- Other platforms: out of scope.

## Pull-down buttons ([HIG](https://developer.apple.com/design/human-interface-guidelines/pull-down-buttons))
- Menu of items/actions tied to the button's purpose; menu closes then action runs.
- Use for commands directly related to button's action (Add -> item types; Sort -> attributes; Back -> pick a location). For exclusive non-command choices use pop-up button.
- Avoid putting all of a view's actions in one pull-down; primary actions must be discoverable.
- Menu length: at least 3 items (1-2: use buttons, toggles or switches); too many slows scanning.
- Menu title only if it adds meaning.
- Destructive items: red text; on choose, system shows action sheet (iOS) or popover (iPadOS) to confirm/cancel.
- Include interface icon after label when it adds value; prefer SF Symbols (alignment at every scale).
- iOS, iPadOS: can also open menu by gesture on a button (Safari Tabs touch-and-hold).
- iOS, iPadOS: consider a More pull-down button for items not needing prominence; weigh space saving against discoverability (ellipsis icon doesn't predict contents).
- macOS: no additional considerations. APIs: `showsMenuAsPrimaryAction` (UIKit), `pullsDown` (AppKit).
- Other platforms: out of scope.

## The menu bar ([HIG](https://developer.apple.com/design/human-interface-guidelines/the-menu-bar))
- macOS and iPadOS. iPad menu bar mirrors Mac order/items; shortcuts follow macOS patterns (see standard keyboard shortcuts). Menus share menu appearance/behavior; see Menus.
- Order: YourAppName, File, Edit, Format, View, app-specific menus, Window, Help. macOS adds Apple menu (leading) and menu bar extras (trailing).
- Support the default system menus and their order; system implements many standard items (Edit > Copy for text fields).
- **Always** show same set of items; disable instead of hiding when not actionable.
- Use same icons as system for common actions (Copy, Share, Delete).
- Support standard shortcuts for standard items (Copy, Cut, Paste, Save, Print); custom shortcuts only when necessary.
- Prefer short one-word menu titles; multi-word uses title-style capitalization.

### App menu
- App-wide items, not task/document/window. App name shown bold. Order:
  - About YourAppName: first, own group (separator after). Short name, 16 characters or fewer, no version number.
  - Settings…: app-level settings only (document-specific settings go in File). Opens Settings window, or app page in iPadOS Settings.
  - Optional app-specific items: after Settings, same group.
  - Services (macOS only): submenu.
  - Hide YourAppName (macOS only): same short name as About.
  - Hide Others (macOS only).
  - Show All (macOS only).
  - Quit YourAppName: same short name; Option changes to Quit and Keep Windows.

### File menu
- Document/file management; rename or remove if app has no files. Order:
  - New Item: name the item type (Calendar: Event, Calendar).
  - Open: ellipsis if separate selection UI is needed.
  - Open Recent: submenu, usually with Clear Menu; show recognizable names not paths; most recent first.
  - Close: closes window/doc; Option -> Close All; tab-based window uses Close Tab instead (consider adding Close Window).
  - Close Tab: Option -> Close Other Tabs.
  - Close File: closes file and all its windows; consider if multiple views of a file.
  - Save: autosave periodically; new document prompts name/location; multiple formats: pop-up in Save sheet.
  - Save All.
  - Duplicate: both stay open; Option -> Save As. Prefer over Save As/Export/Copy To/Save To (unclear relation to original).
  - Rename…
  - Move To…
  - Export As…: name, location, format; current doc stays open, exported file doesn't open. Reserve for formats app doesn't typically handle.
  - Revert To: with autosave, submenu of recent versions plus version browser; chosen version replaces current.
  - Page Setup…: document-specific print parameters only (paper size, orientation). Global (printer name) or frequent (copies) go in Print panel.
  - Print…: standard Print panel (printer, fax, PDF).

### Edit menu
- Changes to content plus Clipboard commands; useful even in non-document apps. Decide whether Find belongs in Edit (apps searching files/objects may put Find in File). Order:
  - Undo: name target (Undo Paste and Match Style, Undo Typing).
  - Redo: same naming (Redo Typing).
  - Cut: removes, stores on Clipboard.
  - Copy.
  - Paste: Clipboard unchanged, repeatable.
  - Paste and Match Style.
  - Delete: removes without Clipboard; same as Delete key; use "Delete", not Erase/Clear.
  - Select All.
  - Find: submenu Find, Find and Replace, Find Next, Find Previous, Use Selection for Find, Jump to Selection.
  - Spelling and Grammar: submenu Show Spelling and Grammar, Check Document Now, Check Spelling While Typing, Check Grammar With Spelling, Correct Spelling Automatically.
  - Substitutions: submenu Show Substitutions, Smart Copy/Paste, Smart Quotes, Smart Dashes, Smart Links, Data Detectors, Text Replacement.
  - Transformations: submenu Make Uppercase, Make Lowercase, Capitalize.
  - Speech: submenu Start Speaking, Stop Speaking.
  - Start Dictation: system adds at bottom.
  - Emoji & Symbols: system adds at bottom (Character Viewer).

### Format menu
- Text formatting; omit if no formatted text editing. Order:
  - Font: submenu Show Fonts, Bold, Italic, Underline, Bigger, Smaller, Show Colors, Copy Style, Paste Style.
  - Text: submenu Align Left, Align Center, Justify, Align Right, Writing Direction, Show Ruler, Copy Ruler, Paste Ruler.

### View menu
- Appearance of all windows, any type. Not for navigating/managing specific windows (Window menu).
- Provide View menu even with only some items (e.g. only Enter/Exit Full Screen).
- Show/hide item titles reflect current state (Show Toolbar vs Hide Toolbar). Order:
  - Show/Hide Tab Bar.
  - Show All Tabs/Exit Tab Overview (Mission Control-like).
  - Show/Hide Toolbar.
  - Customize Toolbar.
  - Show/Hide Sidebar.
  - Enter/Exit Full Screen (new space; for apps supporting full screen).

### App-specific menus
- Between View and Window (Safari: History, Bookmarks).
- Provide for custom commands; list every command in the menu bar even if available elsewhere (discoverability, shortcuts, Full Keyboard Access); don't exclude rare/advanced ones.
- Reflect app hierarchy in menu order (Mail: Mailbox, Message, Format).
- Order most to least general/common.

### Window menu
- Navigate/organize/manage windows. Not for customizing appearance (View) or closing (File > Close).
- Provide even with one window; include Minimize and Zoom (Full Keyboard Access).
- Consider items to show/hide panels (no font/color panel entries; Format has them). Order:
  - Minimize: to Dock; Option -> Minimize All.
  - Zoom: toggles predefined/user size; Option -> Zoom All. Never use Zoom for full screen (View does).
  - Show Previous Tab.
  - Show Next Tab.
  - Move Tab to New Window.
  - Merge All Windows.
  - Enter/Exit Full Screen: only if app has no View menu; still keep separate Minimize and Zoom.
  - Bring All to Front: Option -> Arrange in Front (tiled).
  - Open app-specific windows: alphabetical order; no panels or modal views.

### Help menu
- Trailing end. Help Book format: macOS adds search field at top. Items:
  - Send YourAppName Feedback to Apple: Feedback Assistant.
  - YourAppName Help: Help Viewer for Help Book content.
  - Additional items (registration, release notes): separator after primary help; keep few, or link from help docs.
- See Offering help; `NSHelpManager`.

### Dynamic menu items
- Change behavior with a modifier key (Control, Option, Shift, Command), e.g. Minimize -> Minimize All.
- **Never** make a dynamic item the only way to do a task (hidden by default); use for advanced shortcuts.
- Use primarily in menu bar menus; not in context or Dock menus (even less discoverable).
- Require a single modifier key only (`isAlternate`).
- macOS sizes menu width to widest item incl. dynamic ones.

### iPadOS
- Revealed by pointer to top edge or swipe down; occupies same space as status bar.
- Differences vs macOS: visibility hidden until revealed (macOS visible); alignment centered (macOS leading); menu bar extras not available (macOS system/custom); window controls in menu bar when app is full screen (macOS never); Apple menu not available (macOS always); App menu lacks About, Services, app-visibility items (macOS always full).
- Menu bar often hidden: **must** make every function reachable via UI. Always offer alternatives to dynamic items (hardware keyboard only). Don't use the menu bar as catch-all.
- Reserve YourAppName > Settings for app's page in iPadOS Settings; internal preferences get a separate item beneath, same group, as do other app-wide config options.
- Tab-style navigation: consider each tab as View menu item, with key bindings.
- Group items into submenus more often than on Mac (rows use more space for tapping; smaller screens).

### macOS
- Apple menu: always first on leading side; system-defined; can't modify/remove.
- Menu bar extras on trailing end; system may shrink title spacing/truncate titles; may hide extras to fit app menus.
- Full screen: menu bar hides until pointer to top.
- Menu bar extra: app icon in menu bar while running (even not frontmost). Symbol preferred (SF Symbol or interface icon; black and clear shapes, system recolors for light/dark and selected). Menu bar height 24 pt. `MenuBarExtra`.
- Click shows a menu, not a popover (unless functionality too complex).
- Let people choose whether extra appears (setting; consider offering at setup).
- Don't rely on extra's presence/position (system hides/shows).
- Also expose functionality elsewhere, e.g. Dock menu (always available while running).
- iOS: not supported.
- Other platforms: out of scope.

## Toolbars ([HIG](https://developer.apple.com/design/human-interface-guidelines/toolbars))
- Toolbar: horizontal sets of controls on top or bottom edge, grouped logically; acts on content, navigates, orients. Holds title, navigation controls (back/forward, search fields), actions (buttons, menus). Tab bar is for switching app areas instead.
- Choose items deliberately; define what goes to overflow as width shrinks. macOS/iPadOS add overflow menu automatically: **never** add manually; avoid layouts that overflow by default.
- Add a More menu for extra, lowest-priority actions; include all in toolbar if possible.
- iPadOS, macOS: consider user customization (many items, advanced functions, long sessions; editing actions).
- Liquid Glass: reduce custom toolbar backgrounds and tinted controls (conflict with system background effects). Let the content layer inform color/appearance; use `ScrollEdgeEffectStyle` to separate toolbar from content.
- Avoid toolbar item label color similar to content layer backgrounds; with colorful content keep default monochrome.
- Prefer standard components; default corner radii concentric with bar corners; custom components must also be concentric.
- Consider temporarily hiding toolbars for distraction-free use; contextual, with reliable way to restore (see going full screen).
- Titles: useful title per window (confirms location, distinguishes windows); may be empty if redundant (Notes single window). **Never** use app name. Concise, under 15 characters.
- Navigation: use standard Back and Close buttons with standard symbols; no text label "Back"/"Close". Custom versions must look/behave the same and be consistent app-wide. Standard Back is circular symbol, not capsule with text.
- iOS: navigation toolbar = navigation bar.
- Actions: support main tasks; prioritize most likely/highest-level objects.
- Make each control's meaning clear; prefer simple symbols over text, except actions poorly shown by symbols (Edit).
- Prefer system symbols without borders (container supplies visibility; system handles hover/selection).
- `.prominent` style for key action (Done, Submit): one primary action only, on trailing side.
- Item groupings: leading edge, center, trailing edge.
  - Leading: back, show/hide sidebar, view title, optional document menu (Duplicate, Rename, Move, Export). Not customizable.
  - Center: common controls; title if not leading. macOS/iPadOS: customizable; collapses into system overflow when narrow.
  - Trailing: important always-available items, inspector buttons, optional search field, More menu (also supports customization), primary action like Done. Stays visible at all sizes.
- Pin items to an edge/center; insert space between items.
- Group by function and frequency (Keynote: presentation, playback, insertion).
- Navigation controls and critical actions (Done, Close, Save) in dedicated, distinct sections.
- Keep groupings/placement consistent across platforms.
- Minimize groups: max about 3.
- Separate text-labeled actions from symbol actions (adjacent ones blend into one apparent action); multiple text buttons: add fixed space (`UIBarButtonItem.SystemItem.fixedSpace`).
- iOS: prioritize only most important items; rest in More menu.
- iOS: large title (default transitions to standard on scroll, back at top); `prefersLargeTitles`.
- iPadOS: toolbar and tab bar can share the top area; good for few main areas with full-width content.
- macOS: toolbar in window frame (below or integrated with title bar); titles can sit inline; items have no bezel.
- macOS: **must** also offer every toolbar item as a menu bar command (toolbar can be customized/hidden); not every menu item needs a toolbar item.
- Other platforms: out of scope.
