# Patterns

last-checked: 2026-10-25
scope: Apple HIG interaction patterns for iOS, iPadOS, macOS (charts, sharing, drag and drop, data entry, feedback, files, onboarding, settings, modality, media, undo, etc.). Other platforms: out of scope.

## Charting data ([HIG](https://developer.apple.com/design/human-interface-guidelines/charting-data))
- Chart only when highlighting something about a dataset; plain data with no analysis goal: list/table people can scroll, search, sort.
- Keep chart simple; reveal detail gradually (detail levels, data subsets). Interactive chart: offer versions of increasing functionality to teach it.
- **Must** make every chart accessible: accessibility labels for values and components + accessibility elements for interaction (Swift Charts accessibility).
- Prefer common types (bar, line). Novel chart: teach how to read it (e.g. animate parts individually).
- Examine data at macro (totals, averages), mid (subsets), micro (single values) levels; surface details for each.
- Add descriptive text: title, subtitle, annotations, headline/summary of key takeaway. Does not replace accessibility labels.
- Size chart to function, topic, detail: large enough for labels/annotations and interactivity; small for glanceable snapshot/preview of larger version.
- Stay consistent across charts with similar purpose; deviate only to show meaningful difference.
- Same dataset in multiple charts (small -> expanded): same type, colors, marks, annotations, layout, descriptive text.

## Collaboration and sharing ([HIG](https://developer.apple.com/design/human-interface-guidelines/collaboration-and-sharing))
- Use system share sheet (iOS) / sharing popover (iPadOS, macOS); SwiftUI `ShareLink`. Custom collaboration infra: also support universal links.
- Put Share button in convenient spot, e.g. toolbar.
- Customize share sheet/popover to offer only file-sharing types you support. "Send copy": CloudKit pass file + collaboration object; iCloud Drive default; custom include file (or plain-text form) in collaboration object.
- Permission summary: succinct phrase (e.g. "Only invited people can edit", "Everyone can make changes"); system shows it in a button revealing options.
- Few simple custom sharing options, grouped for at-a-glance reading: who can access, edit vs read, whether collaborators can add people.
- Show Collaboration button prominently as soon as collaboration starts; place next to Share button.
- Collaboration popover: top = collaborators + Messages/FaceTime buttons; middle = your custom items; bottom = manage-shared-file button. Add custom items only if essential (e.g. recent-updates summary, view more activity).
- Customize title of collaboration-management button (default "Manage Shared File") if sensible. CloudKit sharing gives management view; otherwise build your own.
- Consider Messages notifications for collaboration events (content change, membership change, mention) with a universal link into the relevant view (`SWHighlightEvent`).
- SharePlay for real-time shared activities.

## Drag and drop ([HIG](https://developer.apple.com/design/human-interface-guidelines/drag-and-drop))
- Support drag and drop throughout app; system text fields/views have it built in. iOS/iPadOS: touch, pointer, full keyboard access. macOS: pointer, full keyboard access, VoiceOver. Universal Control drags between Mac and iPad.
- Default semantics: same container = move; different container = copy; between apps = always copy. Change defaults only toward least frustration/data loss.
- Offer alternatives to dragging: menu commands (copy/move); accessibility drag source/drop point descriptors (`accessibilityDragSourceDescriptors`, `accessibilityDropPointDescriptors`).
- Support multi-item drag when sensible. macOS can gather items from several apps. iPadOS: add items to an in-progress drag without stopping.
- Prefer undo for drops. Confirm before irreversible drops (Finder: write-only folder). If no undo, offer reversal (Photos: cancel share after drop).
- Offer multiple representations ordered high to low fidelity (e.g. PDF vector, lossless PNG with alpha, lossy JPEG; native object then image).
- Consider spring loading: dragging over buttons/segmented controls activates them (iPad hover; Mac Magic Trackpad force-click while holding).
- Drag image: show once drag moves about 3 pt; translucent; keep until drop. Modify it to preview result (e.g. photo expands to default size) but avoid constant radical changes. Use flocking to group multi-items, ungroup on drop.
- Show whether destination accepts: insertion point/highlight only when acceptable; otherwise nothing or explicit not-allowed image (`circle.slash`). Highlight only while over destination; one at a time with multiple destinations.
- Invalid/failed drop: feedback, e.g. item returns to visible source or scales up and fades out.
- Accepting drops: auto-scroll scrolling destination during drag; stop when drag leaves container.
- Pick richest representation you can accept; fall back to simpler. Extract only relevant portion (contact to recipient field = name + email).
- With physical keyboard, check Option key at drop time: Option forces copy within same container; released before drop = move.
- Slow transfer: progress indicator; placeholder at drop location in collections/lists/tables. Drop that starts a task (e.g. print): show it began and progress.
- Dropped text: keep original style if both sides support same styles; else apply destination style.
- After drop: dropped content stays selected in destination. Same container move: disappears from origin. Same container copy: deselect remaining original. Different container: deselect in source.
- iOS/iPadOS: allow multiple simultaneous drag activities (sequentially add items, flocking feedback, accept multiple simultaneous drops).
- macOS: consider dragging content into Finder in a format app can reopen (e.g. `.ics`); use a clipping (temporary container; unrelated to Clipboard) when needed.
- macOS: allow dragging selected content from inactive window without activating it (background selection); allow dragging unselected items from inactive window without clearing its selection.
- macOS: consider badge (small filled oval with count) on multi-item drag; update when destination accepts a subset.
- macOS: consider pointer changes for drop result (copy, drag link, disappearing item, operation not allowed).
- macOS: allow select-and-drag in one motion, no pause (unless selecting multiple).
- Other platforms (visionOS, tvOS, watchOS): out of scope.

## Entering data ([HIG](https://developer.apple.com/design/human-interface-guidelines/entering-data))
- Minimize typing: pre-gather info, support all input methods.
- Get data from system (settings, permissioned location/calendar) instead of asking.
- State what is needed: prompt text (e.g. "username@company.com") or label ("Email"); prefill sensible defaults.
- Sensitive data: secure field (`SecureField`), obscured with filled circles.
- **Never** prepopulate a password field; ask, or use biometric/keychain auth.
- Prefer choices (picker, menu, selection control) over text entry.
- Accept drag and drop and paste.
- Validate dynamically, feedback as soon as problem detected. Numeric: number formatter (numeric-only; decimals, percent, currency display).
- Required data: make clear; enable Next/Continue only after required fields filled.
- macOS (incl. iOS/iPadOS apps on Mac): consider expansion tooltip for clipped/truncated field text.

## Feedback ([HIG](https://developer.apple.com/design/human-interface-guidelines/feedback))
- Match delivery to significance: passive status display; interrupting warning for possible data loss.
- Make feedback accessible: multiple channels (color, text, sound, haptics) so it works silenced, looking away, or VoiceOver.
- Integrate status near the items it describes (e.g. Mail toolbar: last update + unread count).
- Alerts only for critical, ideally actionable info; overuse dulls them.
- Warn before unexpected, irreversible data loss; **never** warn when loss is the expected result (e.g. Finder trash).
- Confirm completion only for significant tasks (e.g. payment); people expect success, so mainly show failure.
- When a command can't run, say so and explain why.
- Other platforms (watchOS, tvOS, visionOS): out of scope.

## File management ([HIG](https://developer.apple.com/design/human-interface-guidelines/file-management))
- iPadOS/macOS: offer New/Open as menu commands + keyboard shortcuts (iPadOS shows them in Command-hold shortcut overlay; macOS File menu). Always include an Add (+) button to create a document; macOS also puts add in File menu.
- Custom file browser: mirror Finder/Files mental model; open at relevant location (Documents, iCloud, last used) but let people reach the rest of the file system.
- Save automatically: periodically while editing, on close, on app switch; no explicit save needed unless cancel/delete.
- Hide file extensions by default, let people show them; reflect choice in all save/open UI.
- Quick Look: provide a viewer to preview files your app can't open; provide a generator for custom file types (Finder, Files, Spotlight previews).
- iOS/iPadOS 18+ document launcher (`DocumentGroupLaunchScene`): full-screen; title card (app title + 2 buttons), background image + accessories, sheet with file browser (e.g. tabs Recents, Shared, Browse) + optional toolbar controls.
- Launcher title card buttons: primary usually new document, secondary extra options (e.g. choose template).
- Launcher background: clearly distinct from accessories and title card; solid, gradient, or pattern; avoid complex images.
- Launcher accessories: may sit in front of/behind card for depth; app name and both buttons stay clearly visible; avoid clutter; test across screen sizes and orientations.
- Launcher animation sparingly: gentle repeating (breathe, sway).
- File provider extension (iOS/iPadOS): list only documents appropriate to context (e.g. PDFs for PDF editor); optional info (modified date, size, local/remote); let people choose destination when exporting/moving (navigate hierarchy, add subfolders unless single directory); avoid a custom top toolbar (modal already has one).
- macOS: use default file browser unless important reason.
- macOS open UI: convenient extras (open recent, filters, multi-select); customize Open button title (e.g. Insert).
- macOS save UI: let people change name, format, location; default title "Untitled"; default to logical location; format chooser if multiple formats; consider accessory view (e.g. include attachments).
- macOS Finder Sync extension: sync status badges, custom context menu items, custom toolbar buttons.
- macOS autosave off ("Ask to keep changes when closing documents"): show unsaved-changes dot on close button and in Window menu entry; save dialog on close, quit, log out, restart. With autosave on, avoid the dot (it implies action is needed).
- Optionally append "Edited" to title bar; remove as soon as saved/autosaved.

## Going full screen ([HIG](https://developer.apple.com/design/human-interface-guidelines/going-full-screen))
- Offer full screen for games, media (video, slideshows), in-depth focus tasks.
- Layout may adapt subtly in full screen (proportions, not which items appear); avoid jarring transitions. **Never** programmatically resize the window.
- Keep essential controls accessible without exiting full screen (media: persistent or easy-to-reveal playback controls).
- iPadOS/macOS: except games, let people reveal the Dock. Games: can ignore initial bottom-edge swipe (`preferredScreenEdgesDeferringSystemGestures`) or hide Dock on macOS (`hideDock`).
- On return after switching away, resume where left; pause games/slideshows automatically when leaving.
- Exit only when people choose; no auto-exit on switch or finished activity.
- May hide toolbars/nav for content focus (photos, reading); restore via familiar gesture (tap, swipe down, cursor to top). Keep controls visible when essential.
- iOS/iPadOS: Home indicator auto-hides and reappears on bottom-edge interaction (one swipe exits); keep default. If accidental exits, defer system gestures to require two swipes.
- macOS: use system full-screen (handles camera housing notch; `toggleFullScreen(_:)`).
- macOS games: **never** change display mode on full screen.
- macOS: let people choose when to enter: window's Enter Full Screen button, View menu item, Control-Command-F. Avoid custom menu of window modes. Games may add custom toggle.

## Launching ([HIG](https://developer.apple.com/design/human-interface-guidelines/launching))
- Launch instantly; people may not wait more than a couple of seconds.
- iOS/iPadOS require a launch screen (macOS does not).
- Splash screen (branding graphic), if needed: at start of onboarding, or right after launch if no onboarding.
- Restore previous state in detail (scroll position, window state and location).
- Launch screen: downplay; only purpose is perceived speed. Nearly identical to first screen (avoid flash); solid-color first screen = solid-color launch screen; match device orientation and appearance mode.
- Avoid text on launch screen (not localizable). **Never** advertise: no logos/branding unless fixed part of first screen; no splash/About look.
- iOS/iPadOS: launch in current device orientation if both supported; single-orientation app launches in that one. Landscape-only must work for both left and right rotation.

## Live-viewing apps ([HIG](https://developer.apple.com/design/human-interface-guidelines/live-viewing-apps))
- Feature live content prominently; first tab = live so one tap to watch.
- One tap or none to start: Watch Now button on featured/recent live content; playback goes full-screen immersive.
- Make live look live; distinguish from VOD (e.g. "Live" row, badge/symbol/sash).
- Consider progress indicator for in-progress live content.
- Playback is primary action; extra actions (Watch, Start Over, Record, Favorite, download) in same order everywhere. Show other airings for scheduling.
- Content footer for browsing during playback: subtle treatment (darken) for legibility; mark current item (badge/tinted progress bar); categories match EPG; symmetric invoke/dismiss (swipe up/swipe down).
- Instant visual feedback on channel change (confirms arrival, buys load time).
- Audio matches current context; stop when leaving live tab.
- EPG: current program, channel, time prominent with easy return to playback; effortless paging/scroll/jump; My Channels/Favorites; familiar categories (Movies, TV Shows, Kids, Sports, Popular); browse EPG without leaving content (PiP or background playback).
- Cloud DVR: start/stop recording from info panel; record future program from details view with choice of only that program or all future episodes; fine-grained rules (current episode, new episodes only, specific teams); play/delete/adjust settings from detail view; storage management control (delete watched/older than N days; auto-overwrite oldest or watched).

## Loading ([HIG](https://developer.apple.com/design/human-interface-guidelines/loading))
- Show something immediately: placeholder text/graphics/animation, replaced as content arrives.
- Load in background so people can keep using app/game.
- Unavoidably long loads: give something interesting (hints, tips, new features); estimate remaining time accurately so placeholder content is neither too short nor repeated.
- Download large assets in background (Background Assets framework) after install, on updates, at non-disruptive times.
- Over a moment or two: progress indicator; determinate when duration known, indeterminate otherwise.
- Games: consider custom loading view matching game style.

## Managing accounts ([HIG](https://developer.apple.com/design/human-interface-guidelines/managing-accounts))
- Require an account only if core functionality needs it. If required, consider Sign in with Apple.
- Explain benefits of account and how to sign up, briefly, in sign-in view.
- Delay sign-in as long as possible (e.g. browse first, sign in at purchase).
- Without Sign in with Apple: prefer passkeys (iOS/iPadOS/macOS); if passwords, add two-factor auth.
- Name the auth method on buttons ("Sign In with Face ID", not "Sign In"). Mention only methods available on the device (`LABiometryType`).
- Avoid in-app biometric opt-in setting (system-level already).
- Avoid calling account auth a "passcode" (device unlock term).
- Account created in app: **must** offer real deletion, not just deactivation; follow regional law (right to be forgotten). If law forces data retention or specific process, explain clearly.
- Deletion initiation in-app; if not possible, direct, easy-to-find link to web page (not buried in Privacy Policy/Terms). Sign in with Apple accounts: revoke tokens on deletion.
- Same deletion experience in-app and on web (no longer/more complex variant).
- Consider scheduled deletion; if offered, also offer immediate deletion.
- Say when deletion completes; notify when done.
- With in-app purchases: explain billing/cancellation on deletion (auto-renewing subscription keeps billing through Apple until cancelled; cancel or request refund after deletion); give how to cancel/manage purchases. Support deletion even if subscription was bought elsewhere.
- Other platforms (tvOS TV provider, tvOS sign-in, watchOS, visionOS): out of scope.

## Managing notifications ([HIG](https://developer.apple.com/design/human-interface-guidelines/managing-notifications))
- **Must** get permission before any notification. Users can change it in system settings, or silence all.
- Notification is available on arrival even if Focus delays the alert.
- Focus filters by time/activity; delivery scheduling = immediate or summary. People choose contacts/apps that break through.
- Classify: direct communication (calls, messages) = communication notification (SiriKit intents, `INSendMessageIntent`, `UNNotificationContentProviding`; delivery by sender); all else = noncommunication with **required** system interruption level.
- Interruption levels: Passive (view at leisure), Active (default; e.g. score update), Time Sensitive (directly impacts person, immediate attention; e.g. security issue, package delivery), Critical (urgent health/safety; rare; needs entitlement).

| Level | Overrides scheduled delivery | Breaks through Focus | Overrides Ring/Silent switch (iPhone, iPad) |
|---|---|---|---|
| Passive | No | No | No |
| Active | No | No | No |
| Time Sensitive | Yes | Yes | No |
| Critical | Yes | Yes | Yes |

- Represent urgency honestly; no high urgency for low-priority info.
- Time Sensitive only for events happening now or within an hour (`UNNotificationInterruptionLevel`). System explains it on first one and lets people turn it off, then re-prompts periodically.
- **Never** send marketing/promo notifications without explicit opt-in; ask via alert/modal/other UI describing content types with clear opt in/out.
- **Never** use Time Sensitive for marketing.
- **Must** provide in-app settings to change notification choice (see Settings).

## Modality ([HIG](https://developer.apple.com/design/human-interface-guidelines/modality))
- Use modal only with clear benefit: critical info, confirm/modify last action, narrow distinct task, immersion/concentration.
- Keep modal tasks simple, short, streamlined.
- Avoid "app within an app": no view hierarchies in modal; if subviews needed, single path, no buttons mistakable for dismiss.
- Full-screen modal for in-depth content or complex multistep task (video, photos, camera, markup, photo editing).
- **Must** give obvious dismiss: iOS/iPadOS button in top toolbar or swipe down; macOS button in main content view.
- Confirm before dismissal that could lose user content (e.g. iOS action sheet with save option), for gesture and button alike.
- Title (or descriptive text) naming the modal's task.
- Dismiss a modal before presenting another. **Never** more than one alert at once (alert may appear over other modals).
- Components: alert, sheet, popover, confirmation dialog/action sheet, activity view, separate window (iPadOS/macOS).

## Multitasking ([HIG](https://developer.apple.com/design/human-interface-guidelines/multitasking))
- Every app (rare exceptions: some games) **must** work well with multitasking; always be ready to save and restore context.
- Pause attention-demanding activity (games, media) on switch away; resume seamlessly.
- Audio interruptions: primary (music, podcasts, audiobooks) = pause indefinitely; short (GPS prompts) = duck or pause, then resume.
- Finish user-initiated tasks (downloads, video processing) in background before suspending.
- Notify sparingly: only for important/time-sensitive task completion; routine tasks no notification.
- iPhone: app switcher, Picture in Picture (FaceTime, video).
- iPadOS: several apps at once; multiple windows per app; full-screen or windowed (resizable, tiling controls, minimize, close; frontmost has colored controls + shadow on windows behind); PiP over all. Apps can't detect chosen configuration: adapt gracefully to any size (Layout, Windows).
- macOS: multitasking is default; layered windows with shadows and window-state visuals.

## Offering help ([HIG](https://developer.apple.com/design/human-interface-guidelines/offering-help))
- Match help to task: 1-2 step = inline description; complex/multistep = tutorial. Tie to current action; easy to dismiss/skip.
- Consistent, context-appropriate language and images (no "click" on iPhone, no "tap" menu item on Mac; no game-controller imagery for remote users).
- Inclusive help content.
- Don't explain standard components; describe what they do in your app. Unique controls/nonstandard input: prefer animation/graphics over long text.
- Tips (`TipKit`): small transient view for new/less-obvious features or faster ways. Popover tip preserves content flow; inline tip keeps surroundings visible (annotation-style points at a UI element; hint-style not tied to one).
- Tips only for simple features; more than 3 actions = too complex.
- Tips: short (1-2 sentences), actionable, engaging, direct action language; no promotional or off-flow content.
- Define eligibility rules (parameter/event-based); hide for people already using feature; set frequency (e.g. once every 24 hours).
- Include feature's symbol if people know it; prefer filled variant. If tip points directly to an image in the UI, don't repeat it in the tip (text-only).
- Tip buttons: link to settings or additional resources (e.g. setup flow).
- macOS (incl. iPhone/iPad apps on Mac) tooltips (help tags, `help(_:)`) on pointer hover: describe only that control; explain action starting with verb ("Restore default settings"); don't repeat control name; max 60 to 75 characters (localization changes length); sentence fragment, no articles; sentence case; omit ending punctuation for full sentences unless app style needs it; consider context-sensitive text per state.

## Onboarding ([HIG](https://developer.apple.com/design/human-interface-guidelines/onboarding))
- Ideal: no onboarding needed. If needed: fast, fun, optional. Happens after launch completes, not part of it.
- Teach through interactivity (safe try-out of action/feature/mechanic).
- Prefer context-specific tips (`TipKit`) over one flow; place instructions near the UI they refer to.
- Prerequisite flow: brief, enjoyable, little to memorize; don't over-teach.
- Separate tutorial: optional/skippable; if skipped, don't show again but keep findable (help, account, settings).
- Focus on your app, not how to use the OS/device.
- Splash screen: brief; just long enough to absorb at a glance.
- Don't let large downloads block onboarding; bundle enough content to start immediately.
- Avoid licensing details in onboarding (App Store shows agreements); if required, integrate without disruption.
- Postpone nonessential setup/customization; provide good defaults.
- Permission needed for core function: may ask in onboarding explaining why/benefit; otherwise ask when first needed (Requesting permission).
- Ask for ratings/purchases only after people experienced the app.

## Playing audio ([HIG](https://developer.apple.com/design/human-interface-guidelines/playing-audio))
- Silent mode: silence nonessential sound (keyboard clicks, effects, game soundtracks, ringtones); only user-initiated audio plays (media playback, alarms, audio/video messaging).
- System volume affects all sound incl. in-app effects (exception: iPhone ringer volume separate).
- Headphones: connect = reroute without interruption; disconnect = pause immediately.
- Adjust relative levels only; **never** change overall volume (system volume governs final output).
- Permit audio rerouting (stereo, car, Apple TV) unless compelling reason.
- Use system volume view (`MPVolumeView`): slider + route control; slider appearance customizable.
- Pick audio category (`AVAudioSession.Category`) to fit use; don't stop other apps' music unnecessarily.

| Category | Use | Silence switch | Mixes | Background |
|---|---|---|---|---|
| Solo ambient | nonessential sound, silences others (game soundtrack) | Responds | No | No |
| Ambient | nonessential, doesn't silence others (user's own music instead of soundtrack) | Responds | Yes | No |
| Playback | essential sound (audiobook, language app) | Ignores | Maybe | Plays |
| Record | recording (notes app; switch to playback for playback) | Ignores | No | Records |
| Play and record | both, maybe simultaneously (messaging, video calls) | Ignores | Maybe | Records and plays |

- Respond to external audio controls (Control Center, headphones) only when actively playing, in clear audio context, or connected to Bluetooth/AirPlay device; else don't halt other apps' audio.
- Avoid repurposing audio controls; ignore unsupported ones.
- Custom player controls only for unsupported commands (custom skip increments, related content like score).
- After temporary audio, signal others to resume (`notifyOthersOnDeactivation`).
- Interruptions: decide handling (e.g. recording apps can defer interruption for calls unless accepted). VoIP: end call when iPad Smart Folio closes (mic auto-mutes); **never** restart audio session on reopen (would unmute mic silently). See Handling audio interruptions.
- On interruption end, decide resume: resumable (phone call) vs nonresumable (new playlist). Media apps check resumable (`shouldResume`); games may resume without checking.
- iOS/iPadOS: use Audio Services for short sounds and vibrations.
- macOS: notification sounds mix with other audio by default.
- **Never** convey important info by sound alone (also Accessibility).
- Other platforms (tvOS, visionOS, watchOS): out of scope.

## Playing haptics ([HIG](https://developer.apple.com/design/human-interface-guidelines/playing-haptics))
- Use system haptic patterns only for documented meanings; otherwise generic or custom pattern.
- Consistent cause-and-effect: same haptic = same kind of event (don't reuse failure haptic for success).
- Complement visual/audio feedback: match haptic intensity and sharpness to the animation; sync with sound.
- Don't overuse; best haptics are unnoticed but missed when off. User-test frequency.
- Prefer short haptics for discrete events; avoid long-running in apps (dilutes meaning; Apple Pencil Pro continuous haptics unpleasant). Long-running OK in gameplay flow.
- **Must** make haptics optional (mute/off) and app usable without them.
- Haptics must not disrupt camera, gyroscope, microphone experiences.
- Custom (Core Haptics): transient (taps) and continuous (sustained) events; each with sharpness (soft/rounded/organic vs crisp/precise/mechanical) and intensity; optional audio; vary dynamically with input/context.
- iOS (supported iPhone): standard components (toggles, sliders, pickers) play haptics by default; `UIFeedbackGenerator` categories: Notification (task outcome, e.g. check deposit, unlock), Impact (physical metaphor: snap, collision), Selection (values changing).
- macOS (Magic Trackpad), `NSHapticFeedbackPerformer`, on drag or force click:

| Pattern | Use |
|---|---|
| Alignment | dragged item aligns (shape snap, fit to dimensions, preferred position, scrubber/min/max limits) |
| Level change | discrete pressure levels (fast-forward speed steps) |
| Generic | general feedback when others don't apply |

- iPadOS: game controllers, Apple Pencil, some trackpads can play haptics on certain iPad models.
- watchOS: out of scope.

## Playing video ([HIG](https://developer.apple.com/design/human-interface-guidelines/playing-video))
- Use system video player (AVKit); custom player must mirror system behavior and interface so habits carry over.
- Default modes by aspect ratio: full-screen/aspect-fill (`resizeAspectFill`, crops edges): wide 2:1 through 2.40:1. Fit-to-screen/aspect (`resizeAspect`, letter/pillarbox): standard 4:3, 16:9, up to 2:1, and ultrawide above 2.40:1. People can switch modes; PiP supported.
- **Always** show video at original aspect ratio; avoid embedded letterbox/pillarbox padding in the video frame (shrinks video in both modes, breaks edge-to-edge contexts like iPad PiP).
- Add extra info (image, title, description) via `externalMetadata` only when valuable; don't obscure playback.
- Support expected input: Space on a hardware keyboard toggles play/pause (Mac, iPhone, iPad, etc.).
- Avoid audio mixing when switching modes (e.g. PiP video unmuted while a game plays music): handle secondary audio (`silenceSecondaryAudioHintNotification`).
- TV app integration (playback started from TV app): show your own black screen immediately (no launch screen shown); jump straight to content, no splash/detail/intro; never ask whether to resume, resume automatically; Space on Bluetooth keyboard plays/pauses; switch to the profile specified in request (if none, ask viewer to choose); resume long clips at previous end time.
- Loading: avoid loading screens; if over 2 seconds, black screen with centered spinner, no surrounding content; start playback as soon as enough loaded, load rest in background; minimal branding, keep black background.
- Exiting playback: user stays in your app; show contextual screen (content detail view with resume option; else menu listing it, else main menu). Prepare exit view right after receiving playback notification (user may exit immediately).
- tvOS/visionOS/watchOS specifics: out of scope.

## Printing ([HIG](https://developer.apple.com/design/human-interface-guidelines/printing))
- Make printing discoverable in standard places: macOS File menu Print item; iOS/iPadOS toolbar button opening action sheet. macOS toolbar Print button: optional, user-addable via customization.
- Offer print only when possible: dim Print in File menu / remove from iOS action sheet when nothing to print or no printers; custom print button: dim or hide.
- Present relevant options (page range, copies, double-sided) in system print view when printer supports them.
- macOS: custom print panel category for app-specific options, uniquely named (e.g. app name; Keynote: presenter notes, slide backgrounds, skipped slides).
- macOS: page setup dialog for rarely changed per-document settings (size, orientation, scaling); don't duplicate system options (orientation, reverse order).
- macOS: make option interdependencies clear (double-sided disables transparencies).
- macOS: hide advanced options behind disclosure control labeled "Advanced Options".
- macOS: consider live preview of setting effect (thumbnail).
- macOS: consider storing modified print settings with document; at minimum until it closes.

## Ratings and reviews ([HIG](https://developer.apple.com/design/human-interface-guidelines/ratings-and-reviews))
- Ask only after demonstrated engagement (level done, significant task; launch count, features explored, tasks completed). Avoid first launch and onboarding.
- Don't interrupt tasks/gameplay; ask at natural breaks.
- Don't pester: at least a week or two between requests, and only after more engagement.
- Prefer system prompt (`RequestReviewAction`): single tap/click to rate or dismiss, optional written review, users can opt out for all apps; system caps at 3 displays per app per 365 days.
- Resetting summary rating on new version: weigh current-version accuracy vs fewer ratings overall.

## Searching ([HIG](https://developer.apple.com/design/human-interface-guidelines/searching))
- Use a search field for in-app search; personalize with recent searches, suggestions, completions, corrections. Scope/filter via scope bars and tokens (date, size, type). Find-in-document for windows/pages.
- If search is important, give it primary position (e.g. bottom toolbar in Notes; dedicated tab in tab-bar apps).
- One clearly identified place to search all content; local search (filter of current view) still OK for distinct sections.
- Show current scope: descriptive placeholder, scope bar/tokens, or title.
- Provide suggestions: recent searches before typing, predictive while typing (`searchSuggestions(_:)`).
- Search history privacy: consider who may see it; offer a way to clear it.
- Spotlight: make content indexable with metadata (Core Spotlight); `CSImportExtension` file importer for custom file types; optionally Spotlight-powered search from current selection with custom results view.
- Prefer system open/save views (built-in system-wide search field).
- Quick Look generator for custom file types.

## Settings ([HIG](https://developer.apple.com/design/human-interface-guidelines/settings))
- Defaults serve most people; ideally no adjustment needed (games: auto-optimize performance for device).
- Minimize number of settings.
- iOS/iPadOS/macOS with hardware keyboard: Command-Comma (,) opens settings; games often Esc.
- Avoid asking in settings for info you can detect (connected controller, Dark Mode).
- Respect systemwide settings (accessibility, scrolling, authentication); avoid duplicating them in custom settings.
- Custom settings area: general, infrequently changed options (window config, game saving, key mappings, account).
- Task-specific options (show/hide parts of view, reorder, filter) live in the screen they affect, not in settings.
- System Settings app: only most rarely changed options; consider button that opens it from your UI.
- macOS: settings window opened by App menu Settings item (File menu if document-level options). Avoid settings buttons to window toolbars.
- macOS: Command-Comma opens it; dim minimize and maximize buttons.
- macOS: settings toolbar noncustomizable, always visible, always marks active pane button; panes group related settings.
- macOS: window title = current pane name; single pane: "App Name Settings".
- macOS: restore last viewed pane on open.

## Undo and redo ([HIG](https://developer.apple.com/design/human-interface-guidelines/undo-and-redo))
- Make results predictable: iPhone shake alert describes outcome with undo/cancel; menu labels name action (Undo Typing, Redo Bold).
- Show results of undo/redo; if affected content offscreen, scroll to it/highlight (e.g. restored deleted paragraph).
- Allow multiple undo/redo; no unnecessary limit; back to last logical step (open, save).
- Consider reverting batches (incremental changes to one property) or all changes since open/save.
- Dedicated undo/redo buttons only if necessary; use standard system symbols, in a toolbar. Standard routes: macOS Edit menu, keyboard shortcuts (Mac, iPad), iPhone shake.
- iOS/iPadOS: avoid redefining standard gestures (three-finger swipe, shake).
- iOS/iPadOS: alert title = system prefix "Undo "/"Redo " + a word or two naming operation (e.g. "Undo Name", "Redo Address Change").
- macOS: undo/redo at top of Edit menu; Command-Z undo, Shift-Command-Z redo.

## Workouts ([HIG](https://developer.apple.com/design/human-interface-guidelines/workouts))
- Page is watchOS-first (workout sessions, controls, Activity rings); only generic carry-over for iOS/iPadOS fitness UI:
- Large font, high contrast, most important info first when user in motion.
- Summary at session end confirming completion and recorded data; discard or ask about extremely brief sessions.
- Use Activity rings only for documented purpose (colors and meanings match Activity app).
- Explain missing sensor data (e.g. no heart rate) in clear language.

## Designing for games ([HIG](https://developer.apple.com/design/human-interface-guidelines/designing-for-games))
- Let people play as soon as installation completes: ship as much playable content as possible in the initial install, keeping the download to 30 minutes or less.
- Choose good defaults from the device (e.g. resolution) so people can start without changing settings.
- Teach through play: fold configuration and onboarding into a playable tutorial; a written tutorial is a reference, never a prerequisite.
- Defer permission requests (sensors, personal data) until the feature needs them, with a clear reason.
- Text and buttons: platform default and minimum sizes apply in games too (`platforms/<os>.md`).
- Prefer resolution-independent textures and graphics; otherwise match the device resolution.
- Lay out around device features (rounded corners, camera housing) with the platform's safe areas.
- In-game menus must stay legible and usable at every aspect ratio (e.g. 16:10, 19.5:9, 4:3).
- Support full-screen play on macOS, iOS and iPadOS.
- Default interaction: iOS touch (+ game controller); iPadOS touch (+ controller, keyboard, mouse, trackpad, Apple Pencil); macOS keyboard, mouse, trackpad (+ controller). Support the default; offer the others.
- Support physical game controllers, and always offer an alternative (touch, keyboard and mouse) so a controller is never required.
- iPhone and iPad: touch controls that work with the touchscreen (direct interaction, virtual controls only where needed); details in `inputs.md` Game controls.
- Perceivability: never rely on color alone; give cutscenes descriptive subtitles. Let players customize type size, control mapping, motion intensity and sound balance.
- Representation: support a wide range of identities in avatars and names; avoid stereotypes in characters and stories.
- Consider Game Center, GameSave (resume on any device), Core Haptics and Spatial Audio (`technologies.md`).
