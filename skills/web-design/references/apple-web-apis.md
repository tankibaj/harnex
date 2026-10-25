# Apple technologies with web APIs

last-checked: 2026-10-25
scope: HIG rules for Apple Pay on the web, Sign in with Apple JS, MapKit JS / Maps Embed, and the Add to Apple Wallet badge on webpages. pt on the web = CSS px (the "px @1x/@2x" columns are device pixels; CSS size is the pt value). Use Apple's own button/badge APIs and artwork; never redraw them.

## Apple Pay on the web ([HIG](https://developer.apple.com/design/human-interface-guidelines/apple-pay))
- For physical goods, services (memberships, hotels, tickets), donations, subscriptions. Digital content/virtual goods follow the platform's in-app purchase rules, not this.
- Offer it on every browser/device that supports it; **never** show Apple Pay where unsupported (feature-detect via Apple Pay JS, e.g. `applePayCapabilities`, or the Payment Request API; confirm API names in Apple's developer docs).
- If you check for an active Wallet card, **must** make Apple Pay the primary (not necessarily sole) option everywhere you check; no separate step or flow; may preselect.
- Apple Pay button only to start payment or, where fitting, setup. No other use.
- Custom button starting Apple Pay: **must not** show "Apple Pay" text or logo on it; show the Apple Pay mark or a text mention on the same page (mark above an "Order Now" button is right; mark above a button titled "Apple Pay" is wrong).
- The mark communicates acceptance only; **never** a button.
- Don't hide the Apple Pay button or style it disabled; if not ready (size or color unselected), explain after the tap.
- List Apple Pay as a payment option in semantic markup (structured data `paymentAccepted`) for search engines. **Must** include a privacy statement and follow Apple's acceptable-use guidelines for Apple Pay on the web.

### Streamlining checkout
- Cohesive, branded checkout; avoid extra pages or new windows during web checkout.
- Assume people want Apple Pay: first option, larger, or separated by a line.
- Product detail pages: an Apple Pay button for single-item purchase (that item only, not the cart; remove from cart after if present). Express checkout from a cart: show the sheet immediately; single shipping method and destination.
- Coupons/promo codes enterable on the sheet, especially for express checkout.
- Collect required options (color, size) before the button; if missing, highlight, warn and scroll/focus the field.
- Optional data (gift message, delivery notes): before or after; the sheet cannot take it.
- Multiple shipping methods/destinations per item: collect before the sheet. Store pickup: choose location before the sheet; sheet shows its address read-only.
- Prefer contact, shipping and payment data from Apple Pay over stored data; fetch the latest.
- **No** account creation before purchase; offer it on the confirmation page with prefilled fields.
- Report results and errors (bad address) in the sheet. Show an order confirmation with ship timing and a status check. Apple Pay mention optional: after last 4 digits ("1234 (Apple Pay)") or a note ("Paid with Apple Pay").

### Payment sheet content
- Request/present only essential info (no shipping address for an e-delivered gift card).
- Show an active coupon; allow entry on the sheet.
- Shipping method choice: description, cost, optional delivery or pickup date or range (time zone aware).
- Line items only for extra charges, discounts, pending costs, add-on donations, recurring/future payments (label + cost; recurring adds frequency). **Never** itemize products as line items. Keep each short, one line.
- Total line: "Pay [Business_Name]" using the name on the card statement. Intermediary: "Pay [End_Merchant (via Your_Business)]".
- Cost may change after authorization (ride, tip) where regulation allows: explain and mark the subtotal "Amount Pending"; preauth amounts must be accurate.
- No extra spinners or progress; the sheet owns the loading state.
- Website icon (shown in Handoff authorization; subscriptions in Wallet): 60x60 pt = 120x120 px @2x, 180x180 px @3x. Provide it if the site supports Apple Pay.

### Errors and problems
- Validate on sheet appear, field change and after authentication; supply custom messages. Before authorization only card type and a redacted shipping address are available; validate what you can and show errors on authorization failure.
- Don't force business logic: ignore extra data (Zip+4 for a 5-digit zip), infer missing, accept varied phone formats.
- Report errors with the correct status code so the sheet shows the most relevant one.
- Error text: name the field and expected value ("Zip code doesn't match city", "Shipping not available for this state"; not "Address is invalid"). Noun phrases, sentence caps, no ending punctuation, 128 characters or fewer.
- An interruption (cancel, timeout) dismisses the sheet: **must** cancel the in-progress payment; people restart from the button.

### Subscriptions and donations
- Recurring: fixed or (where regulation allows) variable. Explain frequency and terms before the sheet.
- Line items: billing frequency, discounts, upfront fees; if nothing is due now, disclose when billing starts. Trials: trial amount (including $0), regular amount, start date of regular billing. Total = amount billed now.
- Show the sheet on a subscription change only when fees increase.
- Billing agreement text: concise plain-language summary, no duplicates; leave blank when unsure.
- Donations (approved nonprofits only): a line item "Donation $50.00"; preset amounts (e.g. $25, $50, $100) plus "Other Amount".

### Buttons
- **Must** use Apple's button API/web component (confirm the current element and CSS names in Apple's developer docs) for approved captions, fonts, colors, scaling, localization, corner radius and screen reader label. **Never** design or replicate it.
- Types: Buy (purchase, product, cart), Pay (bills, invoices), Check Out (when other buttons start "Check Out"), Continue (when others start "Continue"), Book (flights, trips), Donate (nonprofits), Subscribe, Reload / Add Money / Top Up (match your service's term), Order (meals, flowers), Rent, Support / Contribute (match your term), Tip, plain Apple Pay (no call to action; smaller min width; system may substitute if a type is unsupported).
- Set Up Apple Pay button: device supports Apple Pay but it isn't set up; place in settings, profile, interstitial.
- Styles: Automatic (follows system appearance); Black on white/light backgrounds with contrast, never on dark; White with outline on white/light backgrounds lacking contrast, never on dark or saturated; White on dark backgrounds with contrast, not on light.
- Size and position: no smaller than other payment buttons; visible without scrolling. Side by side: Apple Pay to the right of Add to Cart. Stacked: above Add to Cart.
- Corner radius adjustable, square to capsule; match your other buttons.
- Minimums (title length varies by locale; if too small the system substitutes the plain Apple Pay button, except Set Up Apple Pay):

| Button | Min width | Min height | Min margins |
|---|---|---|---|
| Apple Pay (plain) | 100 pt (100 px @1x, 200 px @2x) | 30 pt (30 px @1x, 60 px @2x) | 1/10 of button height |
| Book, Buy, Check Out, Donate, Set Up, Subscribe | 140 pt (140 px @1x, 280 px @2x) | 30 pt (30 px @1x, 60 px @2x) | 1/10 of button height |

### Mark
- Show among other payment options as an availability marker. Apple artwork only; change height only, and keep it at least the height of other payment marks.
- Don't change width, corner radius or aspect ratio; no trademark symbol or extra content; keep the border; no shadows, glows or reflections; no flip, rotate or animation.
- Clear space at least 1/10 of mark height; don't share a border with another graphic or button.

### Wording
- "Apple Pay": two words, capital A and P; all caps only in an all-caps style. Never plural or possessive. Never use the Apple logo as the word "Apple" ("Purchase with Pay", "ApplePay" are wrong). Never translate.
- Match your site's font and size; don't mimic Apple typography.
- A text-only mention in payment selection only if all other options are text-only; otherwise use the mark.

## Sign in with Apple JS ([HIG](https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple))
- Offer it in every version of your site/app and on non-Apple platforms too. Optional private relay email.
- Ask people to sign in only in exchange for value (explain benefits); delay sign-in as long as possible. If an account is required: explain why, set it up, then offer Sign in with Apple beside other methods.
- Support linking existing accounts (suggest when the shared email matches; or in account settings).
- Commerce: ask for account creation after purchase (confirmation page: "Create Account"/"Sign up with Apple"); skip fields already given.
- Welcome people right after sign-in; no unnecessary info requests. Show sign-in state ("Using Sign in with Apple") in account settings.
- Data: minimize, explain why, show what you received. Label legally required data (terms, country, birth date) vs optional (explain benefits). **Never** ask for a password (unless they stopped using Sign in with Apple). **Never** ask for a personal email when a private relay address was shared; show the relay address in the product and point to Settings > Apple Account > Password & Security > Apps using Apple Account, or use order or phone number. Ask optional data later, in context; don't block features without it. Greet with the shared name/email.
- Display prominently: no smaller than other sign-in buttons; visible without scrolling.
- Use the Apple-provided web button (Sign in with Apple JS or the button generator): approved look, proportions, localization, corner radius, accessible name.
- Titles: "Sign in with Apple", "Sign up with Apple", "Continue with Apple"; pick one and use it consistently.
- Styles: White (dark backgrounds with contrast; not light); White with outline (white/light backgrounds lacking contrast; avoid dark or saturated); Black (white/light backgrounds with contrast; not dark).
- Corner radius adjustable, square to capsule.
- Minimums (web): width 140 pt (140 px @1x, 280 px @2x); height 30 pt (30 px @1x, 60 px @2x); margin 1/10 of button height. Title length varies by locale.

### Custom button
- Allowed when needed (align logos, logo-only, coordinate font/bezel/background); must be instantly recognizable; reviewed for compliance.
- Only Apple Design Resources logo artwork (PNG, SVG, PDF; black and white). Never create a custom Apple logo or use it as the button by itself. Match logo height to button height; don't crop; no added vertical padding.
- Don't change titles (only the three above), shape (logo + text = rectangle; logo-only = circle or rectangle), or colors (logo and title both black or both white, no custom colors).
- May change: title font (weight, size), uppercase title, background (black or white overall; subtle texture or gradient), corner radius, bezel, shadow.
- Logo + text: SVG/PDF any height; PNG only at 44 pt tall. Prefer the system font: font size = 43% of button height, i.e. height = 233% of font size (rounded): 44 pt button / 19 pt font; 56 pt button / 24 pt font. Keep default capitalization (first word and Apple capitalized) unless the interface is all uppercase. Title centered vertically; margin between title and right edge at least 8% of button width; min size 140x30 pt, margin 1/10 height. Logo may be inset from the leading edge to align with other logos.
- Logo-only: 1:1 aspect ratio; SVG/PDF any size, PNG only 44x44 pt; no horizontal padding; mask may change shape (circle, rounded rect); never crop to reduce built-in padding or use the logo bare; margin at least 1/10 of button height.
- Give the custom button an accessible name ("Sign in with Apple").

## MapKit JS and Maps Embed ([HIG](https://developer.apple.com/design/human-interface-guidelines/maps))
- Keep the map interactive (zoom, pan, rotate); no non-interactive element obscuring it.
- Emphasis: default (saturated, aligned with Apple Maps) for most uses; muted (desaturated) for info-rich custom content.
- Offer search plus category filters (clothing, housewares, electronics for a mall). Style the selected element distinctly (outline, color change).
- Cluster overlapping POIs into one pin with a count that expands on zoom.
- Apple logo and legal link: don't cover permanently (temporary is fine). Padding 7 pt on the sides, 10 pt above and below; keep them fixed to the map, not moving with your UI. For custom UI that moves over the map (a bottom card), place them 10 pt above its lowest resting position. They are not shown on maps smaller than 200x100 px.
- Annotations: match your site's style; default marker is a red tint with a white pin icon; tint adjustable; icon can be a string (2-3 characters, any Unicode) or an image/logo. Make custom info for standard features independently selectable.
- Overlays: above roads (default; below buildings and trees) or above labels (hides everything beneath).
- Custom controls need contrast against the map: thin stroke, light drop shadow, or blend modes. Controls keep 44x44 px targets and keyboard access; provide a text alternative (list of places/addresses) for the map.
- Map text and controls remain usable at 200% zoom; map is never the only way to find an address.

### Place cards
- Show rich place info (hours, phone, address). In a map: on selection, for your places or other features. On the web: the Maps Embed API shows a place card by default for a single place.
- Styles: automatic (by map size); callout (popover next to place; full = large and detailed, compact = concise); caption ("Open in Apple Maps" link); sheet. Choose per context: small map with many annotations: compact. Must look good at every viewport (set a minimum width for the full callout). Avoid duplicating info already on the page (use compact or caption). Keep the selected location visible (offset the map).
- Outside a map (search results, store locator): **must** include a map in the place card. Use cues (names, addresses, button, or a pin icon with the name) that a place card can open.

### Indoor maps
- Adjust detail by zoom: large areas always, finer features/labels progressively. Distinctive color + icons by area or service type.
- Floor picker for multiple levels: concise, floor numbers over names.
- Show surrounding areas for context; dim and recolor if non-interactive.
- Offer routing to nearby transit/parking, and a switch to Apple Maps.
- Limit scrolling away from the venue; keep part of the indoor map onscreen, with scale limits tied to zoom.
- Match your site's style; don't copy Apple Maps.

## Add to Apple Wallet badge on webpages ([HIG](https://developer.apple.com/design/human-interface-guidelines/wallet))
- Use Apple's "Add to Apple Wallet" badge artwork on webpages and emails (follow Apple's Add to Apple Wallet guidelines for sizes and clear space); don't redraw it.
- Show the badge wherever the pass's info appears when the pass is missing, declined or removed. Link to an existing pass instead ("View in Wallet") once added.
- A website that creates a pass suggests adding it to Wallet the next time the person opens your app; if declined, **never** ask again.
- Group related passes: a website distributing multiple passes (event tickets, multi-leg flights) bundles them so one add covers all.
- Keep pass downloads small (people receive them by email or webpage): pass images PNG @2x and @3x, no embedded text or barcodes in images.
- Set expiration, relevant date and voided state so Wallet hides expired passes; always get permission before deleting passes. Change messages only for time-critical updates, **never** marketing.
- Order tracking: after an Apple Pay web transaction use the order details API (`ApplePayPaymentOrderDetails`) to add the order automatically. Provide order info right after placement even if pending; keep status current (Order Placed, Processing, Ready for Pickup, Picked Up, Out for Delivery, Delivered, Issue, Canceled). For Issue/Canceled say why and what to do. Logo and product images: PNG or JPEG, 300x300 px, nontransparent background. Provide an order-management link and a website contact link (required).
