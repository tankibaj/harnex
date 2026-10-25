# Components: selection and input

last-checked: 2026-10-25
scope: color wells, combo boxes, image wells, pickers, segmented controls, sliders, steppers, text fields, toggles, virtual keyboards for iOS, iPadOS, macOS

## Color wells ([HIG](https://developer.apple.com/design/human-interface-guidelines/color-wells))
- Control to adjust color of text, shapes, guides, other elements; opens a color picker on tap/click (system or custom).
- Prefer system color picker: familiar, consistent across iOS/iPadOS/macOS, lets people save colors usable in any app.
- iOS/iPadOS: no additional considerations. API: `UIColorWell`, `UIColorPickerViewController`.
- macOS: well highlights when active, opens picker, updates to chosen color. Support drag and drop of colors well-to-well and picker-to-well. API: `NSColorWell`.
- Other platforms: out of scope.

## Combo boxes ([HIG](https://developer.apple.com/design/human-interface-guidelines/combo-boxes))
- macOS only (not iOS/iPadOS). Text field + pull-down button: type a custom value or pick predefined; custom values are not added to the list.
- Default value: meaningful item from list that hints at hidden choices (empty allowed; need not be first item).
- Intro label signals item types; title-style caps, ends with colon.
- Offer relevant choices (likely options plus free entry).
- List items not wider than the text field (truncation).
- See Text fields, Pull-down buttons. API: `NSComboBox`.

## Image wells ([HIG](https://developer.apple.com/design/human-interface-guidelines/image-wells))
- macOS only. Editable image view. Selected well: copy/paste/delete image. Dragging an image in works without selecting.
- Required-image well: revert to default image when cleared.
- If copy/paste supported, make standard Edit menu items and shortcuts available.
- API: `NSImageView`.

## Pickers ([HIG](https://developer.apple.com/design/human-interface-guidelines/pickers))
- Scrollable lists of distinct values; values and order follow device language/location.
- Use for medium-to-long lists. Short list: pull-down button instead (picker too heavy). Very large set: list/table (adjustable height, table index).
- Predictable, logically ordered values (hidden values guessable; e.g. alphabetized countries).
- Avoid switching views to show a picker; display in context below/near edited field. Typically bottom of window or in popover.
- Date picker minutes: default 60 values (0-59); may increase interval if it divides evenly into 60 (e.g. quarter-hour 0/15/30/45).
- iOS/iPadOS date picker styles: Compact (button showing editable date/time in modal view); Inline (time only: button with wheels; date/time: inline calendar); Wheels (scrolling wheels, supports keyboard entry); Automatic (system-chosen by platform and mode).
- iOS/iPadOS modes: Date (months, days, years); Time (hours, minutes, optional AM/PM); Date and time; Countdown timer (hours and minutes, max 23 h 59 min; not available in inline or compact styles).
- Use compact style when space constrained: button in accent color; tap opens modal with calendar/time editor; multiple edits allowed, tap outside to confirm.
- macOS date picker styles: textual (limited space, specific date/time selection) and graphical (browse calendar, select date range, or clock face look). API: `NSDatePicker`.
- API: SwiftUI `Picker`/`DatePicker`, `UIDatePicker`, `UIPickerView`.
- Other platforms: out of scope.

## Segmented controls ([HIG](https://developer.apple.com/design/human-interface-guidelines/segmented-controls))
- Linear set of 2+ segments, each acts as button; text or images; usually equal width. Single choice (iOS/iPadOS/macOS); macOS also multiple choice, or momentary action buttons without selection state (`isMomentary`, `NSSegmentedControl.SwitchTracking.momentary`; e.g. Mail Reply/Reply all/Forward).
- Use for closely related choices affecting an object, state, or view (inspector attributes, toolbar view actions).
- Consider when grouping or visible selection state matters; grouping persists regardless of view size/location.
- Keep control type consistent within one control: no actions in a selection control, no selection state in an action control.
- Segment count: about 5-7 max in wide interface; about 5 max on iPhone.
- Keep segment sizes consistent (equal widths; consistent icon/title widths).
- Content: text or images, not mixed. Similar content size per segment.
- Labels: nouns/noun phrases, title-style caps. Text-labeled control needs no intro text.
- iOS/iPadOS: use to switch closely related subviews (Calendar New Event: event vs reminder). Completely separate app sections: tab bar.
- macOS: consider intro text; with symbols/icons add label under each segment; provide tooltip per segment if app uses tooltips.
- macOS: use tab view (not segmented control) for view switching in main window area. Segmented control fine in toolbar or inspector pane.
- macOS: consider spring loading (Magic Trackpad: drag items over segment + force click to activate without dropping; dragging can continue).
- API: SwiftUI `segmented`, `UISegmentedControl`, `NSSegmentedControl`.
- Other platforms: out of scope.

## Sliders ([HIG](https://developer.apple.com/design/human-interface-guidelines/sliders))
- Horizontal track + thumb between min and max; track min-to-thumb filled with color; optional left/right icons showing min/max meaning.
- Customize appearance (track color, thumb image/tint, icons) if it adds value (e.g. small/large image icons for size).
- Familiar directions: min at leading, max at trailing (horizontal); min at bottom, max at top (vertical).
- Consider pairing with text field and stepper (wide ranges: exact value display/entry; stepper for whole increments).
- iOS/iPadOS: **Never** use a slider for audio volume; use volume view (volume slider + output route control). See Playing audio.
- macOS: tick marks optional. Linear thumb = narrow lozenge; circular slider thumb = small circle with tick marks as evenly spaced dots.
- macOS: consider live feedback while value changes (Dock size slider).
- macOS: horizontal slider for fixed start/end (e.g. opacity 0-100 percent); circular slider for repeating/unbounded values (rotation 0-360 degrees; four spins = 1440 degrees).
- macOS: optional intro label, sentence-style caps, ends with colon.
- macOS: tick marks add clarity/accuracy; labels (numbers/words) optional; not every tick needs one, min and max often enough; nonlinear scales (Energy Saver) get periodic labels. Tooltip with thumb value on pointer hover.
- API: SwiftUI `Slider`, `UISlider`, `NSSlider`.
- Other platforms: out of scope.

## Steppers ([HIG](https://developer.apple.com/design/human-interface-guidelines/steppers))
- Two-segment control to increment/decrement a value; displays no value itself; sits next to a field showing it.
- Make the affected value obvious.
- Pair with text field when large changes likely (e.g. number of copies when printing); stepper alone for small changes.
- iOS/iPadOS: no additional considerations. API: `UIStepper`.
- macOS: for large ranges support Shift-click for bigger change (e.g. 10x default increment). API: `NSStepper`.

## Text fields ([HIG](https://developer.apple.com/design/human-interface-guidelines/text-fields))
- Small, specific text input (name, email). Larger text: text view.
- Show placeholder hint ("Email", "Password"); it vanishes on typing, so also keep a separate label.
- Secure text field for sensitive data (passwords). API: `SecureField`. Always.
- Size field to anticipated text quantity.
- Multiple fields: stack vertically when possible, consistent widths, enough spacing so labels clearly pair with fields (e.g. first/last name one width, address/city another).
- Tab order logical (system usually handles it).
- Validate when sensible: email on switching fields; username/password before switching fields. Alert on invalid input (e.g. non-digits).
- Use number formatter for numeric data (restricts to numbers; decimals, percent, currency). Don't assume presentation; formats vary by locale.
- Line breaks: default clips overflow; can wrap at character/word, or truncate (ellipsis) at beginning/middle/end.
- Consider expansion tooltip on pointer hover for clipped/truncated text.
- iOS/iPadOS: show the appropriate keyboard type per content (see Virtual keyboards).
- iOS/iPadOS: show Clear button at trailing end to erase input.
- iOS/iPadOS: images/buttons at ends: leading end indicates purpose, trailing end offers extra features (e.g. Bookmarks button).
- macOS: consider combo box to pair text input with list of choices.
- API: `TextField`, `SecureField`, `UITextField`, `NSTextField`.
- Other platforms: out of scope.

## Toggles ([HIG](https://developer.apple.com/design/human-interface-guidelines/toggles))
- Choose between a pair of opposing states (on/off), distinct appearance per state. Styles: switch, checkbox; also buttons that behave like toggles (`ToggleStyle`).
- Use only for two opposing values affecting content/view state. Choosing from a list: pop-up button instead.
- Clearly identify what it affects (context usually enough; macOS often adds a label). Toggle-button: use interface icon, change background by state.
- Make state differences obvious (fill, background shape, checkmark/dot). **Never** rely on color alone.
- iOS/iPadOS: switch style only inside a list row; no label needed (row content gives context).
- iOS/iPadOS: change default green only if necessary (e.g. accent color); ensure enough contrast with the uncolored (off) appearance.
- iOS/iPadOS: outside a list, use a toggle-behaving button, not a switch (Phone filter button gets blue highlight when active). Don't add a label explaining it; icon + background states suffice (`changesSelectionAsPrimaryAction`).
- macOS: switch, checkbox, radio button. Use them in window body, not frame; avoid in toolbar or status bar.
- macOS switch: prefer for settings to emphasize (more visual weight; controls a group of settings). In grouped form, mini switch for single-row setting (consistent row height); regular switch for primary + mini for subordinate settings. Don't replace existing checkboxes with switches. API: `GroupedFormStyle`, `ControlSize`.
- macOS checkbox: small square; empty off, checkmark on, dash mixed; title on trailing side (title can be absent in editable checklist).
- Use checkbox, not switch, for hierarchy of settings (align on leading edge, indent for dependency).
- Consider intro label for checkbox group when relationship unclear; align label baseline with first checkbox.
- Reflect checkbox state accurately; mixed state when parent controls subordinates with differing states (`allowsMixedState`).
- macOS radio buttons: small circle + label, groups of two to five, mutually exclusive. Selected = filled; deselected = empty. Mixed state rarely useful; use checkbox if mixed needed.
- Prefer radio set for mutually exclusive options; multiple selections: checkboxes. More than about five options: pop-up button.
- Single on/off setting: prefer checkbox (state clearer). Rare unclear case: pair of radio buttons each labeled with the state.
- Horizontal radio buttons: consistent spacing sized to longest label.
- API: `Toggle`, `UISwitch`, `NSSwitch`, `NSButton.ButtonType.toggle`.
- Other platforms: out of scope.

## Virtual keyboards ([HIG](https://developer.apple.com/design/human-interface-guidelines/virtual-keyboards))
- Not supported in macOS. Virtual keyboard has no keyboard shortcut support.
- Choose keyboard matching content type (semantic meaning also refines corrections). API: `keyboardType(_:)`, `textContentType(_:)`, `UIKeyboardType`, `UITextContentType`.
- Types: ASCII capable; ASCII capable number pad; decimal pad; default; email address (adds @, period); name phone pad; number pad; numbers and punctuation; phone pad (adds plus/star/hash); Twitter (@, #); URL (period, slash, .com); web search (period, Go).
- Customize Return key type when it clarifies entry (e.g. search return key for search). API: `submitLabel(_:)`, `UIReturnKeyType`.
- Custom input view: replaces system keyboard in your app for app-specific entry (Numbers). Must make sense in context; users must see benefit (else wonder why system keyboard is gone). API: `ToolbarItemPlacement`, `inputViewController`.
- Custom input view: play standard keyboard sound (`playInputClick()`); users can disable in Settings > Sounds.
- Custom keyboard (app extension, iOS/iPadOS): usable in any app except secure text fields and phone number fields; multiple allowed. Use for systemwide unique input or unsupported languages; app-only need: custom input view instead.
- Custom keyboard: provide obvious easy way to switch keyboards (Globe key convention).
- Custom keyboard: don't duplicate system Emoji/Globe and Dictation keys (shown beneath keyboard; app can't affect them).
- Custom keyboard: consider tutorial in app (choose, activate, use, switch back); **never** show help inside the keyboard.
- iOS/iPadOS: use keyboard layout guide so keyboard integrates with layout and keeps key UI visible (don't let keyboard cover fields/buttons). API: `UIKeyboardLayoutGuide`.
- iOS/iPadOS: custom controls above keyboard (input accessory view): keep relevant to current task. Liquid Glass: if other views use it or view looks out of place, apply Liquid Glass to the container; a standard toolbar adopts it automatically. Use keyboard layout guide and standard padding. API: `inputAccessoryView`.
- Other platforms: out of scope.
