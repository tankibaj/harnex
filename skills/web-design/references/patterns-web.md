# Patterns for the web

last-checked: 2026-10-25
scope: HIG interaction patterns that transfer to web apps, translated to HTML/CSS/ARIA and web APIs. Settled conflicts (dialog button order, undo over confirm, permissions in context, no splash): see SKILL.md. Component specifics: components-web.md. Native-only pages (live-viewing apps, haptics, Wallet-style launchers, workouts, game controls) skipped.

## Entering data ([HIG](https://developer.apple.com/design/human-interface-guidelines/entering-data))
- Minimize typing: prefill from what you already know, use `autocomplete`, accept paste and drag and drop, support every input method (voice, keyboard, touch).
- Take data from the platform (user settings, permissioned geolocation) instead of asking.
- Say what is needed: visible label ("Email"), optional example as placeholder ("name@company.com"); prefill sensible defaults.
- Sensitive data: `type="password"`, obscured. **Never** prepopulate a password field; use passkeys/credential manager.
- Prefer choices (select, radios, segmented, date picker) to free text.
- Validate dynamically, give feedback as soon as a problem is detectable and the person has finished the field (blur or pause); correct inline, next to the field (`aria-invalid`, `aria-describedby`, error summary for long forms).
- Numeric data: constrain with `type`/`inputmode`/`pattern`; display decimals, percent, currency by locale (`Intl.NumberFormat`).
- Required data: mark it clearly (text, not only an asterisk); enable Next/Continue only when required fields are complete, or keep it enabled and explain what is missing on press (see components-web.md Buttons).
- Expansion tooltip or wrap for clipped field text.

## Feedback ([HIG](https://developer.apple.com/design/human-interface-guidelines/feedback))
- Match delivery to significance: passive status text for routine state; an interrupting dialog only for possible data loss.
- Multiple channels: color + icon + text; sound/haptics never the only one; work in silence and with a screen reader (live regions: `role="status"` polite, `role="alert"` assertive only for urgent).
- Show status near the thing it describes (last synced time next to the list, unread count on its nav item).
- Dialogs only for critical, ideally actionable info; overuse dulls them.
- Warn before unexpected irreversible data loss; **never** warn when loss is the expected result of the action.
- Confirm completion only for significant tasks (payment, send); people expect success, so mainly surface failure.
- When a command can't run, say so and why (disabled controls need a reachable explanation: `aria-describedby`, tooltip on focus).

## Loading ([HIG](https://developer.apple.com/design/human-interface-guidelines/loading))
- Show something immediately: skeletons/placeholder text and shapes replaced as content arrives; keep layout stable (reserve space).
- Load in the background so people can keep using the app; stream/paginate; prefetch likely next views.
- Unavoidable long waits: give something useful (tips, what's new) and an accurate time estimate.
- Over a moment or two: a progress indicator; determinate when known (see components-web.md Progress indicators).
- Large assets: download in the background at non-disruptive times (lazy load, service worker precache), never blocking first use.
- Specific wording ("Loading your invoices"), not "Please wait".
- Announce completion to assistive tech with a live region, move focus only when the person's task requires it.

## Modality ([HIG](https://developer.apple.com/design/human-interface-guidelines/modality))
- Use a modal only with clear benefit: critical info, confirm/modify the last action, a narrow distinct task, immersion/concentration.
- Keep modal tasks simple, short, streamlined. Avoid an "app within an app": no view hierarchies in a modal; if subviews are needed, a single path with no buttons mistakable for dismiss.
- Full-page/route modals for in-depth or multistep tasks (media, editing, long forms).
- **Must** give an obvious dismiss: a visible close/Cancel button in the dialog; Esc; backdrop click when no data can be lost.
- Confirm before a dismissal that would lose content, for gesture and button alike.
- Title naming the modal's task; `aria-labelledby`; modal `<dialog>` with inert background, focus moved in and returned on close.
- Dismiss a modal before presenting another. **Never** more than one alert at once (an alert may sit above another modal).
- Components: alertdialog, sheet (modal `<dialog>`), popover, action sheet/confirm dialog, share UI. See components-web.md.

## Searching ([HIG](https://developer.apple.com/design/human-interface-guidelines/searching))
- Use a search field for in-app search; personalize with recent searches, suggestions, completions, corrections. Narrow with scope filters and tokens (date, size, type). Find-in-page for long documents (don't override browser Find unless needed).
- If search is important give it a primary position (header, top of sidebar, dedicated page).
- One clearly identified place to search all content; local filters for distinct sections are fine.
- Show current scope: descriptive placeholder, scope control, chips, or heading.
- Suggestions: recent searches before typing, predictive while typing (ARIA combobox).
- Search history privacy: consider who may see it on shared devices; offer a way to clear it.
- Make content indexable: semantic markup, structured data, sitemaps so external search can find it.

## Settings ([HIG](https://developer.apple.com/design/human-interface-guidelines/settings))
- Defaults serve most people; ideally no adjustment needed. Minimize the number of settings.
- **Never** ask for what you can detect (`prefers-color-scheme`, `prefers-reduced-motion`, language, time zone); respect system settings, don't duplicate them. A theme override is fine as an override of "system".
- Settings area: general, infrequently changed options (account, notifications, integrations, shortcuts). Task-specific options (show/hide columns, sort, filter, reorder) live on the screen they affect.
- Reachable from a stable place (account/profile menu); **never** a settings button in a content toolbar's action cluster. Keyboard shortcut optional (see components-web.md Keyboard shortcuts; `⌘,` conflicts with browser settings on macOS).
- Group related settings into sections/pages; page title = current section; remember the last visited section.
- Apply immediately with feedback (autosave) for toggles; explicit Save only for transactions or multi-field forms.
- Notification choice **must** be changeable here (see Managing notifications).

## Undo and redo ([HIG](https://developer.apple.com/design/human-interface-guidelines/undo-and-redo))
- Make results predictable: labels name the action ("Undo Delete Row", "Redo Bold").
- Show what changed: if the affected content is offscreen scroll to it and highlight (restored paragraph, row).
- Multiple levels; no needless limit; back to the last logical step (open, save). Consider reverting batches or all changes since open.
- Standard routes: Cmd/Ctrl+Z, Shift+Cmd/Ctrl+Z (Ctrl+Y on Windows), edit menu items. Dedicated undo/redo buttons only if necessary, in a toolbar, with standard symbols and `aria-label`.
- For reversible destructive actions use a toast with an Undo button that lasts long enough to reach by keyboard and screen reader (not auto-dismiss in 3 seconds; `role="status"`); see SKILL.md.
- **Never** redefine standard gestures (shake, three-finger swipe) or native text undo in inputs.

## Onboarding ([HIG](https://developer.apple.com/design/human-interface-guidelines/onboarding))
- Ideal: none needed. If needed: fast, fun, optional. After the page is usable, never part of load. No forced tours (SKILL.md).
- Teach through interactivity: let people safely try the action.
- Prefer context-specific tips near the UI they refer to over a single flow.
- Prerequisite flow: brief, little to memorize, no over-teaching.
- A separate tutorial is optional and skippable; once skipped, don't show again but keep it findable (Help, account, settings).
- Focus on your product, not on how to use the browser or OS.
- Large downloads never block onboarding; ship enough to start immediately.
- Postpone nonessential setup; give good defaults. Avoid licensing details in onboarding; integrate required agreements without disruption.
- Permission needed for a core function: may ask in onboarding with the reason; otherwise ask when first needed.
- Ask for ratings or purchases only after people experienced the product.

## Offering help ([HIG](https://developer.apple.com/design/human-interface-guidelines/offering-help))
- Match help to the task: 1-2 steps = inline description; complex = tutorial. Tie it to the current action; easy to dismiss or skip.
- Consistent, input-appropriate language ("tap" vs "click": use "select"/"choose" when input is unknown); no device-specific imagery. Inclusive content.
- Don't explain standard components; describe what they do in your app. Unusual controls: animation/graphics over long text.
- Tips (inline callouts or popovers): for new or less-obvious features or faster ways. Simple features only (more than 3 actions is too complex). 1-2 sentences, actionable, direct, no promotion or off-flow content.
- Tip rules: define eligibility (hide once the person uses the feature), set frequency (e.g. once every 24 hours), never repeat dismissed tips. A tip pointing at an icon in the UI doesn't repeat the icon.
- Tip buttons link to settings or more resources.
- Tooltips (on hover and focus, not touch-only): describe only that control; start with a verb ("Restore default settings"); don't repeat the control's name; max 60 to 75 characters; sentence fragment, no articles, sentence case; consider state-specific text. Implement with `aria-describedby` (not `title` alone), dismissable with Esc, hoverable (WCAG 1.4.13). Never the only place essential info lives.

## Managing accounts ([HIG](https://developer.apple.com/design/human-interface-guidelines/managing-accounts))
- Require an account only if core functionality needs it. Explain briefly in the sign-in view what the account gives and how to sign up.
- Delay sign-in as long as possible (browse first, sign in at purchase or save). Offer sign-in with third-party identity providers alongside others.
- Without a federated provider: prefer passkeys (WebAuthn, `autocomplete="username webauthn"`, conditional UI); if passwords, add two-factor authentication. Support password managers (`autocomplete`, no paste blocking).
- Name the method on buttons ("Sign in with a passkey", not "Sign In"); mention only methods available on the device.
- Don't add your own biometric opt-in setting; the platform handles it. **Never** call account authentication a "passcode".
- Account created on the site: **must** offer real deletion, not just deactivation; follow regional law (right to erasure). If law forces retention or a specific process, explain clearly.
- Deletion starts in the product; if impossible, a direct, easy-to-find link (not buried in Privacy Policy or Terms). Same experience on every surface. Revoke provider tokens on deletion.
- Consider scheduled deletion; if offered, also offer immediate deletion. Say when deletion completes and notify when done.
- With subscriptions: explain billing and cancellation on deletion, how to cancel or manage purchases; support deletion even if bought elsewhere.
- Show sign-in state (which method) in account settings.

## Managing notifications ([HIG](https://developer.apple.com/design/human-interface-guidelines/managing-notifications), [Notifications](https://developer.apple.com/design/human-interface-guidelines/notifications))
- **Must** get permission before any notification (Notifications API / Push API, `Notification.requestPermission()` only from a user gesture, in context with the benefit explained first; ask again never after denial, point to browser settings instead).
- **Must** provide in-app settings to change the choice and the categories (see Settings). Marketing/promotional notifications **never** without explicit opt-in; describe content types with clear opt-in/out.
- Urgency: Passive (view at leisure), Active (default), Time Sensitive (directly affects the person, needs attention now or within an hour; security issue, delivery), Critical (health/safety; rare). Represent urgency honestly; **never** high urgency for marketing. On the web map this to `Notification.requireInteraction`, `urgency` header on Web Push, and silent badge updates; reserve interaction-required notifications for urgent items.
- Concise, informative content. **Never** several notifications for the same thing; coalesce with `tag`/`renotify`.
- **Never** include sensitive/personal/confidential info (lock screens and shared devices).
- Don't tell people to perform in-app tasks; offer notification actions for simple ones (up to four, beneficial, short title-case labels, not "Open"). Prefer nondestructive actions.
- Errors go in the UI, not in notifications.
- When the page is foreground, don't show a system notification; update the view discoverably (badge, inserted item).
- Title: short, contextual (headline, event, subject); no app name or icon in the body. Body: complete sentences, no truncation, generic text where content is sensitive.
- Sound optional, short, never carries important info alone.
- Badge (app badge API): only unread-notification counts (never dates, scores, prices); keep current; clear when read; never the only channel for essential info.
- Notification is available on arrival even if delivery is delayed.

## Drag and drop ([HIG](https://developer.apple.com/design/human-interface-guidelines/drag-and-drop))
- Support drag and drop where people expect it (reorder, move into folder, upload). HTML5 DnD or pointer events; text inputs keep native behavior.
- **Must** offer a non-drag alternative for every drag action: menu "Move to…", Up/Down buttons, keyboard pick-up (Space/Enter to lift, arrows, Space to drop, Esc to cancel) with live-region announcements. Announce state through live regions and button labels, not `aria-grabbed` (deprecated).
- Default semantics: within the same container = move; across containers = copy; between apps = copy. Change defaults only toward less frustration and data loss. Alt/Option at drop forces copy.
- Multi-item drag where sensible; group the dragged items visually (stack with count badge).
- Prefer undo for drops; confirm before irreversible ones; if no undo, offer reversal.
- Drag preview appears after about 3 px of movement, semi-transparent, kept until drop; may preview the result but avoid radical constant changes.
- Show whether the target accepts: highlight or insertion line only on acceptable targets (`dropEffect`, `not-allowed` cursor otherwise); one highlighted target at a time; remove highlight when leaving.
- Invalid or failed drop: visible feedback (item returns to source, fades).
- Auto-scroll scrollable targets while dragging near the edge; stop when leaving.
- Accept the richest representation you can; fall back to simpler (files, then text, then URL). Extract only the relevant part (contact → name and email).
- Slow transfers: progress and a placeholder at the drop position; a drop that starts a task shows it began.
- Dropped text keeps its style if both sides support it, else adopts the destination style.
- After drop the content stays selected in the destination; move disappears from origin.
- Spring loading: hovering a dragged item over a tab/button for a moment activates it.
- Don't require a pause to start a drag; allow select-and-drag in one motion.

## File management ([HIG](https://developer.apple.com/design/human-interface-guidelines/file-management))
- Save automatically: periodically while editing, on blur, on `visibilitychange: hidden`, before unload; no explicit Save needed unless the person cancels or deletes. Show a quiet "Saved"/"Saving…" status, not a dot-on-close model. If a document has explicit save, show unsaved state (title marker "Edited") and remove it as soon as saved.
- Always have an obvious New/Add button; Open via file picker (`<input type="file">`, File System Access API) plus shortcuts where the app is editor-like.
- Custom file browser mirrors the OS mental model; open at a relevant location (recent, last used) but let people reach everything.
- File extensions: show by default in lists where people need them; allow hiding where unneeded; reflect the choice in save/open UI.
- Save UI: editable name (default "Untitled"), format chooser when several formats, logical default location.
- Provide previews for files the app can't open.
- Open UI conveniences: recent files, filters, multi-select, custom button title ("Insert").

## Going full screen ([HIG](https://developer.apple.com/design/human-interface-guidelines/going-full-screen))
- Offer it for media (video, slideshows), games, in-depth focus tasks (Fullscreen API on a user gesture, `requestFullscreen`; `Esc` always exits).
- Layout may adapt subtly (proportions, not which items appear); **never** resize the window programmatically.
- Keep essential controls accessible or easy to reveal (hover/tap, bottom controls).
- Resume where left on return; pause media/games when the tab is hidden.
- Exit only when people choose; no auto-exit when switching or on activity end.
- May hide toolbars for content focus (reading, photos); restore via a familiar gesture (tap, move cursor to the edge) with a visible hint; keep controls visible when essential.
- Let people choose when to enter: a visible Full screen button and a shortcut (`F`); no custom window-mode menus.

## Launching ([HIG](https://developer.apple.com/design/human-interface-guidelines/launching))
- Load fast: people won't wait more than a couple of seconds. Render the shell and meaningful content first (see Loading).
- Restore previous state in detail: route, scroll position, selection, drafts, open panels (URL + `sessionStorage`/server state).
- **No** splash screen (SKILL.md). If a loading frame is unavoidable: nearly identical to the first screen (avoid flash), no text, no logos or branding beyond the first screen's own.
- Match color scheme and viewport at first paint (`color-scheme`, inline critical CSS) to avoid a flash.

## Multitasking ([HIG](https://developer.apple.com/design/human-interface-guidelines/multitasking))
- Always be ready to save and restore context (tab discarded, backgrounded, mobile app switch): autosave on `visibilitychange`/`pagehide`, restore on `pageshow`.
- Pause attention-demanding activity (media, games, timers) on `visibilitychange: hidden`; resume seamlessly on return.
- Audio interruption: primary media (music, podcasts) pauses; short prompts duck or pause then resume. Media Session API for system controls.
- Finish user-initiated tasks (uploads, downloads, processing) in the background; use Background Fetch/Sync or keep the tab alive with a warning; confirm via notification only if important and permitted.
- Notify sparingly: only important or time-sensitive task completion.
- Picture-in-Picture for video where useful. Layout adapts to any window size/split (container queries); never assume a width.

## Playing audio and video ([audio](https://developer.apple.com/design/human-interface-guidelines/playing-audio), [video](https://developer.apple.com/design/human-interface-guidelines/playing-video))
- **No autoplay with sound.** Media starts on user action; muted autoplay only for decorative video, with a pause control (WCAG 2.2.2).
- Only user-initiated audio is essential; sound effects/keyboard clicks are optional and off by default, with a mute setting. **Never** convey important info by sound alone (captions, visual cues).
- Respect system volume: adjust relative levels only, **never** override master volume. Allow output rerouting (Remote Playback, `setSinkId`).
- Pause on output disconnect where the API reports it; don't stop other audio unnecessarily.
- Respond to media keys and system controls (Media Session API) only when actively playing; **never** repurpose them; custom controls only for unsupported commands (custom skip, related info).
- Video: use native `<video controls>` or mirror its behavior and keyboard (Space toggles play/pause, arrows seek, `F` fullscreen, `M` mute); never remove standard controls without replacing them.
- Show video at its original aspect ratio (`object-fit: contain`); **never** bake letterbox/pillarbox bars into the frame.
- Extra info (title, description) only when valuable and must not obscure playback.
- Avoid loading screens; if over 2 seconds, show a neutral background with a centered spinner and nothing else; start playback as soon as enough data is buffered.
- Exiting playback keeps the person in your site on a contextual page (detail view with resume).
- Provide captions/subtitles and audio description (see a11y.md); don't auto-resume with sound after interruption unless the person was listening.

## Printing ([HIG](https://developer.apple.com/design/human-interface-guidelines/printing))
- Make printing discoverable in standard places (a Print item in a menu, `Ctrl/Cmd+P` untouched). Offer it only when possible: hide or disable Print when there is nothing to print.
- Provide `@media print` styles: remove nav/chrome/interactive elements, black text on white, show link URLs where useful, `break-inside: avoid` for key blocks, `@page` size and margins. Let the browser dialog own copies, range, duplex, orientation.
- Custom print views: preview of the result; options that matter for the content only; make interdependencies clear; hide advanced options behind a disclosure "Advanced Options".
- Consider storing modified print settings with the document.

## Ratings and reviews ([HIG](https://developer.apple.com/design/human-interface-guidelines/ratings-and-reviews))
- Ask only after demonstrated engagement (task completed, repeated use); **never** on first visit or during onboarding.
- Don't interrupt tasks; ask at natural breaks. Don't pester: at least a week or two between requests, and only after more engagement.
- One tap/click to rate or dismiss, optional written review; remember dismissal. Let people opt out.

## Charting data ([HIG](https://developer.apple.com/design/human-interface-guidelines/charting-data))
- Chart only to highlight something about a dataset; plain data with no analysis goal belongs in a list/table people can scroll, search, sort.
- Keep it simple; reveal detail gradually (detail levels, subsets). Interactive charts: offer simpler versions first to teach interaction.
- **Must** be accessible: labels for values and components, keyboard-operable interaction, text summary and data table alternative (components-web.md Charts).
- Prefer common types (bar, line); teach novel ones (animate parts separately).
- Examine at macro (totals, averages), mid (subsets), micro (single values) levels and surface details for each.
- Add descriptive text (title, subtitle, annotations, headline takeaway); doesn't replace accessible labels.
- Size to function: large enough for labels and interaction; small for glanceable previews of a larger version.
- Consistent across charts of similar purpose; the same dataset in several charts keeps type, colors, marks, annotations, layout and text.

## Collaboration and sharing ([HIG](https://developer.apple.com/design/human-interface-guidelines/collaboration-and-sharing))
- Use the system share UI (Web Share API) with a copy-link fallback; support stable, shareable URLs (deep links).
- Share button in a convenient, consistent place (toolbar). Offer only the share types you support.
- Permission summary in a succinct phrase ("Only invited people can edit", "Everyone can make changes"); few simple options grouped for at-a-glance reading: who can access, edit vs read, whether collaborators can add people.
- Show a collaboration affordance prominently once collaboration starts, next to Share: collaborators list, middle area with essential custom items (recent updates summary), bottom manage-access button.
- Consider notifications for collaboration events (content change, membership change, mention) with a link to the relevant view.
- Presence and cursors: identify people with name plus color and not color alone.

## Generative AI features ([HIG](https://developer.apple.com/design/human-interface-guidelines/generative-ai))
- Offer generative features only where value is clear (time savings, communication, creativity). Always provide a good non-AI path when AI is unavailable or declined; AI features optional.
- Keep people in control: honor in-scope requests, let them dismiss, revert, retry; label clearly where AI is used. **Never** pass AI output off as human-authored; follow disclosure rules.
- Set expectations: capabilities and limits up front, starter suggestions/examples for open-ended prompts, why weak results occur.
- Privacy: say what is sent to a server, show what's shared, minimize data, disclose storage and training use; ask permission before using personal or usage data; explicit permission for model improvement; clear opt-out; stricter for children.
- Inclusivity: ask for personal or cultural traits instead of inferring; test with diverse people and datasets.
- Hallucinations: warn that content may contain errors; scope generation tightly; avoid factual claims without verified sources; no AI where a mistake could harm.
- Confirm before significant, irreversible or hard-to-undo actions (delete, purchase); don't automate those.
- Outputs: Edit, Undo, Retry, Adjust near the generated content; acknowledge when corrections take effect. When a request is blocked, coach a better request with examples; test for misuse (vague, harmful, out-of-scope prompts).
- Avoid replicating copyrighted content (curated prompts, model protections).
- Latency: generation is slow; design loading or background generation; specific progress text ("Summarizing key themes from your notes"), not "Processing…"; on error plain language plus the next step. Streaming output with a stop button; announce via `aria-live="polite"` sparingly.
- Consider several meaningful alternatives. Voluntary, unobtrusive feedback (thumbs, optional details); keep the model swappable behind the UX.

## ML feedback and confidence UX ([HIG](https://developer.apple.com/design/human-interface-guidelines/machine-learning))
- Define ML's role first: critical vs complementary, private vs public, proactive vs reactive, visible vs invisible, dynamic vs static. Higher stakes need higher accuracy and tighter privacy.
- Explicit feedback: only when necessary, **always** voluntary; describe options by consequence ("Suggest fewer pop songs", "Mute politics for a week"), not "dislike"; offer several progressively specific options; act immediately and persist.
- Implicit feedback: secure the data, explain how it's gathered and shared, give ways to restrict flow; don't narrow exploration (reinforcement loops); use several signals; withhold private suggestions on shared devices; prioritize recent behavior; beware confirmation bias.
- Calibration only when the feature can't work without it: explain why, collect the minimum, do it early, quick and easy with visible progress, never blame, cancel anytime, let people update or remove data later.
- Mistakes: anticipate them; match correction tools to the consequence; make frequent errors easy to fix; extra care for proactive features.
- Corrections: show the steps/controls the automation used so they're familiar; show the corrected result immediately and persist; allow correcting corrections; prefer guided corrections (alternatives list) to freeform; **never** rely on corrections to cover poor quality.
- Multiple options: diverse options, most likely first (preselect if sensible), fit on one screen, distinguishable with brief differences; learn from selection.
- Confidence: verify it correlates with quality before showing it; translate to familiar concepts (attribution "Because you read mysteries", ranking, "high chance"/"low chance"); numbers only where expected (weather, polls); adapt by threshold (ask to confirm when low; don't show low-confidence results for proactive suggestions).
- Attribution: basis for a result without explaining the model; factual, objective, neither too specific (feels like watching) nor too general; no jargon.
- Limitations: set expectations before use; show how to get best results (placeholder examples, live hints such as "Low light"); offer alternatives instead of no results; explain why results are poor.
