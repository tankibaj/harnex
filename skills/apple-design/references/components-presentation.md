# Components: presentation

last-checked: 2026-10-25
scope: action sheets, alerts, page controls, panels, popovers, scroll views, sheets, windows for iOS, iPadOS, macOS (incl. Liquid Glass scroll edge effects)

## Action sheets ([HIG](https://developer.apple.com/design/human-interface-guidelines/action-sheets))
- Use action sheet, not alert, for choices tied to an action the person started (e.g. cancel draft: delete or save). Alert = unexpected, problem/change notice, no extra choices.
- Use sparingly; they interrupt.
- Title short, single line. Avoid truncation/scroll.
- Message only if necessary; title + context usually enough.
- Include Cancel button if action might destroy data. Place at bottom of sheet. SwiftUI confirmation dialog adds Cancel by default.
- Destructive choices: destructive style, place at top of sheet.
- API: SwiftUI `confirmationDialog` (all platforms); UIKit `UIAlertController.Style.actionSheet`.
- macOS: no additional considerations.
- iOS/iPadOS: use action sheet, not menu, for action-related choices (people expect menu only when they reveal it).
- iOS/iPadOS: **Never** let an action sheet scroll; more buttons = slower choice, accidental taps.
- Other platforms: out of scope.

## Alerts ([HIG](https://developer.apple.com/design/human-interface-guidelines/alerts))
- Use sparingly. Only essential info and useful actions.
- Never use alert merely to inform (non-actionable). Show info in context instead (e.g. Mail connection indicator people can tap).
- Skip alerts for common, undoable actions, even destructive (delete email/file with undo). Alert for uncommon, destructive, non-undoable actions.
- **Never** show an alert at app start. Make info discoverable; on startup problem (no network) show cached/placeholder data plus nonintrusive label.
- Content: title, optional informative text, up to 3 buttons. iOS/iPadOS/macOS alert can include text field; macOS can add icon, accessory view, suppression checkbox, Help button.
- Copy: direct, neutral, approachable. Not oblique, accusatory, or masking severity.
- Title: clear, succinct, specific; what happened, context, why. No "Error" / "Error 329347 occurred". No more than 2 lines.
- Title complete sentence: sentence-style caps + ending punctuation. Fragment: title-style caps, no ending punctuation.
- Informative text only if it adds value; short, complete sentences, sentence-style caps, punctuation.
- Don't explain buttons. If needed, say "choose" (not tap/click), refer to exact button title without quotes.
- Text field only if input needed to resolve (e.g. secure field for password).
- Button titles: 1-2 words, verb/verb phrase tied to alert text ("View All", "Reply", "Ignore"). Sentence-style caps, no ending punctuation.
- "OK" only in purely informational alerts; avoid "Yes"/"No". Prefer specific ("Erase", "Convert", "Clear", "Delete").
- Always title cancel button "Cancel".
- Placement: likeliest button trailing in row / top in stack. Default button always trailing of row / top of stack. Cancel typically leading / bottom.
- Destructive style only for destructive action the person did not deliberately choose. Deliberately chosen (Empty Trash): no destructive style on the confirming button (Return-to-confirm convenience wins).
- Destructive action present: include Cancel. **Never** make Cancel the default button. To force reading, make no button default. Single button that is also default: use "Done", not "Cancel".
- Provide alternative cancel: Esc or Command-Period on attached keyboard (iOS, iPadOS, macOS); Home Screen exit (iOS, iPadOS).
- iOS/iPadOS: use action sheet for choices on intentional action (e.g. cancel Mail message: delete edits, save draft, keep editing).
- iOS/iPadOS: avoid scrolling alerts (large text can scroll); keep titles short, message brief and only if necessary.
- macOS: app icon shown automatically; may supply alternative icon/symbol.
- macOS: repeating alerts can offer suppression; custom accessory view (`accessoryView`) if needed; Help button opens help docs.
- macOS: caution symbol (`exclamationmark.triangle`) sparingly; only when extra attention needed (unexpected data loss). Not for save/overwrite/empty trash tasks.
- API: SwiftUI `alert(_:isPresented:actions:)`, `UIAlertController`, `NSAlert`.
- Other platforms: out of scope.

## Page controls ([HIG](https://developer.apple.com/design/human-interface-guidelines/page-controls))
- Row of indicator dots for pages in flat ordered list; solid dot = current. Dots equidistant, clipped if too many.
- Use for ordered pages only; not hierarchical/nonsequential. Complex navigation: sidebar or split view.
- Center horizontally, near bottom of view/window.
- Don't show too many: more than about 10 dots hard to count. >10 peers: use grid or other arrangement.
- Custom indicator image: only when it enhances meaning (e.g. `location.fill` for Weather current location; `bookmark.fill` for all-bookmark pages). API: `preferredIndicatorImage`, `setIndicatorImage(_:forPage:)`.
- Custom images simple, clear. No complex shapes, negative space, text, inner lines. Prefer simple SF Symbols.
- Max 2 distinct indicator image types.
- Never color indicator images; custom colors reduce current-page contrast. Let system color.
- Not supported in macOS.
- iOS/iPadOS: current dot highlighted; with overflow, side dots shrink to hint more pages (e.g. 9 dots: center 5 default size, 2nd/8th about half, 1st/9th about one quarter).
- iOS/iPadOS interaction: tap (leading/trailing side of current indicator = prev/next; iPadOS pointer can target specific indicator) and scrub (touch and drag; past edge jumps to first/last).
- Animate scrolling transition only for tap; **never** for scrubbing (lag, flashes).
- Background styles (`backgroundStyle`): Automatic = shown only during interaction (page control not primary nav); Prominent = always shown (only when primary navigational control); Minimal = never shown (position display only).
- Avoid scrubber with minimal style (no scrub feedback); use automatic or prominent to allow scrubbing.
- API: `UIPageControl`, `PageTabViewStyle`.
- Other platforms: out of scope.

## Panels ([HIG](https://developer.apple.com/design/human-interface-guidelines/panels))
- macOS only. Floating supplementary controls/info for active window or selection. Not supported in iOS, iPadOS.
- Other platforms: use modal view for supplementary content (see Modality).
- Use for quick access to controls/info about the content in use (e.g. settings affecting selected item).
- Inspector: panel OK; auto-updates with selection. Info window (fixed contents regardless of selection): use regular window, not panel. Split view pane also an option for inspector.
- Prefer simple adjustment controls (sliders, steppers). Avoid controls needing typing or selecting items to act on.
- Title bar required (so it can be positioned). Brief noun/noun phrase, title-style caps ("Fonts", "Colors", "Inspector").
- App becomes active: bring all open panels to front regardless of active window. App inactive: hide all panels.
- Don't list panels in Window menu document list. Show/hide commands OK.
- Avoid minimize button on panels.
- Refer to panel by title in UI and help; menus: "Show Fonts" (no "panel"). Help may append "window" ("Fonts window").
- HUD-style panel (`hudWindow`): dark translucent. Prefer standard panels. Use HUD only: media-oriented app (movies/photos/slides); standard panel would obscure essential content; no controls needed (except disclosure triangle, system controls don't match HUD look).
- Keep one panel style when app changes mode (HUD in full screen: keep HUD out of it).
- HUD: sparing color, small amounts of high-contrast color only. Keep small; don't obscure or compete with adjusted content.
- API: `NSPanel`, `hudWindow`.

## Popovers ([HIG](https://developer.apple.com/design/human-interface-guidelines/popovers))
- Transient view above content after click/tap on control or area.
- Use for small amount of info/functionality: a few related tasks; it disappears after interaction.
- Consider when you need temporary content without sidebar/panel space cost.
- Arrow points as directly as possible at revealing element. Don't cover that element or essential content.
- Close button (Cancel/Done) only for clarity/guidance (exit with/without saving). Otherwise closes on outside click/tap or item select. Multi-select: stay open until explicit dismissal or outside click/tap.
- Always save work when a nonmodal popover auto-closes. Discard only on explicit Cancel.
- One popover at a time. **Never** cascade/hierarchy of popovers; close open one before showing new.
- Nothing displays over a popover except an alert.
- Let people close one popover and open another with single click/tap (esp. several bar buttons each opening one).
- Size only as big as contents plus pointing to source; system may adjust size.
- Animate size changes (condensed/expanded views) so it doesn't look like replacement.
- Don't say "popover" in help docs; refer to task/selection.
- **Never** use a popover for warnings (easy to miss/dismiss); use alert.
- iOS/iPadOS: avoid popovers in compact views. Adapt to size class; popovers for wide views, sheet/full-screen modal for compact.
- macOS: popover can be detachable (drag out to become panel, stays visible). Consider offering. Keep appearance changes minimal when detached.
- API: SwiftUI `popover(isPresented:attachmentAnchor:arrowEdge:content:)`, `UIPopoverPresentationController`, `NSPopover`.

## Scroll views ([HIG](https://developer.apple.com/design/human-interface-guidelines/scroll-views))
- Scroll view has no appearance; translucent scroll indicator shows position (near start/middle/end).
- Support default scroll gestures and keyboard shortcuts. Custom scrolling: indicators keep elastic behavior.
- Make scrollability apparent (indicators not always visible): show partial content at edge.
- Avoid nesting scroll views of same orientation. Horizontal in vertical (or reverse) OK.
- Consider page-by-page scrolling (page = view height/width) where it fits; subtract an overlap unit (line, row, part of picture) to keep context. API: `PagingScrollTargetBehavior`.
- Auto-scroll only when relevant content out of view, and only as much as needed: search/selection hidden; text entry begins where insertion point offscreen; pointer passes view edge during selection (follow it); person scrolled away from selection before acting (scroll until selection in view).
- If zoom supported, set sensible min/max scale (no single character filling screen).
- Scroll edge effects (iOS, iPadOS, macOS; Liquid Glass): visual separation between elements like toolbars and scrolling content behind. Custom bars: add manually if top layer needs clarity; styles automatic, hard, soft.
- Prefer automatic style (more opaque separation for toolbars with many controls, text outside Liquid Glass controls, pinned table headers). If using soft, test legibility thoroughly.
- Use scroll edge effect only when scroll view sits behind floating interface elements. Not decorative; doesn't block/darken like overlay.
- One scroll edge effect per view. iPad/Mac split views: one per pane, keep heights consistent for alignment.
- API: `ScrollEdgeEffectStyle`, `UIScrollEdgeEffect.Style`, `NSScrollEdgeEffectStyle`; `ScrollView`, `UIScrollView`, `NSScrollView`.
- iOS/iPadOS: consider page control with page-by-page mode (e.g. Weather locations). With page control, hide scroll indicator on same axis (redundant).
- macOS: indicator is "scroll bar". Small or mini scroll bars OK in panels when space tight; same size for all controls in that panel.
- Other platforms: out of scope.

## Sheets ([HIG](https://developer.apple.com/design/human-interface-guidelines/sheets))
- Scoped task closely tied to current context; request specific info or simple task, then return to parent.
- macOS: always modal. iOS/iPadOS: modal or nonmodal (nonmodal affects parent without dismissal, e.g. Notes format sheet).
- Buttons: Cancel/Close dismisses without saving. Done dismisses after completing/saving. Back = previous step/parent in hierarchy, **never** for dismissing.
- Complex/prolonged flows: consider alternatives. iOS/iPadOS full-screen modal (`UIModalPresentationStyle.fullScreen`) for video/photo/camera or multistep editing. macOS: new window or full screen (self-contained task like document editing -> window).
- One sheet at a time from main interface. If a sheet triggers another, close first, optionally re-show after.
- Use nonmodal view for supplementary items affecting parent task: macOS panel; iOS/iPadOS nonmodal sheet.
- Provide alternative to Done: pair with Cancel or Back. Done alone implies no exit. **Never** show Cancel, Done and Back together.
- iOS/iPadOS single-view sheet: Cancel leading edge of top toolbar, Done trailing.
- Multi-step: first step Cancel (leading) + inactive Done (trailing); subsequent steps Back (leading) + inactive Done; final step Back + Done.
- Resizable sheet: expands on scroll content or grabber drag; sizes via detents. System detents: large (fully expanded; automatic) and medium (about half). Medium only = cannot expand to full. Custom detents allowed. API: `detents`.
- iPhone: consider medium detent for progressive disclosure (share sheet). Skip medium when content needs full height (Messages/Mail compose).
- Include grabber in resizable sheet (`prefersGrabberVisible`); tap cycles detents; works with VoiceOver.
- Support swipe-down to dismiss. With unsaved changes, confirm via action sheet.
- iPadOS: prefer page or form sheet presentation styles (default size, centered over dimmed background). API: `UIModalPresentationStyle`.
- macOS: card with rounded corners floating over dimmed parent window. People expect to use other app windows before dismissing.
- macOS: reasonable default size (people don't expect to resize); consider supporting resize for expansion.
- macOS: opening sheet brings parent window front (plus its modeless document panels). Allow bringing other app windows forward without dismissing sheet.
- macOS: repeated input + observing results (find and replace): use panel, not sheet.
- API: `sheet(item:onDismiss:content:)`, `UISheetPresentationController`, `presentAsSheet(_:)`.
- Other platforms: out of scope.

## Windows ([HIG](https://developer.apple.com/design/human-interface-guidelines/windows))
- Not supported in iOS. Applies to iPadOS and macOS.
- Window types: primary (main navigation/content and actions); auxiliary (one task/area, no navigation to other app areas, usually has close button).
- Windows adapt fluidly to different sizes for multitasking/multiwindow (see Layout, Multitasking).
- Open a new window at the right moment (Mail Compose keeps message and email visible). Avoid new windows as default; clutter and confusion.
- Consider optional "open in new window" via context menu or File menu. API: `OpenWindowAction`.
- **Never** build custom window frames/controls or imitate system look; imperfect copies feel broken.
- Say "window" in user-facing text (not "scene").
- iPadOS: two modes by Multitasking & Gestures setting: full screen (windows fill screen, switch via app switcher) and windowed (free resize, multiple onscreen, system remembers size/placement).
- iPadOS windowed: window controls at leading edge of toolbar; ensure they don't overlap toolbar items. Move leading buttons inward when controls appear.
- iPadOS: consider gesture to open content in new window (pinch to expand Notes item). API: `collectionView(_:sceneActivationConfigurationForItemAt:point:)`, `UIWindowScene.ActivationInteraction`. To view one file, `QLPreviewSceneActivationConfiguration` (multiple windows must be supported).
- macOS window: frame (above body; window controls, toolbar; rarely a bottom bar) plus body. Drag frame to move; edges to resize.
- macOS states: main (frontmost; one per app), key (active, accepts input; one onscreen; usually main but may be a panel), inactive. Some panels (Colors, Fonts) become key only on title bar click or text-input component click.
- State appearances differ: key window has color in close/minimize/zoom; inactive and non-key main use gray. Inactive windows don't use Materials, look subdued/farther.
- Custom windows use system-defined appearances for each state; system components update automatically, custom implementations must handle it.
- Avoid critical info/actions in bottom bar (window may be moved so bottom edge hidden). If used: small amount of info related to window contents/selection (Finder status bar). More info: inspector on trailing side of split view.
- Other platforms: out of scope.
