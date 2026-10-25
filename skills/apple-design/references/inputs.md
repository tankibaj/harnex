# Inputs

last-checked: 2026-10-25
scope: Apple HIG input rules for iOS, iPadOS, macOS (Action button, Apple Pencil/Scribble, Camera Control, focus, game controls, gestures, motion, keyboards, pointing devices). Other platforms: out of scope.

## Action button ([HIG](https://developer.apple.com/design/human-interface-guidelines/action-button))
- iPhone only (iPadOS, macOS: not supported). Runs App Shortcuts or system functions; user picks at setup, changeable in Settings.
- Expose a set of essential app functions as App Shortcuts (e.g. "Start Egg Timer"). **Never** add a shortcut that just opens the app (system provides).
- Label per action: max 3 words, title-style capitalization, begins with verb, present tense, no articles/prepositions ("Start Race", not "Started Race" / "Start the Race"). Shown in Settings.
- Let the system teach usage; don't duplicate its Settings guidance or tips.
- Run actions without leaving context: Live Activities, custom snippets (e.g. "Set Timer" prompts duration then starts Live Activity, no Clock launch).

## Apple Pencil and Scribble ([HIG](https://developer.apple.com/design/human-interface-guidelines/apple-pencil-and-scribble))
- iPadOS only. Support behaviors expected of real marking tools (e.g. writing in margins).
- Let people choose Pencil vs finger anytime; controls **must** respond to Pencil too (else seems broken/low battery). Scribble is Pencil-only.
- Mark the moment Pencil touches; no button/mode needed first.
- Respond to tilt (altitude), force (pressure), orientation (azimuth), barrel roll: vary thickness/intensity; pressure drives continuous properties (ink opacity, brush size); keep simple.
- Direct visual connection: Pencil visibly and immediately manipulates content it touches; no disconnected actions elsewhere on screen.
- Support left- and right-handed use: don't put controls where a hand obscures them; allow repositioning.
- Hover: preview of mark (size, color) before touch; avoid continuously changing preview with hover height; **never** initiate actions on hover (esp. destructive); preview near mid of dynamic range (max occludes, min invisible); consider contextual menu near marking on squeeze/modifier key; show hover preview for Pencil only, not pointing device (Adopting hover support for Apple Pencil).
- Double tap: honor system setting (default toggle tool/eraser; alternatives previous tool, show/hide color picker, none). If system settings don't fit, may repurpose for mode toggle (e.g. mesh raise/lower).
- Custom double-tap behavior: provide control to choose it, make it discoverable, not on by default, show current mode.
- **Never** use double tap for content-modifying or destructive actions; prefer easily undone.
- Squeeze (Apple Pencil Pro; only when iPad screen on and Pencil not touching): user may map to App Shortcuts. Treat as single quick discrete gesture (not hold/repeat); show result promptly; reveal UI (contextual menu) near Pencil tip; nondestructive and easily undone.
- Barrel roll (Pencil Pro): only to modify marking (e.g. rotate highlight angle); **never** for navigation or showing controls.
- Scribble: works by default in standard text components (fields, views, search, web editable fields) except password fields. Custom fields: no tap/select needed before writing.
- Make Scribble available wherever text entry feels natural, even without a field (e.g. blank space under last Reminders item; `UIIndirectScribbleInteraction`).
- While writing: no autocompletion text; hide placeholder at first stroke; keep field stationary (delay move/resize until pause); no autoscroll of text while writing/editing; give enough space (enlarge field before writing or on pause; never mid-write; `UIScribbleInteraction`).
- PencilKit custom drawing: canvas colors adapt to Dark Mode by default; when drawing over PDF/photo, disable dynamic adjustment so markup stays visible.
- Compact environment: tool picker lacks undo/redo; show undo/redo buttons in toolbar; consider 3-finger undo/redo gesture (see Undo and redo).

## Camera Control ([HIG](https://developer.apple.com/design/human-interface-guidelines/camera-control))
- iPhone 16 / 16 Pro only (not iPadOS/macOS). Light press opens overlay from bezel; light double-press shows controls; slide finger to adjust.
- Control types: slider (range, e.g. contrast) and picker (discrete, e.g. grid on/off). System standard controls: zoom factor, exposure bias.
- Use SF Symbols for control icons (custom symbols unsupported); symbol doesn't reflect state. Camera & Photos category in SF Symbols app.
- Short control names (follow Dynamic Type; long ones obscure viewfinder).
- Slider values need units/context (EV, %, custom string; `localizedValueFormat`).
- Define prominent values (frequent or evenly spaced, e.g. zoom steps) for snapping (`prominentValues`).
- Keep UI out of overlay areas (adjacent to the control, portrait and landscape); maximize viewfinder; overlay appears/disappears over it.
- Minimize viewfinder distractions; **never** duplicate sliders/toggles in your UI while overlay is shown.
- Enable/disable controls per camera mode (e.g. disable video controls for photos); cannot add/remove controls at runtime.
- Arrange: common controls toward the middle, rare on sides; system remembers last-used control.
- Provide a locked camera capture extension so Camera Control can launch your camera from lock screen, Home Screen, other apps (`LockedCameraCapture`).

## Focus and selection ([HIG](https://developer.apple.com/design/human-interface-guidelines/focus-and-selection))
- Not supported in iOS; applies to iPadOS and macOS (with keyboard etc.).
- Focusing often selects; exception when selection would cause distracting context shift (opening a view).
- Use system focus effects; custom only if absolutely necessary.
- **Never** move focus without user interaction. Exception: user navigating with discrete directional input (keyboard, remote, controller) and focused item disappears: move focus to a nearby remaining item. Otherwise hide the focus indicator.
- iPadOS/macOS full keyboard access reaches all controls, so support focus only for content elements (list items, text fields, search fields), not buttons/sliders/toggles.
- Platform-consistent indicator: focused list item = white text + accent-color background highlight; unfocused = standard text + gray highlight (`UICollectionView`, `NSTableView`).
- Focus ring for text/search fields; highlight (full row) for lists/collections; ring OK for cell-filling items like photos.
- iPadOS 15+: focus system for text fields, text views, sidebars, collection views, custom views. Focus groups = areas (sidebar, grid, list). Tab moves between groups; arrow keys move among items within group.
- Halo effect (focus ring): customizable outline for custom views and fully opaque cell content; follows item shape; refine to rounded corners or Bezier paths; adjust position when occluded/clipped (badge above halo, parent clipping) (`UIFocusHaloEffect`).
- Highlighted appearance (accent-color text) is not a focus effect; automatic on selection of collection cells with content configurations (`UICollectionViewCell`).
- Custom views: Tab order follows reading order (leading to trailing, top to bottom); make stacks a single focus group to change traversal (`focusGroupIdentifier`).
- Set item priority so a group's primary item gets focus first (`UIFocusGroupPriority`).
- Other platforms (tvOS, visionOS): out of scope.

## Game controls ([HIG](https://developer.apple.com/design/human-interface-guidelines/game-controls))
- Support platform default input (touch, mouse+keyboard) as well as physical controllers; not every player has a controller. Provide fallback (`Adding virtual controls to games that support game controllers in iOS`).
- Touch (iOS/iPadOS, Touch Controller framework): virtual controls only if needed (many actions or movement control); prefer direct in-game gestures (tap object to select) to reduce overlap.
- Place virtual buttons within safe areas, away from Home indicator and Dynamic Island; frequent buttons near thumb, outside circular movement/camera regions; secondary controls (menus) at top.
- Sizes: frequent controls at least 44x44 pt; less important (menus) at least 28x28 pt.
- **Always** visible and tactile press state (e.g. glow visible under finger), plus sound and haptics.
- Symbols depict action (e.g. weapon for attack); **never** abstract shapes or controller names (A, X, R1) as artwork.
- Show/hide controls with context (e.g. movement stick appears on touch).
- Combine functionality: avoid simultaneous/sequenced presses; use double tap / touch and hold for variants; merge walk/sprint into one control.
- Movement on left side, camera on right. Use large input areas; floating thumbstick where thumb lands for movement; direct touch pan for camera (no virtual thumbstick).
- Physical controllers: auto-detect pairing and profile (Game Controller framework). If controller required (tvOS/visionOS "Game Controller Required" badge), check presence and prompt gracefully (`GCRequiresControllerUserInteraction`).
- Use the connected controller's labels/symbols in UI (`GCControllerElement`); with multiple controllers, match the one in use; multiplayer: per-player labels.
- Prefer SF Symbols over text for controller elements.
- Controller UI mapping outside gameplay:

| Button | UI behavior |
|---|---|
| A | Activates a control |
| B | Cancels or goes back |
| X, Y | none |
| Left shoulder | Navigate left to other screen/section |
| Right shoulder | Navigate right to other screen/section |
| Left/right trigger | none |
| Left/right thumbstick | Moves selection |
| Directional pad | Moves selection |
| Home/logo | Reserved for system |
| Menu | Opens game settings or pauses |

- Keyboard: prioritize single-key commands (first letter: I Inventory, M Map; Space for main action).
- Test bindings on an Apple keyboard (Control on others maps to Command; Command sits next to Space, easy with WASD).
- Consider key proximity: related actions on neighboring keys (number keys for inventory categories; high-value commands near WASD).
- Let players customize key bindings; ship sensible defaults.

## Gyroscope and accelerometer ([HIG](https://developer.apple.com/design/human-interface-guidelines/gyro-and-accelerometer))
- Use motion data (Core Motion) only for tangible benefit (fitness feedback, gameplay); **never** collect for its own sake.
- **Must** provide purpose copy for the permission request shown on first access.
- Outside active gameplay, avoid motion for direct UI manipulation (hard to reproduce, physically challenging, battery).

## Gestures ([HIG](https://developer.apple.com/design/human-interface-guidelines/gestures))
- Offer more than one way to act (voice, keyboard, Switch Control); never assume a specific gesture is possible.
- Gestures behave consistently with expectations: **never** give a familiar gesture (tap, swipe) an app-unique meaning; **never** invent a custom gesture for a standard action (activate button, scroll).
- Respond immediately with feedback that predicts result and shows required extent/type of movement.
- Indicate when a gesture is unavailable (locked object, clearly distinct unavailable state) so app doesn't look frozen.
- Custom gestures only for specialized, frequent tasks not covered (games, drawing apps). Must be discoverable, straightforward, distinct from others, **never** the only way to do an important action.
- Teach custom gestures (in-app moments, test in real use); if hard to describe simply, hard to learn.
- Shortcut gestures supplement, not replace, standard ones (keep Back button alongside swipe from edge).
- Avoid conflicts with system-UI gestures; games can defer system gestures.
- iOS/iPadOS extras: three-finger swipe (left undo, right redo); three-finger pinch (in copy, out paste); four-finger swipe (iPadOS only) switch apps; shake undo/redo.
- iOS/iPadOS: consider simultaneous gesture recognition (games: joystick + fire buttons); rare in non-game apps.
- macOS: primary input is keyboard and mouse; standard gestures also on Magic Trackpad, Magic Mouse, touch-surface game controllers.
- Standard gestures:

| Gesture | Platforms (relevant) | Common action |
|---|---|---|
| Tap | iOS, iPadOS, macOS | Activate control; select item |
| Swipe | iOS, iPadOS, macOS | Reveal actions/controls; dismiss views; scroll |
| Drag | iOS, iPadOS, macOS | Move a UI element |
| Touch and hold | iOS, iPadOS | Reveal additional controls/functionality |
| Double tap | iOS, iPadOS, macOS | Zoom in; zoom out if zoomed; |
| Zoom | iOS, iPadOS, macOS | Zoom/magnify content |
| Rotate | iOS, iPadOS, macOS | Rotate selected item |

- Other platforms (visionOS, tvOS, watchOS gestures): out of scope.

## Keyboards ([HIG](https://developer.apple.com/design/human-interface-guidelines/keyboards))
- Support Full Keyboard Access (iOS, iPadOS, macOS) where possible: navigate/activate windows, menus, controls, system features by keyboard only. Test: Accessibility in Settings; `isFullKeyboardAccessEnabled`.
- iPadOS: keyboard navigation in text fields, text views, sidebars (APIs for collection/custom views); **never** add own keyboard navigation for controls (buttons, segmented controls, switches); leave to Full Keyboard Access (activation, all components, drag and drop).
- Respect standard shortcuts; for a unique frequent action make a custom shortcut instead of repurposing a standard one. Games: standard ones like Command-Q expected, plus customizable key bindings.
- Repurpose standard shortcut only if its action makes no sense in your app (e.g. no text editing: Command-I as Get Info).
- Shortcut = primary key + modifiers (Control, Option, Shift, Command). Games: key binding, often single key (see Game controls).

### Standard keyboard shortcuts
| Shortcut | Action |
|---|---|
| Command-Space | Show/hide Spotlight search field |
| Shift-Command-Space | Varies |
| Option-Command-Space | Show Spotlight results window |
| Control-Command-Space | Show Special Characters window |
| Shift-Tab | Navigate controls in reverse |
| Command-Tab | Next most recently used app |
| Shift-Command-Tab | Previous app in recent list |
| Control-Tab | Focus next control group in dialog, or next table (when Tab moves cell) |
| Control-Shift-Tab | Focus previous control group |
| Esc | Cancel current action/process |
| Option-Command-Esc | Force Quit dialog |
| Control-Command-Eject | Quit all apps (after saving) and restart |
| Control-Option-Command-Eject | Quit all apps (after saving) and shut down |
| Control-F1 | Toggle full keyboard access |
| Control-F2 | Focus menu bar |
| Control-F3 | Focus Dock |
| Control-F4 | Focus active (or next) window |
| Control-Shift-F4 | Focus previously active window |
| Control-F5 | Focus toolbar |
| Command-F5 | Toggle VoiceOver |
| Control-F6 | Focus first (or next) panel |
| Control-Shift-F6 | Focus previous panel |
| Control-F7 | Temporarily override keyboard access mode in windows/dialogs |
| F8, F9, F10 | Varies |
| F11 | Show desktop |
| F12 | Hide/display Dashboard |
| Command-Grave accent (`) | Activate next open window of frontmost app |
| Shift-Command-Grave accent | Activate previous window of frontmost app |
| Option-Command-Grave accent | Focus window drawer |
| Command-Hyphen (-) | Decrease selection size |
| Option-Command-Hyphen | Zoom out (screen zoom on) |
| Command-Left bracket | Left-align selection |
| Command-Right bracket | Right-align selection |
| Command-Pipe (\|) | Center-align selection |
| Command-Colon (:) | Show Spelling window |
| Command-Semicolon (;) | Find misspelled words |
| Command-Comma (,) | Open app settings window |
| Control-Option-Command-Comma | Decrease screen contrast |
| Command-Period (.) | Cancel operation |
| Control-Option-Command-Period | Increase screen contrast |
| Command-Question mark (?) | Open app Help menu |
| Option-Command-Forward slash (/) | Toggle font smoothing |
| Shift-Command-Equal sign (=) | Increase selection size |
| Option-Command-Equal sign | Zoom in (screen zoom on) |
| Shift-Command-3 | Screenshot to file |
| Control-Shift-Command-3 | Screenshot to Clipboard |
| Shift-Command-4 | Capture selection to file |
| Control-Shift-Command-4 | Capture selection to Clipboard |
| Option-Command-8 | Toggle screen zoom |
| Control-Option-Command-8 | Invert screen colors |
| Command-A | Select all (items or text field characters) |
| Shift-Command-A | Deselect all |
| Command-B | Bold selection / toggle bold |
| Command-C | Copy |
| Shift-Command-C | Show Colors window |
| Option-Command-C | Copy style of selected text |
| Control-Command-C | Copy formatting settings of selection to Clipboard |
| Option-Command-D | Show/hide Dock |
| Control-Command-D | Show Dictionary definition of selected word |
| Command-E | Use selection for find |
| Command-F | Open Find window |
| Option-Command-F | Jump to search field |
| Control-Command-F | Enter full screen |
| Command-G | Find next occurrence |
| Shift-Command-G | Find previous occurrence |
| Command-H | Hide windows of current app |
| Option-Command-H | Hide windows of all other apps |
| Command-I | Italicize selection / toggle italic; alternately Info window |
| Option-Command-I | Show inspector window |
| Command-J | Scroll to selection |
| Command-M | Minimize active window |
| Option-Command-M | Minimize all windows of active app |
| Command-N | New document |
| Command-O | Open-document dialog |
| Command-P | Print dialog |
| Shift-Command-P | Page Setup dialog |
| Command-Q | Quit app |
| Shift-Command-Q | Log out |
| Option-Shift-Command-Q | Log out without confirmation |
| Command-S | Save new document / save a version |
| Shift-Command-S | Duplicate document / Save As |
| Command-T | Show Fonts window |
| Option-Command-T | Show/hide toolbar |
| Command-U | Underline / toggle underline |
| Command-V | Paste at insertion point |
| Shift-Command-V | Paste as (e.g. Paste as Quotation) |
| Option-Command-V | Apply style of one object to selection |
| Option-Shift-Command-V | Paste and match surrounding style |
| Control-Command-V | Apply formatting settings to selection |
| Command-W | Close active window |
| Shift-Command-W | Close file and its windows |
| Option-Command-W | Close all app windows |
| Command-X | Cut |
| Command-Z | Undo |
| Shift-Command-Z | Redo (when undo/redo are separate commands) |
| Command-Right arrow | Switch keyboard layout to current Roman script layout |
| Shift-Command-Right arrow | Extend selection to next semantic unit (usually end of line) |
| Shift-Right arrow | Extend selection one character right |
| Option-Shift-Right arrow | Extend selection to end of word, then next word |
| Control-Right arrow | Move focus to another value/cell in a view (e.g. table) |
| Command-Left arrow | Switch keyboard layout to current system script layout |
| Shift-Command-Left arrow | Extend selection to previous semantic unit (usually line start) |
| Shift-Left arrow | Extend selection one character left |
| Option-Shift-Left arrow | Extend selection to beginning of word, then previous word |
| Control-Left arrow | Move focus to another value/cell in a view |
| Shift-Command-Up arrow | Extend selection up to next semantic unit (usually document start) |
| Shift-Up arrow | Extend selection to line above (same horizontal position) |
| Option-Shift-Up arrow | Extend selection to paragraph start, then next paragraph start |
| Control-Up arrow | Move focus to another value/cell in a view |
| Shift-Command-Down arrow | Extend selection down to next semantic unit (usually document end) |
| Shift-Down arrow | Extend selection to line below |
| Option-Shift-Down arrow | Extend selection to paragraph end, then next (include terminator like Return in cut/copy/paste) |
| Control-Down arrow | Move focus to another value/cell in a view |

Input-source shortcuts (localization, layouts, input methods; not tied to menu commands):

| Shortcut | Action |
|---|---|
| Control-Space | Toggle current and last input source |
| Control-Option-Space | Next input source in list |
| [Modifier]-Command-Space | Varies |
| Command-Right arrow | Keyboard layout: current Roman script layout |
| Command-Left arrow | Keyboard layout: current system script layout |

### Custom keyboard shortcuts
- Define custom shortcuts only for the most frequent app-specific commands; too many = hard to learn.
- Use modifiers as people expect: Command while dragging moves items as group; Shift while drag-resizing constrains aspect ratio; holding arrow key moves selection by smallest app-defined unit until release.
- Modifiers:

| Modifier | Recommended use |
|---|---|
| Command | Main modifier in custom shortcuts |
| Shift | Secondary modifier complementing a related shortcut |
| Option | Sparingly; less-common/power commands |
| Control | Avoid; system uses it widely (focus, screenshots) |

- Modifier needed for characters in some languages (French Option-5 = "{"): Command is usually safe; avoid extra modifiers with characters missing on some keyboards; if non-Command modifier needed, use only with alphabetic characters.
- **Must** list multiple modifiers in order: Control, Option, Shift, Command.
- **Never** add Shift to a shortcut using the upper character of a two-character key: Hide Status Bar = Command-Slash; Help = Command-Question mark, not Shift-Command-Slash.
- Let system localize and mirror shortcuts (right-to-left layouts).
- **Never** derive a shortcut by adding a modifier to an existing one for an unrelated command (e.g. Shift-Command-Z for non-undo).
- Other platforms (visionOS, tvOS, watchOS): out of scope.

## Nearby interactions ([HIG](https://developer.apple.com/design/human-interface-guidelines/nearby-interactions))
- iPhone/iPad with Ultra Wideband (Nearby Interaction framework); not macOS. iPhone APIs give peer distance and direction. People grant permission first; identifiers are random and last only for the session.
- Derive ideas from the physical world (e.g. bring devices together to transfer audio).
- Use distance, direction, context (e.g. share sheet suggests closest contact being faced).
- Let feedback sharpen with proximity (AirTag: arrow becomes pulsing circle when near).
- Provide continuous, uninterrupted feedback responding to movement (Find My direction/proximity).
- Combine visual, audible, haptic feedback: visual while on screen, audio/haptic while interacting with environment.
- **Never** make nearby interaction the only way to do a task; provide alternatives.
- Encourage portrait orientation (landscape reduces distance/direction accuracy and availability); give implicit visual cues instead of explicit "hold in portrait" text where possible.
- Design for the sensor's field of view (like Ultra Wide camera, iPhone 11 and later): outside it, distance may arrive without direction.
- Warn about obstructions (people, animals, large objects reduce accuracy/availability) in onboarding/tutorial content.
- watchOS: out of scope.

## Pointing devices ([HIG](https://developer.apple.com/design/human-interface-guidelines/pointing-devices))
- Mac: pointer + keyboard combined. iPadOS: pointer adds to touch, doesn't replace it.
- Respond consistently to mouse/trackpad gestures (e.g. "Swipe between pages" same everywhere).
- **Never** redefine systemwide trackpad gestures (Dock, Mission Control), even in games; Mac users can customize them.
- Consistent experience across gestures, pointer, keyboard (and touch).
- Let the pointer reveal/hide auto-minimizing controls (iPadOS Safari toolbar hover; full-screen video playback controls).
- Modifier+interaction must give same result with touch and pointer (e.g. Option-drag duplicates).
- iPadOS multiple selection: click-drag pointer makes selection rectangle (iPadOS 15+); standard nonlist collection views support it; custom views implement it (`UIBandSelectionInteraction`).
- iPadOS: differentiate pointer vs finger only for value (e.g. scrubber: both drag playhead; pointer also clicks precise seek point).
- iPadOS pointer: default circle; changes shape per element (I-beam over text). Content effects:
  - Highlight: pointer becomes translucent rounded rectangle with gentle parallax; default on bar buttons, tab bars, segmented controls, edit menus. Use for small elements with transparent background.
  - Lift: element scales up with shadow + specular highlight, pointer fades beneath; default on app icons, Control Center buttons. Use for small elements with opaque background.
  - Hover: custom scale, tint, shadow; pointer shape unchanged. Use for large elements.
- Pointer accessories (`UIPointerAccessory`): small secondary indicators (e.g. resize arrows) combinable with any pointer. Simple clear images; use accessory transition to signal state change (e.g. `plus` to `circle.slash` when add unavailable).
- Magnetism: pointer pulled to element on approach (hit region extends past visible bounds) and on flick toward likely target (center pull). Default on lift and highlight elements, not hover (pointer shape unchanged; would feel like lost control). Also text-entry areas (avoids line jumps while selecting).
- Support system content effects; align with each effect's design intent.
- Use system pointer appearances for standard buttons and text-entry areas.
- Hit region padding: about 12 pt around elements with a bezel; about 24 pt around elements without bezel (too small = needs precision; too large = hard to leave).
- Contiguous hit regions for custom bar buttons (gaps cause pointer to flash default shape between buttons).
- Nonstandard-shaped lift element: provide corner radius/shape so pointer morphs seamlessly (`UIPointerShape.roundedRect(_:radius:)`).
- Custom elements behaving like standard ones: use system pointer effects (else look broken).
- Apply pointer effects consistently (same experience across all drawing areas, etc.).
- **Never** add gratuitous decorative pointer/content effects.
- Keep custom pointer shapes simple and self-explanatory.
- Consider custom annotations with useful info (X/Y over graph; Keynote width/height while resizing).
- **Never** show instructional text with the pointer.
- Custom hover: scale only where it won't crowd neighbors (not table rows; use tint instead); **never** shadow without scale (unscaled element doesn't look closer).
- macOS: standard clicks/gestures (users can customize; support them as expected):

| Click/gesture | Expected behavior | Mouse | Trackpad |
|---|---|---|---|
| Primary click | Select/activate item | yes | yes |
| Secondary click | Contextual menu | yes | yes |
| Scrolling | Move content up/down/left/right | yes | yes |
| Smart zoom | Zoom in/out on content (web page, PDF) | yes | yes |
| Swipe between pages | Navigate pages forward/back | yes | yes |
| Swipe between full-screen apps | Navigate full-screen apps and spaces | yes | yes |
| Mission Control (mouse: double-tap with two fingers; trackpad: swipe up with three or four fingers) | Activate Mission Control | yes | yes |
| Lookup and data detectors (force click one finger or tap three fingers) | Lookup window over selection | no | yes |
| Tap to click | Primary click via tap | no | yes |
| Force click | Quick Look or lookup window; variable pressure for pressure-sensitive controls (variable-speed media) | no | yes |
| Zoom (pinch two fingers) | Zoom in/out | no | yes |
| Rotate (two fingers circular) | Rotate content (image) | no | yes |
| Notification Center (swipe from trackpad edge) | Show Notification Center | no | yes |
| App Expose (swipe down three or four fingers) | Show app's windows | no | yes |
| Launchpad (pinch thumb + three fingers) | Show Launchpad | no | yes |
| Show Desktop (spread thumb + three fingers) | Move windows away to reveal desktop | no | yes |

- macOS pointers (AppKit API):

| Pointer (API) | Meaning |
|---|---|
| Arrow (`arrow`) | Standard select/interact |
| Closed hand (`closedHand`) | Dragging to reposition content in a view (map) |
| Contextual menu (`contextualMenu`) | Contextual menu available; usually only with Control pressed |
| Crosshair (`crosshair`) | Precise rectangular selection (Preview image) |
| Disappearing item (`disappearingItem`) | Dragged item vanishes on drop; referenced original unaffected (mailbox from favorites bar) |
| Drag copy (`dragCopy`) | Drop duplicates instead of moving; shown with Option held during drag |
| Drag link (`dragLink`) | Drop creates alias to original file; shown with Option+Command during drag |
| Horizontal I-beam (`iBeam`) | Text selection/insertion, horizontal layout |
| Open hand (`openHand`) | Content in view can be dragged to reposition |
| Operation not allowed (`operationNotAllowed`) | Dragged item can't be dropped here |
| Pointing hand (`pointingHand`) | Content is a link (URL, document, etc.) |
| Resize down/left/right/up (`resizeDown`, `resizeLeft`, `resizeRight`, `resizeUp`) | Resize/move window, view, element in that direction |
| Resize left/right (`resizeLeftRight`) | Resize/move horizontally |
| Resize up/down (`resizeUpDown`) | Resize/move vertically |
| Vertical I-beam (`iBeamCursorForVerticalLayout`) | Text selection/insertion, vertical layout |

- Other platforms (visionOS): out of scope.
- Digital Crown, Eyes, Remotes pages: no iOS/iPadOS/macOS content; skipped.
