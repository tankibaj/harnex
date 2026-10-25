# Components: system surfaces

last-checked: 2026-10-25
scope: app shortcuts, controls, live activities, notifications, snippets, status bars, widgets for iOS, iPadOS, macOS (specs for those platforms only)

## App Shortcuts ([HIG](https://developer.apple.com/design/human-interface-guidelines/app-shortcuts))
- Expose key functions/content system-wide: Siri, Spotlight, Shortcuts app, Action button, Apple Pencil squeeze. Available right after install (before first launch); can later reflect user choices.
- Built on App Intents. Each shortcut = one or more actions; max 10 App Shortcuts per app.
- Users can also build custom shortcuts from your App Intents actions in Shortcuts.
- Common domains: consider app schemas (Apple Intelligence/Siri surfaces features without individual App Shortcuts). App Shortcuts for unique features/custom content outside schemas.
- Offer for most common/important tasks; best when doable without leaving current context; may open app for multistep tasks.
- Optional single parameter for flexibility ("Start [morning, daily, sleep] meditation"); options predictable and familiar (no list shown).
- Missing optional info: ask clarification; offer likely default (most recent/time of day) plus short alternatives list.
- Keep voice phrases simple; if awkward aloud, too complex. Avoid multiple parameters; ask extra info in a later step.
- Make discoverable in-app: occasional tips after common actions (`SiriTipUIView`).
- Responses: Siri dialogue, snippets (static info/dialog options), Live Activities (continuous, changing info; timers/countdowns).
- Include all critical info in full dialogue text for audio-only devices (AirPods, HomePod).
- Phrases: brief, memorable, natural variants; must include app name (can be creative: "Create a Keynote"). API: `AppShortcutPhrase`.
- Copy: "App Shortcuts"/"Shortcuts app" title case, Shortcuts plural; individual shortcuts lowercase.
- iOS/iPadOS: appear in Spotlight Top Hit area or Shortcuts area below; each has SF Symbol or item preview image. Order by importance (sets initial order in Spotlight and Shortcuts app; system adapts to usage).
- macOS: App Shortcuts not supported; App Intents actions are, usable in Shortcuts on Mac.

## Controls ([HIG](https://developer.apple.com/design/human-interface-guidelines/controls))
- Button/toggle giving quick access to app feature from Control Center, Lock Screen, Action button. Buttons: perform action, deep link, or launch camera experience on locked device. Toggles: two states.
- Added by user: Control Center (long-press empty area), Lock Screen customization, Settings for Action button.
- Anatomy: symbol (SF Symbol/custom), title (what it relates to), optional value (state). Control Center: symbol, plus title/value at larger sizes. Lock Screen: symbol only. Action button press-and-hold: symbol + value in Dynamic Island.
- Offer controls for actions with most benefit without launching app (e.g. start Live Activity).
- Update on interaction, action completion, or remotely via push; show in-progress state.
- Descriptive symbol (title/value may be hidden). Toggles: symbols for on and off (e.g. `door.garage.open`/`door.garage.closed`).
- Symbol animations for state changes: animate on/off transitions; for durational button actions animate until complete. API: `SymbolEffect`.
- Tint color matching brand: applied to toggle symbol in on state and to Action button value/symbol in Dynamic Island.
- Needs configuration: prompt on first add (`promptsForUserConfiguration()`); reconfigurable anytime.
- Action button hint text with verbs ("Hold for Silent"). API: `controlWidgetActionHint(_:)`.
- Situational title/value: provide placeholder (shown in controls gallery and before Action button assignment).
- Locked device: consider system redaction of title/value (symbol shown off state if specified) for sensitive info.
- Security-affecting actions (door lock, start car): require authentication. API: `IntentAuthenticationPolicy`.
- Locked camera experience (iOS 18+): control launching camera capture while locked; any task beyond capture requires unlock. Use same camera UI as in app; give instructions for adding the control. API: `LockedCameraCapture`.
- iOS/iPadOS/macOS: no additional considerations.

## Live Activities ([HIG](https://developer.apple.com/design/human-interface-guidelines/live-activities))
- Glanceable tracking of a task/event over a few hours, with frequent updates and interactions; starts on iPhone/iPad, auto-appears across devices.
- Locations: iPad/iPhone Lock Screen, Home Screen, Dynamic Island, StandBy (iPhone); Mac menu bar.
- Must support presentations: compact, minimal, expanded, Lock Screen.
- Compact: Dynamic Island when one activity active; leading and trailing elements around TrueDepth camera.
- Minimal: multiple activities; up to three in Dynamic Island (one attached, others detached circular/oval). Tap opens app; touch-and-hold shows expanded.
- Expanded: touch-and-hold from compact/minimal.
- Lock Screen: banner at bottom of Lock Screen; layout similar to expanded. On devices without Dynamic Island, alert shows it briefly as banner over Home Screen/apps.
- StandBy: minimal presentation; tap scales Lock Screen presentation 2x to fill screen; custom background color auto-extends full screen.
- Use for tasks/events with defined start and end; short-to-medium, not exceeding eight hours.
- Prioritize at-a-glance essentials; tap opens app for detail.
- **Never** show ads or promotions.
- Avoid sensitive info (visible to observers, Always-On): show innocuous summary, or redact and let people configure.
- Match app aesthetic in dark and light. Logo mark without container; never the entire app icon.
- Don't add elements to your app that draw attention to the Dynamic Island.
- Text: large, heavier (medium weight or higher); small text sparingly.
- Layout: adapt to screen sizes/presentations (use Specifications); use only needed space; adapt compact/minimal to fit inside a 28pt-diameter circle for limited width (e.g. landscape Dynamic Island) with short abbreviation/graphic; or leading view only, trailing empty (system hides it). API: `isDynamicIslandLimitedInWidth`.
- Use Apple Design Resources templates (default margins, recommended text sizes).
- Consistent margins, concentric placement; rounded elements near corners use `ContainerRelativeShape` (don't hardcode radius). Separate content blocks with inset container shape or thick line; never draw content to the Dynamic Island edge.
- Dynamically change height on Lock Screen/expanded presentation: shrink with less info, grow with more (e.g. rideshare).
- Colors: no custom background for compact/minimal/expanded (Dynamic Island = black opaque); Lock Screen custom background/image allowed with sufficient contrast, especially tints on reduced-luminance Always-On.
- Use bold colors for text/objects to express app identity. Tint key line (shown around Dynamic Island on dark backgrounds) to match content.
- Animations: system/custom, maximum 2 seconds; none on Always-On reduced luminance. Use content-replace or custom (scale, opacity, movement) transitions; numeric content transitions (scores); fade timers at zero.
- Animate layout changes: move existing elements to new positions rather than remove/re-add. Avoid overlap; for list items animate only the moving element, fade others.
- Tap opens app at the right location (deep link); both compact leading/trailing link to same screen.
- Interactivity: simple direct actions for essential, once-or-pause/resume functions (music, workouts, mic recording). Prefer a single interactive element. Offer response button if update is actionable (contact driver).
- Start at appropriate times; give in-app control to turn off (e.g. unfollow game) else people disable Live Activities in Settings. Offer App Shortcut that starts it (Action button).
- Update only when content changes.
- Alerts only for essential updates (lights screen, plays sound, shows expanded presentation/banner). Don't alert often; don't pair push notifications for same updates.
- One Live Activity rotating through multiple events beats several separate ones.
- End immediately when task/event ends; set custom dismissal time. Removed instantly from Dynamic Island; stays up to four hours on Lock Screen/Mac menu bar. Typically 15 to 30 minutes (e.g. rideshare 30 min for summary/tip).
- Design iPhone first, then refine other contexts (StandBy, etc.).
- Compact: show most important dynamic info (e.g. two team logos + score); leading/trailing read as one unit, consistent color/typography; as narrow as possible, snug to TrueDepth camera, no padding; avoid obscuring key status bar info; balanced similar-size elements (shortened units/less precise data).
- Minimal: recognizable; prefer updated info over a static logo (Timer shows remaining time).
- Expanded: keep relative placement from compact/minimal; wrap tightly around TrueDepth camera (use space beside it).
- Lock Screen: don't replicate notification layouts. Use custom background/tint/opacity sparingly (personalized Lock Screens). Default: light background in light, dark in dark; if custom, works in both modes or one per appearance; verify Always-On reduced luminance. Verify generated dismiss button color (`activitySystemActionForegroundColor(_:)`). Standard margin 14 points (tighter OK for graphics/buttons, avoid crowding).
- StandBy: check assets at larger scale; consider custom layout. Prefer default background (blends with bezel, allows slightly larger scale). Standard margins; no graphics to screen edge (cut off). Verify Night Mode (red tint) contrast.
- macOS: active Live Activities appear in paired Mac menu bar (compact, minimal, expanded); click launches iPhone Mirroring.
- Specs (pt):

| Screen (portrait) | Compact (leading/trailing) | Minimal | Expanded | Lock Screen | Limited width |
|---|---|---|---|---|---|
| 430x932 | 62.33x36.67 | 36.67-45x36.67 | 408x84-160 | 408x84-160 | 28x28 |
| 393x852 | 52.33x36.67 | 36.67-45x36.67 | 371x84-160 | 371x84-160 | 28x28 |

| iPad screen (portrait) | Lock Screen (pt) |
|---|---|
| 1366x1024 | 500x84-160 |
| 1194x834 | 425x84-160 |
| 1012x834 | 425x84-160 |
| 1080x810 | 425x84-160 |
| 1024x768 | 425x84-160 |

- macOS dimensions: use the iOS values.
- API: ActivityKit, WidgetKit.
- Other platforms: out of scope (Apple Watch, CarPlay).

## Notifications ([HIG](https://developer.apple.com/design/human-interface-guidelines/notifications))
- Get consent before sending. People set styles and delivery times in Settings.
- Styles: banner/view (Lock Screen, Home Screen, desktop), app icon badge, Notification Center item. Direct-communication notifications show contact image/avatar and group name instead of app icon.
- Concise, informative content.
- **Never** send multiple notifications for same thing, even without response (fills Notification Center; people disable all).
- Don't tell people to perform in-app tasks; offer notification actions for simple tasks instead.
- Errors: use alert, not notification.
- Foreground: system doesn't show notification; handle info discoverably but not intrusively (badge increment, insert into current view; Mail adds to list).
- **Never** include sensitive/personal/confidential info.
- Title: short, contextual (headline, event name, email subject); title-style caps, no ending punctuation. Generic title (e.g. "New Document"): let system show app name. Communication: system shows sender name; noncommunication without title: app name.
- Body: complete sentences, sentence case, punctuation; don't truncate (system does).
- Hidden-previews placeholder: generic descriptive body ("Friend request", "New comment", "Reminder", "Shipment"), sentence-style caps. API: `hiddenPreviewsBodyPlaceholder`. System shows only icon and "Notification" when previews are hidden.
- Don't include app name or icon (system shows large app icon at leading edge; communication shows sender image badged with small app icon).
- Sound: optional, supplementary; custom sound short, distinctive, professionally produced; don't rely on it for important info. Vibration can't be provided programmatically. API: `UNNotificationSound`.
- Actions: up to four buttons in detail view, no app launch (e.g. Snooze). Beneficial, context-relevant, time-saving; short title-case labels describing result; no app name/extraneous text; mind localization/truncation.
- Never an action that merely opens the app (tap does that).
- Prefer nondestructive actions; destructive ones need context and get distinct system appearance.
- Provide simple recognizable interface icon per action (shown trailing of title; SF Symbols).
- Badge: small filled oval with number of unread notifications; disappears when addressed; users can disable. Use only for unread-notification counts (never weather, dates, stock prices, scores). Never the only channel for essential info. Keep current (update when notifications opened; count to zero removes related notifications from Notification Center). Never mimic badge with custom image/component.
- iOS/iPadOS/macOS: no additional considerations.
- Other platforms: out of scope.

## Snippets ([HIG](https://developer.apple.com/design/human-interface-guidelines/snippets))
- Compact view showing result of, or confirmation for, an action via Siri, Spotlight, or Shortcuts; presented with an App Intent you design.
- Types: confirmation (confirm/cancel, may include options) and result (info, no further action). Intent with snippet always shows a result; confirmation optional.
- Anatomy: dialogue (Siri-spoken text, shown above custom view by default), custom view (max height 400 pt; may include buttons to modify content, get info, act), system buttons (confirmation: secondary Cancel + primary with customizable label; result: single Done).
- Legibility: sufficient contrast against system background in light and dark; consistent margins.
- Concise content; custom view no taller than 400 pt; mind text size settings; for result snippet detail, deep-link into app.
- Primary button label descriptive (pick from `ConfirmationActionName` or custom; "Order" over "OK"/"Proceed"); system default is "Continue".
- Convey purpose visually in custom view; omit dialogue from visual representation (don't duplicate info). Spoken dialogue still essential for non-visual use.
- iOS/iPadOS/macOS: no additional considerations.

## Status bars ([HIG](https://developer.apple.com/design/human-interface-guidelines/status-bars))
- iOS/iPadOS only (not macOS). Top edge: time, carrier, battery, etc.
- Transparent by default; content beneath hampers readability and looks interactive. Keep readable; don't imply content behind is interactive. Prefer scroll edge effect (blurred view behind status bar) (`ScrollEdgeEffectStyle`, `UIScrollEdgeEffect`).
- Consider temporarily hiding for full-screen media (Photos).
- **Never** hide permanently; give simple discoverable gesture to redisplay (Photos: single tap).
- API: `UIStatusBarStyle`, `preferredStatusBarStyle`.

## Widgets ([HIG](https://developer.apple.com/design/human-interface-guidelines/widgets))
- Glanceable content and focused interactions from app in extra contexts. iPhone/iPad: Home Screen, Lock Screen (also Today View, StandBy, CarPlay on iPhone). Mac: desktop and Notification Center. Framework: WidgetKit.
- Design for: sizes supported, contexts, rendering modes/color treatment. Consider custom designs per context instead of defaults.
- System family sizes: small, medium (same height as small, twice width), large (same width as medium, a little over twice height), extra large (iPad/Mac), extra large portrait (visionOS only).

| Size | iPhone | iPad | Mac |
|---|---|---|---|
| System small | Home Screen, Today View, StandBy, CarPlay | Home Screen, Today View, Lock Screen | Desktop, Notification Center |
| System medium | Home Screen, Today View | Home Screen, Today View | Desktop, Notification Center |
| System large | Home Screen, Today View | Home Screen, Today View | Desktop, Notification Center |
| System extra large | Not supported | Home Screen, Today View | Desktop, Notification Center |

- Accessory widgets (very limited info): circular, inline, rectangular on iPhone/iPad Lock Screen; corner not supported on iPhone/iPad.
- Appearances: full-color, tinted (monochrome with tint), clear (translucent). On iPhone/iPad Home Screen people choose light, dark, clear, tinted. Light/dark = full-color. Clear: system desaturates, adds translucency, highlights, Liquid Glass material. Tinted: system desaturates, applies chosen tint. iPad Lock Screen: monochrome, no tint. iPhone StandBy: scaled up, background removed; low light = monochrome red tint. Rectangular accessory on iPhone/iPad Lock Screen: monochrome, no tint.
- Rendering modes: fullColor (system family widgets; colors unchanged); accented (system family; system removes background, replaces with tint effect or Liquid Glass background for clear; splits views into accent group and primary group, each solid colored); vibrant (Lock Screen widgets iPhone/iPad, iPhone StandBy low light; desaturates text/images/gauges, colors for Lock Screen background or macOS desktop; red tint in StandBy low light). API: `WidgetRenderingMode`.

| Platform | Full-color | Accented | Vibrant |
|---|---|---|---|
| iPhone | Home Screen, Today view, StandBy and CarPlay (background removed) | Home Screen, Today view | Lock Screen, StandBy in Night Mode |
| iPad | Home Screen, Today view | Home Screen, Today view | Lock Screen |
| Mac | Desktop, Notification Center | Not supported | Desktop |

- Choose simple ideas tied to app main purpose; timely content and relevant functionality (Weather: current high/low and conditions).
- Give quick access to wanted content; offer useful actions and deep links. Don't just replicate app icon.
- Prefer dynamic info that changes through the day; delightful touches for occasions allowed.
- Multiple sizes only if value added; don't merely stretch small content to fill bigger size. One well-chosen size beats all sizes.
- Balance density: not sparse, not too dense; if dense use larger size or replace text with graphics.
- Only info directly related to main purpose; larger sizes widen range but keep purpose.
- Brand elements (colors, typefaces, glyphs) thoughtfully; if logo needed (multi-source content), small logo in top-right corner.
- Choose between auto-display and configurable (Stocks configurable; Podcasts auto). API: configurable widget.
- Never mirror widget appearance in-app as non-behaving element.
- If sign-in adds value, say so ("Sign in to view reservations").
- Updates: periodic, not real-time; system may adjust limits. Match refresh to data change rate and when people need it (tides hourly); if people check more often than you can update, show last-updated text. Let system refresh dates/times (saves update budget); don't hide stale data behind placeholders. Animated transitions up to 2 seconds for updates.
- Interactivity: tap/click launches app; buttons/toggles act without launching (Reminders toggles); non-button areas launch app. Simple relevant functionality; complexity stays in app. Deep link to exact related location. Keep glanceable, uncluttered, no app-like layouts; sized targets that avoid accidental taps; inline accessory widgets have only one tap target.
- Scaling: supply content at appropriate sizes; iOS resizes large-device design down for small devices; iPadOS renders at large size then scales down for Home Screen. Use Specifications for design, SwiftUI for production.
- Margins: standard 16 points for most widgets; tighter 11 points can work for groupings (graphics, buttons, background shapes). Smaller margins on Mac desktop and Lock Screen (incl. StandBy). API: `padding(_:_:)`.
- Coordinate content corner radius with widget via SwiftUI container (`ContainerRelativeShape`).
- Text: prefer system font, text styles, SF Symbols; custom font sparingly (custom for large text, SF Pro for small works). At least 11 points. Never rasterize text (scaling, VoiceOver). iOS/iPadOS Dynamic Type supported Large to AX5.
- Color: enhances without competing; asset-catalog colors can set editing-mode UI. Never rely on color alone for meaning (monochrome/tint appearances). Use full-color images judiciously (system desaturates by default in tinted/clear; full-color images in those appearances stand out as out of place); reserve for media (album art), smaller than widget.
- Full-color mode: support light and dark; light backgrounds for light, dark for dark; semantic system colors or asset-catalog variants.
- Accented mode: group components into accent and primary groups (`widgetAccentable(_:)`). iPhone/iPad/Mac: primary and accented content tinted white.
- Vibrant mode: pixel opacity sets blurred background strength; brightness sets vibrance (brighter gray = more contrast). Render images/numbers/text at full opacity; white or light gray for prominent content, darker grays for secondary; verify grayscale contrast; use opaque grayscale values, not white at partial opacity.
- Widget gallery preview: realistic, showing capabilities per size; real data fine, else realistic simulated data if slow.
- Placeholder: static components + semi-opaque shapes standing in for dynamic content (bars for text lines, circles/squares for glyphs/images).
- Gallery description: succinct, starts with action verb ("See the current weather conditions and forecast for a location"); no "This widget shows...", "Use this widget to...", "Add this widget"; approachable, sentence-style caps.
- Group all sizes under one widget with a single description.
- Consider coloring the gallery Add button with brand color.
- iOS/iPadOS Lock Screen widgets: follow complication principles; useful info, not an app launcher; styles: inline text above clock, circular and rectangular below clock. Design with complications in tandem.
- Always-On display (iPhone): reduced luminance; enough gray contrast, stay legible.
- Offer Live Activities for real-time updates (widgets aren't real-time); develop in tandem.
- StandBy/CarPlay: two small system widgets side by side, scaled up; supporting StandBy also covers CarPlay (small widget, background removed). Large text/glanceability matters (CarPlay). Limit rich images/color for meaning; scale and rearrange text for distance reading. Mark widget background removable for StandBy. API: widget background display.
- macOS: no additional considerations beyond above.
- iOS dimensions (pt):

| Screen (portrait) | Small | Medium | Large | Circular | Rectangular | Inline |
|---|---|---|---|---|---|---|
| 430x932 | 170x170 | 364x170 | 364x382 | 76x76 | 172x76 | 257x26 |
| 428x926 | 170x170 | 364x170 | 364x382 | 76x76 | 172x76 | 257x26 |
| 414x896 | 169x169 | 360x169 | 360x379 | 76x76 | 160x72 | 248x26 |
| 414x736 | 159x159 | 348x157 | 348x357 | 76x76 | 170x76 | 248x26 |
| 393x852 | 158x158 | 338x158 | 338x354 | 72x72 | 160x72 | 234x26 |
| 390x844 | 158x158 | 338x158 | 338x354 | 72x72 | 160x72 | 234x26 |
| 375x812 | 155x155 | 329x155 | 329x345 | 72x72 | 157x72 | 225x26 |
| 375x667 | 148x148 | 321x148 | 321x324 | 68x68 | 153x68 | 225x26 |
| 360x780 | 155x155 | 329x155 | 329x345 | 72x72 | 157x72 | 225x26 |
| 320x568 | 141x141 | 292x141 | 292x311 | N/A | N/A | N/A |

- iPadOS dimensions (pt; * = Display Zoom set to More Space):

| Screen (portrait) | Target | Small | Medium | Large | Extra large |
|---|---|---|---|---|---|
| 768x1024 | Canvas | 141x141 | 305.5x141 | 305.5x305.5 | 634.5x305.5 |
| | Device | 120x120 | 260x120 | 260x260 | 540x260 |
| 744x1133 | Canvas | 141x141 | 305.5x141 | 305.5x305.5 | 634.5x305.5 |
| | Device | 120x120 | 260x120 | 260x260 | 540x260 |
| 810x1080 | Canvas | 146x146 | 320.5x146 | 320.5x320.5 | 669x320.5 |
| | Device | 124x124 | 272x124 | 272x272 | 568x272 |
| 820x1180 | Canvas | 155x155 | 342x155 | 342x342 | 715.5x342 |
| | Device | 136x136 | 300x136 | 300x300 | 628x300 |
| 834x1112 | Canvas | 150x150 | 327.5x150 | 327.5x327.5 | 682x327.5 |
| | Device | 132x132 | 288x132 | 288x288 | 600x288 |
| 834x1194 | Canvas | 155x155 | 342x155 | 342x342 | 715.5x342 |
| | Device | 136x136 | 300x136 | 300x300 | 628x300 |
| 954x1373 * | Canvas | 162x162 | 350x162 | 350x350 | 726x350 |
| | Device | 162x162 | 350x162 | 350x350 | 726x350 |
| 970x1389 * | Canvas | 162x162 | 350x162 | 350x350 | 726x350 |
| | Device | 162x162 | 350x162 | 350x350 | 726x350 |
| 1024x1366 | Canvas | 170x170 | 378.5x170 | 378.5x378.5 | 795x378.5 |
| | Device | 160x160 | 356x160 | 356x356 | 748x356 |
| 1192x1590 * | Canvas | 188x188 | 412x188 | 412x412 | 860x412 |
| | Device | 188x188 | 412x188 | 412x412 | 860x412 |

- macOS dimensions: page gives none; no invented values.
- Other platforms: out of scope (watchOS, visionOS, HomeView, CarPlay).
