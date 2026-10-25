# Writing and inclusive copy for web UI

last-checked: 2026-10-25
scope: HIG writing, inclusion, alerts, offering-help and generative-AI copy rules translated for web UI text; capitalization picks marked "house" are choices, not HIG.

## Writing ([HIG](https://developer.apple.com/design/human-interface-guidelines/writing))

### Voice and tone
- Decide the voice: who you address, familiar vocabulary, intended feeling (banking: trust; game: fun). Keep a term list so words stay consistent.
- Tone follows context: serious and direct for errors and warnings, light for congratulations. Same voice everywhere, tone shifts.
- Be clear: easy words, cut unneeded ones, read aloud when unsure.
- Write for everyone: plain language, localizable, no jargon, no gendered terms.
- Each screen has one purpose: most important info first; one idea per screen or block; format for scanning (short paragraphs, lists, headings).
- Consistent patterns: same action = same word, everywhere (not Remove here, Delete there).

### Capitalization (pick one per element type, apply everywhere)
- House defaults: sentence case for body, labels, field names, menu items, toasts, helper text, headings; Title Case for buttons and tabs only if the repo already uses it. Never mix inside one element type.
- HIG data points: alerts use sentence case for complete-sentence titles (with punctuation), title case for fragment titles (no period); alert buttons sentence case; labeled buttons in the HIG are title case. Pick one rule per element type and write it in the repo's style guide.
- Examples below use sentence case.

### Buttons and links
- Start with a verb and describe the result (dialog buttons: 1-2 words): "Save draft", "Add to cart", "Delete draft". Name the object when several actions share a screen.
- Plain over clever: "Send", not "Let's do it!".
- **Never** "OK", "Yes", "No" when a verb fits; prefer a specific verb over a generic "Submit"; OK only in a purely informational dialog. Cancel always cancels.
- Dialog: confirm label repeats the action from the title ("Delete draft" / "Cancel"). Destructive: label states the destruction.
- **Never** "Click here" or "Read more" alone: link text describes the destination and works out of context ("View billing history"). Use "select"/"tap"/"press" by device, or neutral "go to"; do not say "click" on touch.
- Icon-only buttons: `aria-label` in the same verb form.
- Multistep flows: first step "Get started", middle steps "Continue" or "Next" (pick one, use throughout), last step "Done" or the real result ("Place order").
- Links go straight to a setting or page instead of describing where it lives ("Open notification settings", not "Go to Settings > Account > Notifications").

### Pronouns and person
- Address people as "you"/"your"; never "the user", "the player".
- Possessives sparingly: "Favorites" over "Your favorites"; be consistent, do not switch between "my" and "your" in one flow.
- **Never** "we" for errors or limits: "Unable to load content", not "We're having trouble loading this content". Reserve "we"/"our" for the company in places that really speak for it (about, billing, legal) and only there.
- Gestures by device: select/tap for touch, click/press for pointer; or "choose". Prefer verbs that work on every input.
- Small screens need brevity; large screens need larger text, which also argues for brevity. Check text expansion for localization (30-50% longer is common; house heuristic).

### Errors
- Prevent first: constraints, inline validation hints, sensible defaults, formats shown before typing.
- Show the error right next to the field it concerns, not only in a banner. Banner or summary for page-level or multi-field errors, linking to each field.
- No blame, no jargon, no "Oops!", no "Uh-oh", no codes alone, no "Invalid ...".
- Say how to fix, with an example:
  - "Choose a password with at least 8 characters" (not "That password is too short").
  - "Use only letters for your name" (not "Don't use numbers or symbols").
  - "Enter an email like name@example.com" (not "Invalid email").
- Error title or lead states what happened, in context, and why when known; specific, not "Error" or "Error 329347 occurred". Short enough to fit two lines.
- Page-level failure with no fix by wording: rethink the interaction (retry, offline mode, draft saved) rather than polish the message.
- Offer next step as a button or link ("Try again", "Check connection").
- Tie to the field with `aria-describedby`, announce via live region (a11y.md).
- Match delivery to urgency: inline text for field issues, toast for passing status, banner for page state, dialog only when action is required now.

### Alerts and dialogs
- Title: say what happened or what will happen, specific and complete, not verbose; at most two lines. Not "Error", not "Are you sure?" alone.
- Informative text only if it adds value; complete sentences, short.
- Buttons: 1-2 word verbs tied to the title ("View all", "Reply", "Ignore"); Cancel for cancel; no Yes/No.
- Destructive: name the object and consequence: "Delete 'Q3 plan'? This can't be undone." Reversible actions use Undo toast instead (SKILL.md).
- Toast copy: past-tense result + optional Undo: "Draft deleted. Undo".

### Empty states
- Give a clear next step as a button or link ("Add your first project"); explain what the area is for in one line.
- Useful, in-context content (example, template, import); show the voice.
- **Never** show crucial info that disappears (a hint that vanishes after one use); put persistent help elsewhere.
- Differentiate first use, no results ("No results for 'xyz'. Check the spelling or clear filters."), and cleared/done states.
- Do not disable or hide the navigation item; explain the empty section (SKILL.md).

### Placeholder, hint, field copy
- Visible label on every field, always (SKILL.md). Placeholder = example of format ("name@example.com", "Your name"), never the label; it disappears and has weak contrast.
- Helper text under the field for constraints ("8 or more characters"); required/optional stated in text, not only `*`.
- Field labels: nouns, short ("Email", "Phone number"); optional marker "(optional)".
- Errors: see Errors.

### Settings labels
- Clear and practical: names the thing, not the technology.
- Add a description when the effect of turning it on is not obvious; say what happens when on, the off state is inferred ("Notify me when someone replies").
- Toggles: label the setting as a statement of the on state, not as an action verb.
- Link or button directly to a setting rather than describing where to find it.

### Tooltips and help ([HIG](https://developer.apple.com/design/human-interface-guidelines/offering-help))
- Tooltip (title/description for icon buttons, truncated items): 60-75 characters max (localization changes length); a sentence fragment, drop articles ("Delete selected rows").
- Describe the action, not the control; do not restate the visible label.
- Needs more text than that: simplify the interface, or use inline help or a link.
- Tooltips must work for keyboard and touch (a11y.md 1.4.13); never the only place for essential info.

### Progress and loading
- Specific messages ("Summarizing key themes from your notes"), not "Processing..." or "Loading...".
- On failure: plain language plus next step.

## Inclusion ([HIG](https://developer.apple.com/design/human-interface-guidelines/inclusion))
- Plain, direct, respectful language. Review copy for exclusion and tone from several perspectives (an academic tone implies a high-education reader).
- Define technical or specialized terms before use; make definitions easy to find (tooltip, glossary link). Plain words translate and read better.
- Replace colloquial phrases and idioms ("peanut gallery", "grandfathered in", "hit it out of the park", "sanity check", "whitelist/blacklist"): culture-specific, hard to translate, sometimes carry exclusionary history. *(house)* Prefer "allowlist/blocklist", "legacy exception".
- Humor: think twice; subjective, hard to translate, can confuse or insult. Never in errors and sensitive flows.
- Gender: avoid unneeded references ("Subscribers can post recipes", not "his or her recipes"); helps localization into gendered-pronoun languages. Gender-neutral human figures. Collect gender only when needed, with inclusive options and decline-to-answer.
- People-first, never use disability as a negative quality ("blind spot", "crippled", "insane"). Use the language a community uses for itself when specific.
- Names: allow one-field full name, no assumption of first/last order, length, ASCII, or middle names. Titles optional.
- No assumed family structure, address format, or phone format; use `autocomplete` and locale-aware formats.
- Dates, times, numbers, currency by user locale (`Intl.*`), not by language.
- Color and imagery cultural meaning checked per locale (foundations-web.md).
- Security questions: universal prompts, not experience-specific ones.
- Onboarding assumes no prior knowledge; skippable, step by step.

## Permission and privacy copy ([HIG](https://developer.apple.com/design/human-interface-guidelines/privacy))
- Explanation text sits next to the trigger, before the browser prompt. One brief, complete sentence, active voice, specific, sentence case, ending period.
  - Good: "Your location is used to find stores near you."
  - Bad: "Location is needed for a better experience." (vague, passive); "Allow location." (command, no reason).
- Pre-prompt button: "Continue" or "Next", never "Allow"; no extra "Not now" unless legally required.
- State what is collected, why, and what happens if declined (feature unavailable, not account blocked).
- Denied state: say what is off and how to change it ("Notifications are off. Turn them on in your browser's site settings.").
- Do not ask on page load; ask when the feature starts.
- Passkeys and sign-in copy: "Sign in with a passkey", "Continue with email"; avoid fear language.

## AI disclosure and generative copy ([HIG](https://developer.apple.com/design/human-interface-guidelines/generative-ai))
- Say where AI is used: label generated content and the feature ("Summary generated by AI"). **Never** pass AI output off as human-written; follow regional disclosure rules.
- Set expectations before use: what it can do, known limits, why results may be weak; curated starter prompts for open-ended inputs.
- Content may contain errors: say so near the output ("AI can make mistakes. Check important details."). Avoid AI for factual or harm-prone tasks without verified sources.
- Controls beside output: Edit, Undo, Retry, Adjust; acknowledge when corrections applied.
- Blocked request: coach better input with examples ("Unable to use that description. Try describing the scene, not a person.").
- Specific progress ("Drafting your summary"), not "Processing"; on failure, plain language plus next step.
- Data: say what is sent, whether it leaves the device, whether it trains models; ask before using personal data; clear opt-out.
- Offer a non-AI path when AI is unavailable or declined.
- Feedback: voluntary, unobtrusive; describe options by consequence ("Show fewer summaries like this"), not "Dislike"; icons only with text.
- Attribution wording factual, no emotion ("Because you read nonfiction", not "love"); confidence as words ("high chance") rather than raw percentages unless expected (weather, polls).
- Never automate destructive or hard-to-undo actions (delete, purchase) without explicit confirmation.
