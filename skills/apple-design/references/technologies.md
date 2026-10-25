# Technologies

last-checked: 2026-10-25
scope: Apple HIG technology pages (AirPlay to Wallet) for iOS, iPadOS, macOS; carplay and other-platform rules omitted. Other platforms: out of scope.

## AirPlay ([HIG](https://developer.apple.com/design/human-interface-guidelines/airplay))
- Prefer system media player (`AVPlayerViewController`); custom player only if it can't meet needs.
- Offer full HLS resolution range; AVFoundation picks per device. 720p-only looks poor on 4K TV.
- Stream only content people expect; no background loops / in-app-only short videos (`usesExternalPlaybackWhileExternalScreenIsActive`).
- Support both AirPlay streaming and mirroring.
- Support remote command center events (lock screen, Siri, HomePod play/pause/ff).
- Never stop playback on background or device lock; avoid automatic mirroring then.
- Never interrupt another app's playback unless starting immersive content; launch/inline autoplay stays local, current playback continues (`ambient`).
- Keep app usable during AirPlay; other in-app videos must not start and interrupt the stream.
- Custom player: custom AirPlay button must match system button look/behavior, distinct states (start, playing, unavailable). Use only Apple-provided symbols. Place AirPlay icon lower-right (iOS/iPadOS 16+).
- Icon colors: black on white/light bg when other tech icons are black; white on black/dark bg when others white; custom color when others share it. Two variants: audio (triangle under 3 arcs), video (triangle under rounded rect).
- Position icon consistently with other technology icons; may use same shape container as others.
- **Never** use AirPlay icon or name in custom buttons/interactive elements; noninteractive only.
- Name with icon: beside/below only if other technologies are shown so; same font as layout. No icon inside text or replacing the name.
- Make AirPlay references less prominent than your app name/identity.
- Name: "AirPlay" (capital A, P). All-caps allowed only if layout is all-caps. Always a noun: "Use AirPlay to listen on your speaker"; not "AirPlay to your speaker", "You can AirPlay with [App]".
- Verbs: works with, use, supports, compatible: "[App] is compatible with AirPlay", "AirPlay-enabled speaker"; not "[App] has AirPlay". "Apple AirPlay" allowed. "[App] now supports AirPlay" ok.

## Always On ([HIG](https://developer.apple.com/design/human-interface-guidelines/always-on))
- iPhone 14 Pro and later: system keeps Lock Screen widgets and Live Activities visible dimmed when device is face up and idle. iPad/macOS unsupported.
- Redact sensitive data (balances, health), including in notifications.
- Keep glanceable non-sensitive info (flight arrival, ride arrival); people can disable Always On.
- Keep key content legible; dim secondary text, images, fills; drop rich images/large color areas for dimmed colors; e.g. remove row backgrounds, dim details.
- Keep layout consistent on enter/exit; turn interactive components into unavailable appearance, don't remove. Make infrequent, subtle updates (e.g. update score only on change). Motion is visible face-up on iPhone, so avoid needless change.
- Settle motion to rest gracefully; don't stop instantly.

## App Clips ([HIG](https://developer.apple.com/design/human-interface-guidelines/app-clips))
- iOS/iPadOS only. Use for in-the-moment finite tasks (rent, order, pay) or a demo (tutorial + first level, free workout, create/save a doc).
- Let people finish the task or demo inside the clip; never force full-app install.
- Essential features only; no tab bars, complex navigation, settings; minimal screens and forms.
- **Never** use clip just for marketing; no ads.
- Avoid web views; native UI. If only web exists, link to website instead.
- Launch straight to the most relevant part; bundle all assets; no splash screen; never make people wait. Keep small; avoid extra downloads.
- Make shareable: links to specific points; Messages recipients launch in-place.
- Offer Apple Pay for payment/shipping; no required account (ask after task, or Sign in with Apple, minimal fields).
- Full app replaces clip: keep familiar focused experience; no re-login on transition.
- Privacy: no background operations; store little data, securely, off-device for logins; don't rely on stored data (system may delete the clip and its data).
- System removes clips after inactivity; no Home Screen presence. App Clip card and top app banner link to App Store. Optional `SKOverlay` at natural pause/after task; never repeatedly, never mid-task, not via push. Demo: let them experience it fully first.
- Notifications: 8 hours after launch by default; request longer permission only if flow spans more than a day. Notifications only task-related, in response to explicit action, never purely promotional.
- Platform provider serving businesses: business brand front and center, tone down yours. Handle multiple businesses/locations (switch recent, verify location on launch).
- Card image: 1800x1200 px PNG or JPEG, no transparency; photography/graphics, not UI screenshots; avoid text in image.
- Card copy: title max 30 characters, subtitle max 56 characters. Action verb: View (media, informational/educational), Play (games), Open (everything else).

### App Clip Codes
- Always use Apple-generated codes (App Store Connect or App Clip Code Generator CLI); two designs: badge with App Clip logo, or without. Default color pair or custom foreground/background (tools refuse poor contrast; third color auto-generated).
- Variants: scan-only (camera icon center) or NFC-integrated (iPhone icon center; hold near or scan). Use NFC-integrated when physically reachable (tabletop, register, storefront window, signage, gift card); scan-only for posters, unreachable signage, digital (screens, email, social).
- Include logo when clear space allows. Use no-logo design on disposable paper/plastic, gambling or drinking items (cards, chips, coasters). **Never** use the logo alone; it is always below the code in badge.
- Flat or cylindrical surfaces only; on cylinder, code width <= 1/6 of circumference (60 degrees). Avoid deformable materials (paper, plastic, fabric); mount on rigid card. Stickers must lie flat.
- Place with enough light, no wide-angle scanning. **Never** overlay with text/logos/images, animate, dim, or rotate; keep upright.
- Never alter: no custom design, filters, glows, shadows, gradients, reflections, changed aspect ratio; scale all attributes (strokes) uniformly. No symbol added.
- Minimums:

| Type | Minimum |
|---|---|
| Printed | diameter 3/4 inch (1.9 cm) |
| Digital | 256x256 px, PNG or SVG |
| NFC-integrated | embedded NFC tag at least 35 mm diameter; with a 35 mm tag the printed code at least 1.37 inch (3.48 cm) diameter |

- Distance-to-code-size ratio max 20:1, prefer 10:1 (40 inch / 101 cm away needs at least 4 inch / 10.16 cm).
- Next to a QR/other scannable: App Clip Code at least same size.
- Clear space: at least the gap between center glyph and circular code; more next to other machine-readable codes.
- Add call to action, esp. for no-logo design. Scan-only: "Scan to [action]." / "Scan using the camera on your iPhone or iPad to [action]." NFC: "Scan to [action]." / "Hold your iPhone near the [object name] to launch an App Clip that [action]."
- Trademarks: title case "App Clips"/"App Clip Code"; no Apple trademarks in app name/images; don't translate Apple trademarks; no seeking trademark/copyright on codes; no use in company/product name; stop displaying a code once its clip is inactive; no use harming Apple reputation or causing source confusion.
- Printing: matte, non-textured, no gloss/holographic/thin laminate (matte laminate if needed); outdoor UV-resistant. Professional: flexographic; desktop: inkjet. Rasterize SVG at >= 600 ppi, print >= 300 dpi; calibrate printer; avoid distortion. Receipt printers: print near max paper bounds.
- SVG is sRGB; convert to CMYK with relative colorimetric (media-relative) intent; "Generic CMYK ICC profile" on CMYK printers, "Gracol 2013 ICC profile" on CMYKOV; Delta E (CIELab) tolerance 2.5.
- Grayscale printers: generate grayscale codes only.
- NFC-integrated: Type 5 NFC tags, >= 35 mm diameter or equivalent.
- Always test prints from several angles; batch runs: small test run, template showing invocation URL and SVG filename, mapping file SVG-to-URL, versioning. Use Apple printer calibration test sheets (per color pair; grayscale bars).

## Apple In-App Purchase ([HIG](https://developer.apple.com/design/human-interface-guidelines/apple-in-app-purchase))
- IAP for digital goods/services (premium content, subscriptions). Apple Pay for physical goods, services (memberships, hotels, tickets), donations.
- Types: consumable, non-consumable, auto-renewable subscription, non-renewing subscription. Very large catalogs: Advanced Commerce API.
- Let people try the app before purchase; offer limited free access for subscriptions.
- Integrated shopping UI matching app style; product names/descriptions short, no truncation or wrap, plain language.
- Display total billing price for every IAP, any type.
- Show store only when payments possible (`canMakePayments`); else hide or explain (e.g. parental restrictions).
- **Never** modify or replicate the system confirmation sheet.
- Family Sharing (up to 5 additional members; subscriptions, non-consumables): mention prominently where content is offered (e.g. "Family"/"Shareable" in name, sign-up screen); explain benefits; tailor messaging for purchaser and family member (e.g. "Your family subscription includes...").
- Help/refund: custom help screen OK, tailored (missing purchases, FAQ, feedback, contact), linking to system refund flow (`beginRefundRequest(for:in:)`). Show help before refund request. Refund action title: "Refund" or "Request a Refund". Show contextual purchase info (image, name, description, purchase date). May offer alternatives (fulfillment, goodwill item) but always keep refund possible. No barrier: refund button without scrolling or extra screen. **Never** characterize or speculate on Apple's refund policy; may link to Apple's refund-request page.

### Auto-renewable subscriptions
- Show subscription benefits in onboarding with strong CTA and clear terms.
- Offer range of content, service levels, durations.
- Consider free access: freemium, metered paywall, free trial.
- Prompt at relevant times (nearing free limit); allow subscribe anytime; include sign-up in app/account settings.
- Prompt only non-subscribers; give sign-in option if same subscription sold in several apps or on web.
- Clear distinct option names, with price and duration; intro offers show intro price, offer duration, standard price afterwards.
- Ask only necessary info at signup; defer rest.
- Sign-up screen **must** include: subscription name, duration, content/services per period; billing amount localized per territory/currency; way for existing subscribers to sign in or restore purchases; links to Terms of Service and Privacy Policy (also in App Store metadata). Make billing total most prominent, breakdowns subordinate.
- Free trial: state trial duration and that payment starts automatically after, with amount.
- Offer codes (iOS/iPadOS): one-time use (generated in App Store Connect; redeem via URL, in-app, or App Store; for small/restricted distribution) or custom (e.g. NEWYEAR; URL or in-app only, not App Store settings; for mass campaigns).
- Custom code: alphanumeric ASCII only; no special characters, no Chinese/Arabic characters.
- Describe offer succinctly in marketing; tell people how to redeem custom codes.
- In-app redemption: only custom UI is a button starting system flow (`presentOfferCodeRedeemSheet(from:options:)`, `offerCodeRedemption(options:isPresented:onCompletion:)`); put "Redeem Code" on paywall, onboarding, settings. Optional promotional image (default: app icon).
- After redemption, unlock content immediately; welcome/tour; handle people who subscribe before first app open (smooth account creation/sign-in).
- Management: show subscription summary incl. renewal date (`Product.SubscriptionInfo`), preferably system UI (`showManageSubscriptions(in:)`) near account/settings. On cancel attempt: remind of loss, suggest other plan, or discount; win-back later (Retention Messaging API, win-back offers).
- **Must** keep cancellation easy; don't bury manage action.

## Apple Pay ([HIG](https://developer.apple.com/design/human-interface-guidelines/apple-pay))
- For physical goods, services (memberships, hotels, tickets), donations, subscriptions. Virtual goods/digital content: use IAP instead.
- Offer on all supporting devices/browsers; **never** show Apple Pay where unsupported (`PKPaymentAuthorizationController`).
- If checking for active Wallet card via API, **must** make Apple Pay the primary (not necessarily sole) option everywhere; no separate step/flow; may pre-select.
- Apple Pay buttons only to start payment or (where fitting) setup; no other use.
- Custom button starting Apple Pay: **must not** show "Apple Pay" text or logo; show Apple Pay mark or text mention on same page. Correct: mark above "Order Now"; wrong: mark above button titled "Apple Pay".
- Mark = acceptance only; **never** a button. Separate custom button may start payment.
- Don't hide Apple Pay button or make it look disabled; if not ready (size/color unselected), point out problem after tap.
- Web: list Apple Pay as payment option in semantic markup for search engines; must include privacy statement and follow Apple Pay on the web acceptable-use guidelines.

### Streamlining checkout
- Cohesive branded checkout; avoid extra pages/windows (esp. web).
- Assume people want Apple Pay: first option, larger, or separated by a line.
- Apple Pay buttons on product detail pages for single-item purchase (item only, excluding cart; remove from cart afterwards if present). Express checkout for carts: show sheet immediately; single shipping method/destination.
- Coupons/promo codes enterable on the sheet, esp. express checkout.
- Collect required options (color/size) before the button; on missing info highlight, warn, navigate to field.
- Optional data (gift message, delivery notes) collect before or after; sheet can't take it.
- Multiple shipping methods/destinations per item: collect before sheet. In-store pickup: choose location before sheet; sheet shows its address (read-only pickup address).
- Prefer Apple Pay contact/shipping/payment data over stored; fetch latest.
- No account creation before purchase; offer on confirmation page with prefilled fields.
- Report transaction results/errors (bad address) in sheet. Show order confirmation/thank-you with ship timing and status check; Apple Pay mention optional: after last 4 digits ("1234 (Apple Pay)") or note ("Paid with Apple Pay").

### Customizing the payment sheet
- Request/present only essential info (e.g. no shipping address for e-delivered gift card).
- Show active coupon/promo code; allow entry on sheet.
- Shipping method choice in sheet: description, cost, optional delivery/pickup date or range (`PKDateComponentsRange`, calendar/time zone aware). Pickup: optional date/time window.
- Line items for extra charges, discounts, pending costs, add-on donations, recurring/future payments (label + cost; recurring adds frequency). **Never** itemize products as line items (`paymentSummaryItems`). Keep short, single line.
- Total line: "Pay [Business_Name]" using the name on card statement. Intermediary: "Pay [End_Merchant (via Your_Business)]".
- If cost may change after authorization (ride, tip) and regulations allow: explain and mark subtotal "Amount Pending"; preauth amounts must be accurate.
- No extra spinners/progress; sheet owns loading state.
- Website icon (shown in Handoff authorization; subscriptions in Wallet): 60x60 pt = 120x120 px @2x, 180x180 px @3x.

### Handling problems
- Validate on sheet appear, field change, after authentication; system highlights fields; supply custom detail messages (`PKPaymentAuthorizationViewControllerDelegate`). Before authorization only card type and redacted shipping address are available; still validate what you can, show errors on auth failure.
- Don't force business logic: ignore extra data (Zip+4 for 5-digit zip), infer missing, accept varied phone formats.
- Report errors with correct status codes (`PKPaymentError`) so system shows most relevant.
- Error text: name field and expected value ("Zip code doesn't match city", "Shipping not available for this state", not "Address is invalid"); noun phrases, sentence-style caps, no ending punctuation, 128 characters or fewer.
- Interruption (cancel, timeout) dismisses sheet: **must** cancel in-progress payment; people restart via button.

### Subscriptions and donations
- Recurring: fixed or (where regulation allows) variable. Explain frequency and terms before sheet.
- Line items: billing frequency, discounts, upfront fees; if nothing due now, disclose when billing starts. Trials: trial amount (incl. $0), regular amount, start date of regular billing. Total line = amount billed now.
- Show sheet on subscription change only when fees increase.
- Billing agreement field: concise plain-language summary, no duplicates; leave blank when unsure.
- Donations (approved nonprofits only): line item such as "Donation $50.00"; preset amounts (e.g. $25, $50, $100) plus "Other Amount".

### Buttons
- **Must** use Apple API for buttons (`PKPaymentButtonType`, `PKPaymentButtonStyle`; web: Apple Pay on the Web): approved captions/fonts/colors, scaling, localization, corner radius, VoiceOver. **Never** design or replicate buttons.
- Types: Buy (purchase/product/cart), Pay (bills/invoices), Check Out (when other buttons start "Check Out"), Continue (when others start "Continue"), Book (flights/trips), Donate (nonprofits), Subscribe, Reload / Add Money / Top Up (match your service's term), Order (meals/flowers), Rent, Support / Contribute (match term), Tip, plain Apple Pay (stylistic, smaller min width, no CTA; system may substitute if type unsupported).
- Set Up Apple Pay button: device supports but not set up; show in Settings, profile, interstitial.
- Styles: automatic (follows system appearance, `PKPaymentButtonStyle.automatic`); Black on white/light bg with contrast, never dark; White with outline on white/light bg lacking contrast, never dark or saturated; White on dark bg with contrast, not light.
- Size/position: no smaller than other payment buttons; visible without scrolling. Side-by-side: Apple Pay right of Add to Cart. Stacked: above Add to Cart.
- Corner radius adjustable (`cornerRadius`): square to capsule, match other buttons.
- Minimums (title length varies by locale; if too small, system swaps in plain Apple Pay button, except Set Up Apple Pay has no swap):

| Button | Min width | Min height | Min margins |
|---|---|---|---|
| Apple Pay (plain) | 100 pt (100 px @1x, 200 px @2x) | 30 pt (30 px @1x, 60 px @2x) | 1/10 of button height |
| Book, Buy, Check Out, Donate, Set Up, Subscribe | 140 pt (140 px @1x, 280 px @2x) | 30 pt (30 px @1x, 60 px @2x) | 1/10 of button height |

### Apple Pay mark
- Show among other payment options as availability marker; not a button.
- Apple artwork only; alter height only, and make it >= other payment marks' height. Don't change width, corner radius, aspect ratio; no trademark symbol/extra content; keep border; no shadows/glows/reflections; no flip, rotate, animate.
- Clear space >= 1/10 of mark height; don't share a border with another graphic/button.

### Referring to Apple Pay
- "Apple Pay": two words, capital A and P; all-caps only in an all-caps style. Never plural or possessive. Never use Apple logo as the word Apple ("Purchase with Pay" wrong; "ApplePay" wrong).
- US: use (R) at first appearance in body text; not on checkout selection option.
- Match app/site font and size; don't mimic Apple typography. Never translate.
- Text-only description in payment selection only if all other options are text-only; otherwise use the mark. Follow App Store marketing guidelines in-app.

## Augmented reality ([HIG](https://developer.apple.com/design/human-interface-guidelines/augmented-reality))
- iOS/iPadOS (ARKit). AR-primary app: restrict availability to ARKit-capable devices. Optional AR features: don't show an error on unsupported devices; just don't offer them.
- Use entire display for world and objects; avoid control clutter.
- Convincing illusion: detailed 3D assets, lifelike textures, correct scale, place on detected surfaces, environmental lighting + camera grain, top-down diffuse shadows, update with camera. Render at 60 fps so objects don't jump/flicker.
- Reflective objects: reflections are approximations; prefer small or coarse reflective surfaces.
- Audio and haptics confirm contact; background music optional.
- Minimize text in the environment. Extra info/controls in screen space (fixed in virtual world or, less often, on device screen).
- Persistent controls: indirect 2D controls in screen space, reachable without changing grip, translucent to avoid blocking scene.
- Communicate environment needs up front (room, flat surfaces); consider feature sets per environment.
- Comfort: place objects at distances needing little device movement; short game levels with downtime. Introduce movement gradually. Safety: avoid encouraging rapid/sweeping/large motions.

### Coaching
- Use built-in coaching view (`ARCoachingOverlayView`) for initialization and relocalization; hide unrelated UI while it shows (appears automatically).
- Custom coaching only if needed; use system view as reference.

### Placing objects
- Show when to find a surface and when placement is possible; custom indicator aligned to the detected plane.
- Place immediately on tap; refine later subtly (nudge back onto surface) (`ARTrackedRaycast`).
- Guide to offscreen objects with visual or audio cues (e.g. edge indicator).
- Don't align precisely to surface edges (approximate, can change).
- Use plane classification (floor for furniture, table for game board).

### Object interactions
- Prefer direct manipulation (touch the object); indirect controls when people move around.
- Standard gestures: one-finger drag to move, two-finger rotate to spin. Keep interactions simple (2D gestures vs 3D world): e.g. move on plane, rotate around vertical axis.
- Respond to gestures near small, thin or distant interactive objects.
- Offer scaling only when sensible (imaginary worlds yes; furniture-visualizing no). **Never** use scale to adjust apparent distance.
- Test conflicting gestures (pinch vs two-finger rotate).
- Movement consistent with physics: keep objects visible and attached to surfaces; no jumping/vanishing during resize/rotate/move.
- Consider motion/proximity-based interaction.

### Multiuser
- Each participant maps independently; ARKit merges (`isCollaborationEnabled`).
- Consider people occlusion. Let new participants join ongoing experience via implicit map merging unless all must join first.

### Real-world objects
- Reference 2D images / 3D objects trigger content.
- When a detected image disappears, wait up to 1 second before fading/removing attached objects.
- Keep active reference images to 100 or fewer; swap sets by context (e.g. museum area via location).
- Limit reference images needing accurate position tracking (use tracked image when image moves or attached content is small relative to it).

### Communicating
- Friendly wording; avoid ARKit, world detection, tracking, plane, features. Examples: "Unable to find a surface. Try moving to the side or repositioning your phone."; "Tap a location to place the [object]."; "Try turning on more lights and moving around."; "Try moving your phone more slowly."
- In 3D context prefer 3D hints (e.g. rotation indicator) over text overlays; text only if people don't respond to hints.
- Critical text in screen space; text in 3D must face person and keep same type size regardless of distance.
- Tappable-for-more indicator (e.g. label ending with chevron).

### Interruptions
- Tracking stops during interruptions; relocalization restores positions. Use coaching view to return to prior pose; consider hiding placed objects during relocalization then redisplay.
- If app has AR and non-AR parts, embed non-AR tasks (e.g. change upholstery) inside AR to avoid exits.
- Let people cancel relocalization (reset/restart button).
- Indicate front camera losing face tracking for more than about 0.5 second with a visual indicator; minimal text.

### Problem resolution
- Always offer reset. Suggest fixes in friendly language: insufficient features -> "Try turning on more lights and moving around."; excessive motion -> "Try moving your phone slower."; slow surface detection -> "Try moving around, turning on more lights, and making sure your phone is pointed at a sufficiently textured surface."

### AR icon and badges
- AR glyph (download in Resources): only to start an ARKit experience; **never** alter except size and color; not for non-ARKit AR. Clear space >= 10% of glyph height, nothing overlapping.
- Badges (collapsed glyph-only and expanded "AR" text) mark individual items viewable in AR in collections; unaltered, no color change, ARKit only. Prefer text badge; glyph-only for constrained space. Only when mix of AR and non-AR items. Same corner on every photo, large enough but not hiding detail. Clear space >= 10% of badge height.

## CareKit ([HIG](https://developer.apple.com/design/human-interface-guidelines/carekit))
- iOS/iPadOS. CareKit 2.0 = CareKit UI (prebuilt views) + CareKit Store (on-device database for patients, care plans, tasks, contacts).
- **Must** provide privacy policy URL at submission; protect all data whether entered, from device, or system; get permission before accessing via iOS features.
- HealthKit: request access only when needed, in context (e.g. weight when logging weight), each time needed since permissions can change (`requestAuthorization(toShare:read:completion:)`). Add short descriptive purpose text on the standard permission screen; don't replicate it with custom screens. Manage sharing only via system Settings > Privacy; no extra in-app screens affecting data flow.
- Motion data (Core Motion) only if useful for treatment and permitted. Camera/photos with permission to share with care team.
- ResearchKit integration: surveys, tasks, charts, informed consent module when appropriate.
- Views: Tasks (prescribed actions, symptom logging), Charts (treatment progress), Contact (phone, message, email, map). Use each for its purpose. Each view = header (text, symbol, disclosure indicator, optional separator) + vertical content stack; CareKit UI handles layout constraints.
- Task info: Title (required, e.g. Ibuprofen), Schedule (required), Instructions (optional), Group ID (optional category).
- Task styles: simple (one step; default button fills with checkmark, custom completion image optional; no content stack), instructions (simple + informative text), log (log events, auto timestamp), checklist (multistep rows with text + button), grid (compact multistep buttons with succinct titles; exposes collection view for custom UI).
- Color reinforces task meaning (medication vs activity) but never as only signal.
- Task text: accurate but simple (marketing name for medication, drop redundant "take"); add video/images for complex tasks.
- Charts: bar, scatter, line; provide title, subtitle, axis markers, data. Highlight trends/correlations; short labels (units like BPM on axis, not each point); distinct colors, not shades of one color, sufficient contrast; legend if colors unclear; denote time units; consolidate large data sets; offset data so small values stay readable.
- Contact views: simple and detailed. Color may categorize care team members.
- Notifications: minimize, coalesce; badge for unread caregiver message; consider detail view for quick completion.
- Symbols: prefer CareKit-provided symbols; customize mainly in grid (use SF Symbols, e.g. pill, walking person). Custom symbols must relate to health/app concept; not decorative, not corporate logos.
- Branding refined and unobtrusive (color, tone); no advertising.

## Game Center ([HIG](https://developer.apple.com/design/human-interface-guidelines/game-center))
- Use GameKit (system UI or custom UI). At launch, check Game Center sign-in; if signed out, initialize the player then (helps discovery, Top Played chart, friend recommendations).
- Access point (iOS/iPadOS/macOS opens Game Overlay): show in menu screens (main menu, settings); not during active gameplay, splash, cinematics, tutorials. Fixed at any of 4 corners; has collapsed and expanded states, so keep controls away and check overlap. Consider pausing game while overlay is open.
- Custom links may deep-link to leaderboards/profile; use official Game Center artwork from Apple Design Resources, unmodified dimensions/effects.
- Terminology (use / not): Game Center (not GameKit, GameCenter, game center; use system translation); Game Center Profile (not Profile, Account, Player Info; system translation for Game Center, localize Profile); Achievements (not Awards, Trophies, Medals); Leaderboards (not Rankings, Scores, Leaders); Challenges (not Competitions); Add Friends (not Add, Add Profiles, Include Friends).

### Achievements
- Map to four states: locked, in-progress, hidden, completed (Completed group vs Locked group).
- Display order = upload order; plan it (e.g. common path).
- Title and description max 2 lines each (truncated beyond); title-style caps for title, sentence-style for description.
- Progressive achievements show progress and encouragement.
- Unique rich image per achievement (no reuse; placeholder if missing). Circular mask: keep content centered.
- Achievement image (iOS, iPadOS, macOS):

| Attribute | Value |
|---|---|
| Format | PNG, TIF, or JPG |
| Color space | sRGB or P3 |
| Resolution | 72 DPI minimum |
| Image size | 512x512 pt (1024x1024 px @2x) |
| Mask diameter | 512 pt (1024 px @2x) |

### Leaderboards
- Types: classic (best all-time score, never ends) or recurring (resets per interval: daily/weekly, events). Group multiples into leaderboard sets (difficulty, activity type, genre/theme).
- Unique image per leaderboard reflecting gameplay; single image in iOS/iPadOS/macOS. System crops images in sets; keep primary content safe.

| Attribute | Value |
|---|---|
| Format | JPEG, JPG, or PNG |
| Color space | sRGB or P3 |
| Resolution | 72 DPI minimum |
| Image size | 512x512 pt (1024x1024 px @2x) |
| Cropped area | 512x312 pt (1024x624 px @2x) |

### Challenges
- Built on leaderboards; short skill-based, 1-5 minutes, individually completable (fastest lap, most enemies, daily puzzle fewest mistakes).
- Don't track overall progress or personal bests (unfair to regular players); track most recent score per attempt.
- Deep-link to exact mode/level; first-time players: run needed tutorial first, tell them challenge follows automatically.
- Artwork shown in Game Overlay, Games app, invitation preview; keep key content away from title/description overlay area (system gradient at bottom); provide localized text variants via App Store Connect or Xcode.

| Attribute | Value |
|---|---|
| Format | JPEG, JPG, or PNG |
| Color space | sRGB or P3 |
| Resolution | 72 DPI minimum |
| Image size | 1920x1080 pt (3840x2160 px @2x) |
| Cropped area | 1465x767 pt (2930x1534 px @2x) |

### Multiplayer activities
- Real-time and turn-based; via party codes, Game Overlay, dashboard, Games app.
- Party codes: alphanumeric, typically 8 characters (e.g. "2MP4-9CMF"). Allow late join, early leave, return; show current code in game; allow manual entry.
- Default UI invites nearby/recent players, friends, contacts; custom UI allowed.
- Activity artwork: same spec as challenge image (JPEG/JPG/PNG, sRGB or P3, 72 DPI min, 1920x1080 pt / 3840x2160 px @2x, cropped area 1465x767 pt / 2930x1534 px @2x). Shown in party code, Games app, in-game UI.

## Generative AI ([HIG](https://developer.apple.com/design/human-interface-guidelines/generative-ai))
- Design responsibly: outputs vary; inclusive, careful, privacy-protecting.
- Keep people in control: honor in-scope requests, handle sensitive content carefully, let them dismiss, revert, retry; clearly identify where AI is used.
- Inclusive: models favor common data and stereotypes. Ask for info rather than inferring personal/cultural traits (gender identity, relationship types); test across diverse people.
- Offer generative features only where value is clear (time savings, communication, creativity).
- Give non-AI fallback / great experience when AI unavailable or declined (e.g. Genmoji vs regular emoji; notification summaries optional).
- Transparency: say where AI is used; **never** pass AI off as human-authored; follow regional disclosure rules. Set expectations on capabilities and limits (tutorial, curated starter suggestions for open-ended prompts, known limitations up front, why weak results occur).
- Privacy: choose model type deliberately; on-device = private, fast, offline; server for more power/context. For server: process locally as much as possible, minimize shared data, tell people data may be sent, show what's shared, disclose storage/training use.
- Ask permission before using personal and usage data; minimum data; clear opt-out; explicit permission for model improvement/storage; vet third parties; outputs may leak sensitive info; stricter rules for kids' apps. Explain benefits concisely and specifically; state whether data trains the model.
- Evaluate model capabilities early; availability varies (device, network, battery; Foundation Models needs compatible device with Apple Intelligence on).
- Datasets: diverse, known provenance, licensed, tested for bias and misinformation.
- Inputs: guide with diverse predefined example inputs. Hallucinations: tell people content may contain errors; scope generation tightly; avoid factual requests without verified up-to-date sources; avoid AI content where a mistake could harm.
- Irreversible/problematic tasks: confirm before significant actions; don't automate destructive (delete photos) or hard-to-undo (purchases) ones. Follow model usage policies and local regulation.
- Outputs: Edit, Undo, Retry, Adjust near generated content; acknowledge when corrections take effect. When blocked, coach better requests (e.g. "Unable to use that description" plus examples).
- Test misuse: out-of-scope, vague, poorly phrased, sensitive, harmful prompts; define policies.
- Avoid replicating copyrighted content: build on models with protections, curate inputs (pre-approved prompts), instruct model to avoid styles/content.
- Latency: generative is slow; design loading or background generation. Real-time ok only for low-latency non-generative models (ARKit tracking, Vision).
- Specific progress messages ("Summarizing key themes from your notes"), not "Processing..."; on error, plain language plus next step.
- Consider multiple meaningful alternatives.
- Continuous improvement: update model/blocked word lists independent of releases; retest on base-model changes; voluntary, unobtrusive feedback (thumbs up/down, optional detailed report); separate model from UX so models can be swapped.

## HealthKit ([HIG](https://developer.apple.com/design/human-interface-guidelines/healthkit))
- iOS/iPadOS (not macOS). **Never** request health data if the app has no health/fitness functionality.
- **Must** request permission and protect data; show how it's used. **Must** supply privacy policy URL at submission.
- Request access only when needed, in context; request each time (permissions can change) (`requestAuthorization(toShare:read:completion:)`).
- Add short purpose text to system permission screen; no custom screens replicating it. Manage sharing only via Settings > Privacy; no in-app screens altering data flow.
- Activity rings (`HKActivityRingView`): Move, Exercise, Stand only; **never** other data or ring-like replicas. One person only, with label/photo/avatar showing whose. **Never** ornamental, in labels/backgrounds, in app icon, in marketing, or in your notifications. Never change look: no filters, color changes, opacity. Enclose in a circle by corner radius of enclosing view, not circular mask. Outer margin >= distance between rings; nothing crops/obstructs. Separate other rings with padding, lines, labels, color, scale. Activity notifications: don't repeat system Move/Exercise/Stand updates; app-specific only.
- Apple Health icon: Apple-provided only (Apple Design Resources); show name "Apple Health" near it; no smaller than other health app icons; not a button; no mask/circle/borders/overlays/gradients/shadows; clear space >= 1/10 of icon height; no compositing onto other graphics; not within text or replacing terms. **Never** show Health app screenshots/images.
- Text: "Apple Health" or "Apple Health app"; **never** "HealthKit" in user-facing copy ("works with the Apple Health app"). Two words, capital A and H; all-caps only in all-caps styles. Use system translation of Health.

## HomeKit ([HIG](https://developer.apple.com/design/human-interface-guidelines/homekit))
- **Must** use HomeKit terminology and object model: home (root; multiple homes possible) > rooms, zones, accessories > services > characteristics. Service groups, actions, scenes, automations.
- Reference the hierarchy in setup/control even without room/zone UI (voice: "turn on the lights upstairs"). Make accessory's room/zone/home visible in accessory detail view, not buried in settings. Show home info even if app is single-home.
- **Never** show duplicate home settings or ask to re-set-up the home; defer to Home app settings.
- Terms: home = house/office/location; room = name only (Bedroom); accessory = physical device; category = type (thermostat, fan, light; switches must share category with what they control); service = controllable feature (garage door opener, ceiling fan light); characteristic = attribute (speed, brightness). **Never** show words "service" or "characteristic" in UI; use descriptive names. Siri uses service names, not accessory names.
- Scene = group of actions (Movie Time, Good Morning). API says "action set"; UI **must** say "scene". Zone = group of rooms (upstairs), optional. Automations react to location, time, accessory state, sensors.
- Setup: use system flow (`performAccessorySetup(using:completionHandler:)`): names, networks, pairing, room/category, favorites. Provide purpose string for Home data (e.g. "Lets you control this accessory with the Apple Home app and Siri across your Apple devices.").
- No required account or personal info; if cloud account needed, optional and after HomeKit setup. Don't force other platforms' setup during HomeKit setup. Always start with system setup flow; custom post-setup experience afterwards.
- Names: suggest service names good for Siri; **never** suggest company names or model numbers. Validate renamed services: alphanumeric, space, apostrophe only; start and end with letter/number; no emoji ("Reading lamp", "2nd garage door" ok; "#2 garage door" no). On violation, explain briefly and suggest alternatives.
- Avoid location words in service names ("kitchen light"); detect and help move to room/zone assignment.
- Siri: show example voice commands with chosen service name after setup; teach complex commands later (e.g. in scene detail "Hey Siri, set 'Movie Time'"). Siri also resolves category, characteristic (brighter, dim), room, zone, service group, scene, home. Suggest zones/service groups when useful.
- Shortcuts only for accessory-specific functionality HomeKit lacks (e.g. "Order AC filters"); never for scenes/actions HomeKit supports; explain difference.
- Custom functionality: say what's done in app vs Home app (e.g. build scene with your accessory then open Home app to add shades/TV). Defer to HomeKit database on mismatch; show conflicts visually (e.g. both names side by side). Ask permission before writing; **never** overwrite HomeKit settings without explicit direction.
- Cameras: don't cover camera image; show microphone button only with bidirectional audio support.
- HomeKit icon: Apple-provided only; for setup/instructional communications; Apple Home app icon for referencing the app or a button opening its App Store page. Black on light bg (others black), white on dark (others white), custom color when others match. Place consistent with other technology icons (same container shape). Noninteractive only (except Home app icon for App Store page). Not within text/replacing the word. Name beside/below in same font, if others are so shown.
- Text: emphasize your app over HomeKit. Apple trademarks not in app name/images; singular, non-possessive, untranslated, no category descriptors (say iPad, not tablet), no implied sponsorship, correct credit lines in legal areas, mention devices/OS only in specs. Use "iPhone or iPad", not "iOS devices".
- "HomeKit" one word (capital H, K); "Apple Home" two words; all-caps only in all-caps layouts. Not a descriptor: "[Brand] lightbulbs work with HomeKit", "HomeKit-enabled thermostat", "use HomeKit with [App]"; not "HomeKit lightbulbs". Don't imply HomeKit acts ("Back door is unlocked with HomeKit", not "HomeKit unlocked the back door"). "Apple HomeKit" ok; "Open HomeKit settings" ok for setup. First mention "Apple Home app", later "Home app"; not "Open Home".

## iCloud ([HIG](https://developer.apple.com/design/human-interface-guidelines/icloud))
- Work with iCloud automatically; optionally ask once at first launch: iCloud for all data or none.
- Don't ask which documents to keep in iCloud; automate file management.
- Keep content current, balancing storage and bandwidth; for very large documents let people control downloads, show a newer-version-available indicator, subtle feedback if download takes more than a few seconds.
- Respect finite storage: store user-created content, not regenerable or app resources. iCloud backups include each app's Documents folder; keep it lean.
- When iCloud unavailable (off, Airplane Mode) no alert needed; optionally unobtrusively note changes won't sync to other devices.
- Store app state/settings (e.g. last page read) only for settings wanted on all devices.
- Warn and confirm before deleting a document (deletes everywhere).
- Resolve version conflicts automatically; otherwise unobtrusive, early, easy-to-compare choice UI.
- Include iCloud content in search results.
- Games: consider GameSave for cross-device progress and sync alerts.

## ID Verifier ([HIG](https://developer.apple.com/design/human-interface-guidelines/id-verifier))
- iPhone only (iOS 17+); reads ISO18013-5 mobile IDs.
- Display Only request: data shown in system UI, not sent to app. Data Transfer request: only with legal need to store/process; needs additional entitlement.
- Ask only for needed data (age threshold via `ageAtLeast(_:)`, not birth date/age).
- Register with Apple Business Register if eligible (shows organization name and logo).
- Start with a button labeled "Verify Age" (simple age check) or "Verify Identity" (detailed identity data). No symbol for NFC/QR communication type. **Never** include Apple logo in label.
- Display Only: provide feedback buttons e.g. "Matches Person" / "Doesn't Match Person".

## iMessage apps and stickers ([HIG](https://developer.apple.com/design/human-interface-guidelines/imessage-apps-and-stickers))
- iOS/iPadOS only. One primary experience per iMessage app (split into multiple apps for different functionality).
- Consider surfacing iOS app content (shopping list, itinerary) or simple collaboration (where to eat).
- Compact view (below transcript, roughly keyboard height): essential, frequent items; expanded view for more. Allow text editing only in expanded view (keyboard keeps content visible).
- Stickers: expressive, inclusive, legible on varied backgrounds, rotated, scaled; transparency welcome. Localized alternative description per sticker (VoiceOver).
- Icon: supply square-cornered icons; system rounds. Sizes (pixels):

| Usage | @2x | @3x |
|---|---|---|
| Messages, notifications | 148x110 | - |
| Messages, notifications | 143x100 | - |
| Messages, notifications | 120x90 | 180x135 |
| Messages, notifications | 64x48 | 96x72 |
| Messages, notifications | 54x40 | 81x60 |
| Settings | 58x58 | 87x87 |
| App Store | 1024x1024 | 1024x1024 |

- Sticker size: small, regular, or large; don't mix sizes in a pack. @3x dimensions (system downscales for @2x/@1x): small 300x300 px, regular 408x408 px, large 618x618 px. File 500 KB or smaller.

| Format | Transparency | Animation |
|---|---|---|
| PNG | 8-bit | No |
| APNG | 8-bit | Yes |
| GIF | Single-color | Yes |
| JPEG | No | No |

## Live Photos ([HIG](https://developer.apple.com/design/human-interface-guidelines/live-photos))
- Apply adjustments/effects to all frames, or offer conversion to still.
- Keep Live Photo intact: don't present frames or audio separately.
- Sharing: preview full content; always offer share as still photo.
- Show progress while downloading and indication when playable.
- In environments without Live Photos support, show still; don't imitate.
- Distinguish from stills via a custom hint of motion (no built-in effect), else system badge (with or without "Live") above photo; **never** a playback button resembling video. Same badge location on every photo, typically a corner.

## Mac Catalyst ([HIG](https://developer.apple.com/design/human-interface-guidelines/mac-catalyst))
- Good candidates: iPad apps with drag and drop, keyboard navigation + shortcuts, multitasking (Split View, Slide Over, PiP) scaling, multiple scenes (-> multiple windows). Poor fit: essential gyroscope/accelerometer/rear camera, HealthKit/ARKit, primary marking/handwriting/navigation.
- Free: pointer/keyboard focus, window management, toolbars, rich text/context menus, file management, menu bar, app settings in system Settings; Mac-like split view, file browser, activity view, form sheet, color picker.
- Idiom: default "Scale Interface to Match iPad" scales views/text to 77% (17 pt baseline text becomes 13 pt). Consider Mac idiom when app feels at home: more detail, more Mac-like controls, better performance/power for graphics-heavy; text/views render at 100%, so audit layout, adjust fonts (use text styles, no fixed font/view/layout sizes), consider separate Mac asset catalog, check image rendering. Limit appearance customizations to standard macOS ones that exist in iPadOS.
- **Must** go beyond showing the iPad layout in a window, whichever idiom.
- Navigation: iPad tab bar -> split view with sidebar (preferred; consistent across iPad and Mac) or segmented control (flat hierarchy). List top-level items in macOS View menu. Offer Next/Previous buttons in addition to swipe for page changes.
- Input gestures translate: mouse (tap = left/right click, touch and hold = click and hold, pan = left click and drag); trackpad (tap = click, touch and hold, pan = click and drag, pinch, rotate). Pinch/rotate touches go to the view under the pointer.
- Provide a macOS app icon (lifelike macOS rendering style).
- Layout: multiple columns; regular width/height size classes with side-by-side reflow on resize; inspector beside content instead of popover; move controls to window toolbar (and list commands in menu bar); top-down flow, important actions near top; relocate side/bottom-edge buttons (no ergonomic reason on Mac).
- Menus: all commands in menu bar (use `UIKeyCommand`, `UIMenuBuilder`, `UICommand`); pop-up/pull-down and context menus convert automatically; add context menus to every object (Mac expectation).

## Machine learning ([HIG](https://developer.apple.com/design/human-interface-guidelines/machine-learning))
- Plan the model with the intended experience; expect long iteration. Define ML's role first: critical vs complementary (central features need higher accuracy), private vs public (sensitive data = higher stakes; always protect privacy), proactive vs reactive (proactive gets less tolerance; may need more data), visible vs invisible (invisible features hard to get feedback on), dynamic vs static improvement (dynamic needs calibration/feedback).

### Explicit feedback
- Request only when necessary; prefer implicit. **Always** voluntary.
- Favoriting and social reactions are implicit feedback, not explicit.
- Describe options by consequence in plain words ("Suggest less pop music", "Suggest more thrillers", "Mute politics for a week"); avoid vague "dislike". Icons only alongside text.
- Offer multiple, progressively specific options. Act immediately and persist (hide the content everywhere). Consider feedback on when/where to show results.

### Implicit feedback
- Secure data; tell people how info is obtained/shared and give ways to restrict flow (cross-app effects surprise).
- Don't narrow exploration (reinforcement loop). Use multiple signals; viewing/sharing isn't proof of liking. Withhold private/sensitive suggestions (shared devices). Prioritize recent feedback, fall back to history. Update predictions at a cadence matching mental model (typing: instant; songs: not continuous). UI changes shift feedback patterns. Beware confirmation bias; don't rely solely on implicit.

### Calibration
- Only when feature can't work without it; secure data; explain why (what it does, not how); collect minimum; avoid repeating, do early (exception: per-object calibration like each baseball field).
- Quick and easy: few key items, infer rest; no look-ups; no hard actions. Give explicit goal and visible progress (Face ID tick marks). Help immediately if stalled with actionable steps, never blame. Confirm success with clear path to feature. Cancel anytime without judgment or messaging. Let people update/remove calibration data outside the flow too.

### Mistakes
- Anticipate, help handle, learn from them. Patterns: limitations, corrections, attribution, confidence, feedback.
- Match corrective tools to consequence severity (keyboard suggestion vs route to a flight). Make frequent/predictable mistakes easy to fix. Keep updating for evolving interests. Address mistakes without complicating UI (wrong attribution magnifies error). Extra care in proactive features. Improvements in one area may hurt another (dogs vs cats).

### Corrections
- Familiar, easy: show the steps/controls the automation used (Photos highlights auto-crop controls). Show corrected result immediately and persist. Allow correcting corrections. Balance benefit vs correction effort. **Never** rely on corrections to cover poor quality. Learn from corrections only when it raises quality. Prefer guided corrections (alternatives list) over freeform; may combine.

### Multiple options
- Contexts: suggested (proactive), requested (reactive), corrections. Prefer diverse options (Maps: no-toll, scenic, highway routes). Avoid too many; fit on one screen without scrolling. Most likely first (confidence, time, location), preselect if sensible. Make options distinguishable (brief descriptions, highlight differences; categories if many). Learn from selections.

### Confidence
- Verify confidence correlates with quality before exposing it. Know meaning before presenting. Translate to familiar concepts: attribution like "Because you listen to pop music" over "97% match"; ranking order; semantic categories ("high chance"/"low chance"); numbers/intervals only where expected (weather, sports, polls); actionable suggestions ("This is a good time to buy"). Adapt presentation by threshold (Photos asks to confirm when low). With known correlation, don't show low-confidence results; set a threshold for proactive suggestions.

### Attribution
- Basis for result without explaining model ("Because you've read mysteries"). Use to distinguish options, reduce impact of mistakes, build mental model, trust. Not too specific (feels like watching) nor too general. Factual, objective, no emotion/judgment ("Because you've read nonfiction", not "love"). No technical/statistical jargon unless result is itself statistical.

### Limitations
- Set expectations before use (rare serious limitations: marketing or in context; minor: attribution). Show how to get best results: placeholder text ("Photos, People, Places..."), live feedback (Memoji "Low light"), alternatives instead of no results. Explain why results are poor. Tell people when limitations are resolved.

## Maps ([HIG](https://developer.apple.com/design/human-interface-guidelines/maps))
- Keep map interactive (zoom, pan, rotate); no noninteractive elements obscuring it.
- Emphasis style (`MKStandardMapConfiguration.EmphasisStyle`): default (saturated; most apps; aligns with Maps app) or muted (desaturated; for info-rich custom content).
- Offer search plus category filters (e.g. mall: clothing, housewares, electronics).
- Style selected elements distinctly (outline, color change).
- Cluster overlapping POIs into one pin (count) that expands on zoom.
- Apple logo and legal link: don't cover permanently (temporary ok). Padding 7 pt on sides, 10 pt above and below; keep them fixed to the map; for movable custom UI (bottom card) place 10 pt above the lowest resting position. Not shown on maps smaller than 200x100 px.
- Annotations: match app style; default marker red tint + white pin icon; tint adjustable; icon can be string or image; string 2-3 characters (any Unicode) (`MKAnnotationView`). Make custom info for standard features independently selectable (`MKMapFeatureOptions`).
- Overlays (`MKOverlayLevel`): above roads (default; below buildings/trees) or above labels (hides everything beneath).
- Custom controls need contrast against map: thin stroke, light drop shadow, or blend modes.

### Place cards
- Show rich place info (hours, phone, address). In a map: on selection, for your places or other features (POIs, territories, physical features). Web: Maps Embed API.
- Styles: automatic (by map view size); callout (popover next to place; full = large detailed, compact = concise; default automatic callout); caption ("Open in Apple Maps" link); sheet. Full callout shows as popover in iPadOS/macOS, sheet in iOS.
- Choose style for map context (small map with many annotations: compact). Must look good across devices/window sizes (set minimum width for full callout). Avoid duplicating info already shown (use compact or caption). Keep selected location visible (set offset, `offset(_:)`).
- Outside a map (lists, store locators): **must** include a map in the place card (`displaysMap`). Use cues (names, addresses, button, or map pin icon with name) that a place card can open.

### Indoor maps
- Adjust detail by zoom: large areas always, finer features/labels progressively (airport: terminals/gates zoomed out; stores/restrooms zoomed in).
- Distinctive styling: color + icons by area/service type.
- Floor picker for multiple levels: concise, floor numbers over names.
- Show surrounding areas for context; dim and use distinct color if noninteractive.
- Offer routing to nearby transit/parking; option to switch to Apple Maps.
- Limit scrolling away from venue; keep part of indoor map onscreen, scale limits with zoom.
- Match app style; don't copy Apple Maps (Indoor Mapping Data Format).

## NFC ([HIG](https://developer.apple.com/design/human-interface-guidelines/nfc))
- iOS/iPadOS apps read NFC tags (single/multiple objects) while active, using a scanning sheet ("Ready to Scan" / hold device near tag / Cancel).
- Don't ask people to touch; they only need to be near. Say "scan" and "hold near", not "tap"/"touch".
- Avoid technical terms (NFC, Core NFC, Near-field communication, tag). Use "Scan the [object name]." / "Hold your iPhone near the [object name] to learn more about it."; not "Scan the NFC tag."
- Scanning-sheet text: complete sentence, sentence case, ending punctuation, short (no truncation), names the object. First scan: "Hold your iPhone near the [object name] to learn more about it." Later: "Now hold your iPhone near another [object name]."
- Background tag reading (screen on): system matches a tag and shows tappable notification to send data to app. Unavailable when: scanning sheet visible, Wallet/Apple Pay in use, camera in use, Airplane Mode, locked after restart. **Must** also offer in-app scanning for devices without background reading.

## Photo editing ([HIG](https://developer.apple.com/design/human-interface-guidelines/photo-editing))
- Extensions edit in Photos' edit mode, shown in a modal with its own top toolbar; edits save as new files; dismissing confirms or cancels.
- Confirm Cancel when edits exist (say edits are lost); none if no edits.
- **Never** add a custom top toolbar.
- Let people preview edits before closing.
- Use your app icon as the extension icon.

## ResearchKit ([HIG](https://developer.apple.com/design/human-interface-guidelines/researchkit))
- iOS/iPadOS. Guidance is informational, not legal advice.
- **Must** show onboarding in order: 1 Introduction, 2 Eligibility, 3 Informed consent, 4 Permission to access data.
- Introduction: state subject and purpose, call to action; quick login for existing participants.
- Eligibility: determine as early as possible; only necessary requirements; simple language; easy entry.
- Consent: ensure understanding; comply with App Store Guidelines and IRB/ethics requirements. Split long form into sections (data gathering, use, benefits, risks, time, withdrawal) with high-level overview and Learn More detail; whole form viewable before agreeing. Optional comprehension quiz. After agreeing: confirmation, signature, contact details; typically email PDF copy.
- Permissions: explain why for location, Health, other data; request only critical data; notifications permission if required.
- Surveys: state question count and approximate duration; one question per screen; show progress; as short as possible (several short beat one long); explanatory text slightly smaller than the question font; tell when complete.
- Active tasks (speak, tap, walk, memory): clear simple instructions; explain requirements (timing, conditions); make completion evident.
- Profile screen (editable changing data, upcoming activities, leave study, consent document, privacy policy) and motivating dashboard (daily progress, weekly assessments, results, aggregate comparison); both accessible at all times.

## SharePlay ([HIG](https://developer.apple.com/design/human-interface-guidelines/shareplay))
- Activity = shareable synchronous experience; starts from in-app control, FaceTime call, or shared link. Each participant needs own purchase/subscription (system prompts).
- Use for real-time; for async, let people share/save after session (e.g. link).
- Fit the activity: shared view for watching/browsing; role-based views for games.
- Work across Apple platforms, devices, settings.
- Easy start: clear button with SharePlay symbol (e.g. "Start Activity"); also share sheet.
- Frictionless join: reach shared content fast; no unrelated views; sign-in/download/subscribe in a view that dismisses when done; provisional access for nonsubscribers or Family Sharing; defer nonessential steps (e.g. profiles after joining match).
- Concise activity descriptions for invitations (title, short summary, poster), no truncation.
- Keep people oriented: explain changes affecting all (shared pause); in-app cues for who does what (initials next to contributions).
- Term "SharePlay": noun ("Join SharePlay") or verb in UI ("SharePlay Movie" button); no adjective pairing; no variants (SharePlayed, SharePlays, SharePlaying).
- iOS/iPadOS/macOS: support Picture in Picture for shared video (iPhone/iPad PiP window; Mac window brought forward). visionOS-only guidance (spatial templates, Personas, seats): out of scope.

## ShazamKit ([HIG](https://developer.apple.com/design/human-interface-guidelines/shazamkit))
- Microphone needs permission; explain why (purpose string; see Privacy).
- Stop recording as soon as the sample suffices.
- Let people opt in before saving recognized songs to their iCloud library.

## Sign in with Apple ([HIG](https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple))
- Offer in every app version/platform; Face ID/Touch ID/two-factor built in. Optional private relay email.
- Ask to sign in only in exchange for value (explain benefits); delay sign-in as long as possible. If account is required: explain why, set it up, then offer Sign in with Apple + other methods.
- Support linking existing accounts (suggest when shared email matches; or in account settings).
- Commerce: ask account creation after purchase (e.g. Apple Pay confirmation page, "Create Account" / "Sign up with Apple"); skip name/email already given.
- Welcome people right after sign-in; no unnecessary info requests. Show sign-in state ("Using Sign in with Apple") in settings/account.
- Data: minimize requests, explain why, show what you received. Label legally/contractually required (terms, country/region, birth date, real-identity laws) vs optional (explain benefits). **Never** ask for a password (unless they stopped using Sign in with Apple). **Never** ask for a personal email when a private relay address was shared; instead show relay address in app, point to Settings > Apple Account > Password & Security > Apps using Apple Account, or use order/phone number. Ask optional data later, in context; don't block features without it. Be transparent (greet with shared name/email).
- Display prominently: no smaller than other sign-in buttons; visible without scrolling.
- System buttons (`ASAuthorizationAppleIDButton`; web: Sign in with Apple JS): approved look, proportions, localization, corner radius (iOS, macOS, web), VoiceOver label. Titles: "Sign in with Apple", "Sign up with Apple", "Continue with Apple"; pick one variant and use consistently. watchOS: "Sign in" (out of scope).
- Styles: White (all platforms; dark bg with contrast; not light bg); White with outline (iOS, macOS, web; white/light bg lacking contrast; avoid dark/saturated); Black (white/light bg with contrast; not dark bg).
- Corner radius adjustable: square to capsule (`cornerRadius`).
- Minimums (iOS, macOS, web): width 140 pt (140 px @1x, 280 px @2x); height 30 pt (30 px @1x, 60 px @2x); margin 1/10 of button height.

### Custom button
- Allowed when needed (align logos, logo-only, coordinate font/bezel/background); must be instantly recognizable; App Review evaluates all custom buttons.
- Use only Apple Design Resources logo artwork (PNG, SVG, PDF; black and white; small/medium/large). Never create a custom Apple logo or use it as a button itself. Logo file positions logo: match logo file height to button height; don't crop; no added vertical padding.
- Don't change: titles (only "Sign in with Apple", "Sign up with Apple", "Continue with Apple"); shape (logo + text = rectangular; logo-only circular or rectangular); logo and title colors (both black or both white, no custom colors).
- May change: title font (weight, size), title uppercase, background (overall black or white; subtle texture/gradient), corner radius, bezel and shadow.
- Logo + text: SVG/PDF any height; PNG only in 44 pt tall buttons (iOS default and recommended height). Prefer system font: font size = 43% of button height (height = 233% of font size, rounded): 44 pt button / 19 pt font; 56 pt button / 24 pt font. Keep default capitalization (first word and Apple capitalized) unless interface is all-uppercase. Vertically center title, logo matches button height. Logo may be inset from leading edge to align with other logos. Margin between title and right edge >= 8% of button width. Min size same as system: 140x30 pt, margin 1/10 height.
- Logo-only: 1:1 aspect ratio; SVG/PDF any size, PNG only 44x44 pt; no horizontal padding; mask may change shape (circle/rounded rect); never crop to reduce built-in padding or use logo bare; margin >= 1/10 button height.

## Siri ([HIG](https://developer.apple.com/design/human-interface-guidelines/siri))
- Apps are invisible to Siri unless they expose actions (intents) and content (entities) via App Intents; reaches Siri, Spotlight, Shortcuts. Use App schema domains (email, music, photos...) for built-in understanding; App Shortcuts for custom actions outside them.
- Context: annotate onscreen views/content with app entities; donate entities to on-device Spotlight index; donate user actions as intents (recent activity, interests) so Siri anticipates.
- Prioritize most popular actions and contexts (hands-free, device). Use familiar terms (track/song/podcast).
- Index relevant content (recent searches, favorites, bookmarks, wishlist), not everything (email/messaging may expose full catalog).
- **Never** advertise, market, or pitch IAP in Siri-delivered content.
- Custom response only when built-in ones fall short. Optional intent/entity properties and snippets (static/interactive, e.g. playback control) may not appear in non-visual contexts.
- Responses: clear, descriptive ("Which soup?" not "Which one?"); succinct, no filler or humor; deliverable audibly and visually, voice version standalone; inclusive (avoid gendered pronouns: "Who should I send it to?"); open-ended question when option list too long ("What kind of shoes are you interested in?"); device-independent wording; omit your app name (system attributes); appropriate language, respect parental controls (others may hear); specific errors ("Sorry, we're out of chicken noodle soup").
- Editorial: say "Siri", no pronouns (she/him/her). **Never** impersonate Siri, replicate its functionality, or give responses appearing from Apple; don't use reserved phrases like "Call 911" or "Hey Siri" as your own. Siri never translated; in localized text translate only "Hey". Approved "Hey Siri" translations: ar_AE/ar_SA "يا Siri"; da_DK "Hej Siri"; de_AT/de_CH/de_DE "Hey Siri"; en_* (AU, CA, GB, IE, IN, NZ, SG, US, ZA) "Hey Siri"; es_CL/es_ES/es_MX/es_US "Oye Siri"; fi_FI "Hei Siri"; fr_BE/fr_CA/fr_CH/fr_FR "Dis Siri"; it_CH/it_IT "Ehi Siri"; ja_JP "Hey Siri"; ko_KR "Siri야"; ms_MY "Hai Siri"; nb_NO/no_NO "Hei Siri"; nl_BE "Hé, Siri"; nl_NL "Hé Siri"; pt_BR "E aí Siri"; ru_RU "привет Siri"; sv_SE "Hej Siri"; th_TH "หวัดดี Siri"; tr_TR "Hey Siri"; zh_CN "嘿Siri"; zh_HK "喂 Siri"; zh_TW "嘿 Siri".

## Tap to Pay on iPhone ([HIG](https://developer.apple.com/design/human-interface-guidelines/tap-to-pay-on-iphone))
- iPhone iOS only. Needs PSP, entitlement, ProximityReader APIs (or PSP SDK). Follow PSP docs if SDK supplies UI.
- Terms and conditions: merchant must accept before device configuration; use ProximityReader to check status and show flow only when needed; offer in onboarding/in-app messaging (e.g. "Enable Tap to Pay on iPhone" button; "Try a test transaction"). Show only to an administrative user (nonadmin: explain admin access needed; enterprise: admin accepts via web or another app). If PSP requires iOS version, prompt update before terms.
- Tutorial: supported payment types and how to accept each. Offer via Learn More, auto after terms, auto for new users, or in consistent help/settings place. Use Apple-approved marketing assets or `ProximityReaderDiscovery` (always current, localized). Custom tutorial shows: launching checkout per payment type; positioning contactless card or digital wallet; PIN entry incl. accessibility mode; and offers to accept terms at the end if not yet accepted.
- Checkout: prepare for other payment options, checkout before enablement, checkout during configuration, pre-payment actions affecting total.
- Always offer Tap to Pay as a checkout option, enabled or not (show terms if needed, then open the screen after configuration).
- Prepare at app start and after each foreground transition (`prepare(using:)`). Option stays selectable during configuration; show progress indicator (indeterminate usually; determinate if ProximityReader reports ongoing configuration, `PaymentCardReader.Event.updateProgress(_:)`), e.g. "Preparing Tap to Pay on iPhone".
- Multiple methods: easy to find, no scrolling; single method: open automatically at checkout start. Let merchants switch between Tap to Pay and hardware accessories at checkout without visiting settings; set up both together.
- Button label: "Tap to Pay on iPhone" or "Tap to Pay" if space constrained; exception: if it's the only method, existing Charge/Checkout buttons work. Icon (multiple methods): SF Symbols `wave.3.right.circle` or `wave.3.right.circle.fill`. **Never** the Apple logo. Label only for payment actions. Color/shape match your buttons.
- Finalize amount (tips etc.) before the Tap to Pay screen; show final amount there; pre-payment options (payment type) before it.
- Results: app shows results after tap; system shows checkmark/error. Start processing early (`returnReadResultImmediately`). Show authorization progress indicator ("Authorizing") after the tap animation (`PaymentCardReader.Event.readyForTap`). Clearly show declined or successful result; offer digital receipt (QR code, text message).
- On failure (unreadable card, unsupported network, amount not allowed, no online PIN): offer alternate payment (cash), different method (hardware, payment link), or relaunch for another card. SCA regions: issuer may request PIN after the tap, so app may need to show PIN entry instead of result. Offline PIN markets: consult PSP (PIN fallback).
- System errors the merchant must fix: clear description and fix (e.g. alert to update iOS) (`PaymentCardReaderSession.ReadError`). Provide help content and support contact.
- No-amount reads (look up, store card, verify, refund): generic label ("Look Up", "Store Card", "Verify", "Refund"); never "Tap to Pay" wording. Loyalty/pass reads: separate clearly labeled button (e.g. "Loyalty Card"), no payment terms in label.

## VoiceOver ([HIG](https://developer.apple.com/design/human-interface-guidelines/voiceover))
- Alternative labels for all key elements, including custom ones (system controls have generic labels; make more descriptive); keep current as UI changes.
- Describe meaningful images (only what the image itself conveys; nearby captions already read). Charts/infographics: concise description; expose interactions to VoiceOver. Exclude decorative images (`accessibilityHidden(_:)`, `isAccessibilityElement`).
- Titles unique and succinct per screen; accurate section headings.
- Describe visual-only relationships (grouping, order, links); reading follows locale order (US: top-bottom, left-right). Group image with its caption (`shouldGroupAccessibilityChildren`).
- Notify VoiceOver of visible content/layout changes (`AccessibilityNotification`).
- Support rotor (headings, links; also braille keyboard): `AccessibilityRotorEntry` (SwiftUI), `UIAccessibilityCustomRotor`, `NSAccessibilityCustomRotor`.

## Wallet ([HIG](https://developer.apple.com/design/human-interface-guidelines/wallet))
- Passes: tickets, boarding passes, membership/reward cards, coupons. Use Pass Designer to design/preview (boarding, coupon, event ticket, store card, generic, poster generic).
- Adding: offer one-tap system add on new pass (purchase, registration); frequent predictable actions (flight check-in) may add in background after one-time authorization (Wallet notifies); custom review view with "Add to Apple Wallet" button (`PKAddPassButton`; badge for email/web). Suggest adding externally created passes on next app open; if declined, **never** ask again. Add related passes together as a group (multi-leg flights; web: bundle). Show Add to Apple Wallet button where pass info appears if pass missing/declined/removed. Link to existing pass ("View in Wallet").
- Set expiration date, relevant date, voided so Wallet hides expired passes. **Always** get permission before deleting passes (e.g. setting manual vs automatic removal; alert).
- Supply relevance info (time/place) so system surfaces pass on Lock Screen (gym card on arrival; event tickets may start Live Activity).
- Keep passes updated (gate changes). Change messages only for time-critical updates (per field); **never** marketing or noncritical.
- Anatomy: pass fields (layout) + semantic tags (system understanding: Lock Screen surfacing, featured actions such as directions/event guide). Poster event and semantic boarding passes require semantic tags (automatic layout); also include pass fields for older iOS. Sheets from front for supplemental info; back for rarely needed info/legal text.
- Field areas: logo + logo text and header (visible when collapsed), primary (most important), secondary and auxiliary, footer (category e.g. "Family", "Annual"), back fields.

### Designing passes
- Clean, simple, at home in Wallet; don't just replicate physical look.
- Works on all devices; Apple Watch shows less. No essential info in elements that may be unavailable; no image padding (watchOS crops white space).
- Uncluttered front: essential info (event date, balance) in header (visible collapsed); rare details on additional info sheet.
- Identifiable via brand colors, images, icons, full-art background. Sufficient text contrast vs solid and image backgrounds.
- Device-neutral wording (avoid "Slide to view").
- Styles: boarding pass (airline via semantic tags; other transit via pass fields; one trip each), coupon, event ticket (full-art background, poster style via semantic tags; non-poster uses standard fields, optional background and thumbnail; season tickets possible), store card (loyalty, discount, points, gift; shows balance), poster generic (full background image, flexible), generic (gym card, coat check).

### Pass images
- PNG, @2x and @3x. Images for visuals only: no embedded text (not accessible, may not show) or barcodes (use Pass Designer/APIs). Small files (passes arrive by email/web). Provide a pass icon (Lock Screen, Mail, Wallet).

| Image | File | Styles | Size (pt) |
|---|---|---|---|
| Logo | logo.png | non-semantic airline boarding, other boarding, coupon, non-poster event, generic, store card | width 50-160, height 50 |
| Primary logo | primaryLogo.png | airline boarding, poster event, poster generic | width 30-126, height 30 |
| Secondary logo (bottom-trailing of poster event) | secondaryLogo.png | poster event | width 12-135, height 12 |
| Icon (square; system rounds corners) | icon.png | all | 38x38 |
| Strip | strip.png | coupon, store card | 375x144 |
| Thumbnail (square; rounded corners art, transparent PNG) | thumbnail.png | event ticket, generic | width 60-90, height 90 |
| Background (non-poster) | background.png | event ticket | 343x503 |
| Poster background | artwork.png | poster event, poster generic | 358x448 |
| Footer | footer.png | airline boarding only | 268x15 |

- Logo artwork: no inner drop shadows. Logo sits top leading. Strip: text may overlay, so keep contrast, uncluttered text areas, important visuals toward bottom or trailing edge, no embedded text. Poster backgrounds: keep content inside safe area (material strip covers bottom edge; account for barcode; `footerBackgroundColor`); preview in Pass Designer.

### Order tracking
- Wallet shows active/completed orders from Wallet Orders schema; supply as much data as possible (descriptions, status, contacts, shipping/pickup details, ETAs, addresses, tracking numbers, pickup instructions).
- Make adding easy: Apple Pay transactions auto-add (`PKPaymentOrderDetails` app, `ApplePayPaymentOrderDetails` web); in iOS 17+ show system "Track with Apple Wallet" button (`AddOrderToWalletButton`) on confirmation/status/tracking pages and emails; already-added order opens Wallet.
- Provide order info right after placement, even if pending (e.g. "Check back later for full order details."). Give fulfillment info ASAP and keep status current (Order Placed, Processing, Ready for Pickup, Picked Up, Out for Delivery, Delivered, Issue, Canceled); system may notify.
- Logo: PNG or JPEG, 300x300 px, nontransparent background. Product images: distinct, PNG or JPEG, 300x300 px each, straightforward depiction, solid nontransparent background (no busy lifestyle shots).
- Brief, clear, localized text; displayed price matches the final confirmed price.
- Provide universal link to order management; clear line items (`LineItem`: price, name, image; fulfillment lists only its items; optional PDF receipt per transaction); prioritized list of your apps for the order link (highest installed app, else first); avoid duplicate notifications (suppress Wallet ones when your app is installed); contact methods (website link required; optionally Messages for Business, phone, email, support page).
- Tracking: orders can have multiple fulfillments (shipping or pickup). Give location and ETA; direct carrier tracking link plus number; scannable barcode for pickup; clear instructions. Keep the fulfillment screen focused on tracking over promotion. Shipping: set `carrier` if known (else default "Track Shipment"); use `onTheWay`, `outForDelivery`, `delivered` when interim steps known, else `shipped`; provide tracking link when available.
- Status text approachable, accurate, on brand; for Issue/Canceled say why and what to do.

### Identity verification
- iOS 16+: Wallet ID card data shared with an app or App Clip; app receives only encrypted data. In-person verification: see ID Verifier.
- Use Apple's Verify with Wallet button (`VerifyIdentityWithWalletButton`); show only if device can return requested data; provide fallback verification method.
- Ask at the moment needed (completing the transaction; not at account creation or before the process starts).
- **Must** write purpose string: brief complete sentence, direct, specific, sentence case, active voice, ending period. Examples: "Federal law requires this information to verify your identity and also to help [App Name] prevent fraud."; "Applicable state law requires [App Name] to verify your driving privileges."
- Ask only needed data (age threshold via `age(atLeast:)`, not birth date). State whether and how long you retain data (`PKIdentityIntentToStore`).
- Button labels: "Verify Age with Apple Wallet" (age completes transaction), "Verify Identity with Apple Wallet" (identity completes transaction), "Continue with Apple Wallet" (part of a larger verification needing other info like SSN/phone), "Verify with Apple Wallet" (other flows). Multiline variant automatic when narrow (`PKIdentityButton.Label`). Always white text on black; optional light-outline style for dark backgrounds (`PKIdentityButton.Style.blackOutline`); `cornerRadius` adjustable.
- watchOS pass layout: out of scope.
