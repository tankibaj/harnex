# Components: Content

last-checked: 2026-10-25
scope: Apple HIG content components (charts, image views, text views, web views) for iOS, iPadOS, macOS.

## Charts ([HIG](https://developer.apple.com/design/human-interface-guidelines/charts))
- Chart highlights few key points of dataset; supports insight and decisions.
- Anatomy: marks (value representation), scales (map values to position/color/height), plot area, axes, ticks, grid lines, labels, accessibility labels, titles/subtitles/annotations, legend (for non-position properties like color/shape).
- Choose mark type by message. Bar: compare categories or parts of whole; good for time data when each value is a sum (daily steps). Line: change over time, slope shows trend. Point: relation of two properties, outliers, clusters.
- Combine mark types when it adds clarity (points over line: trend plus individual values).
- Axis range: fixed when min/max are meaningful (battery 0-100%); dynamic when values vary widely and marks should fill plot area.
- Lower bound by mark type and use: bars often start at zero for height comparison; zero can hide meaningful differences (heart rate), so skip it then.
- Prefer familiar tick/grid label sequences (0, 5, 10), not odd ones (1, 6, 11).
- Tune grid line and label density/weight to context. Too many overwhelm; too few hamper estimating. If data points are inspectable by interaction, use fewer grid lines and lighter labels.
- Descriptive content: write titles/labels that explain purpose and function before viewing; critical for VoiceOver and cognitive-disability users.
- Summarize main message (title/subtitle in plain language, e.g. next-hour precipitation).
- Visual hierarchy: data most prominent; descriptions and axes support without competing.
- Compact environment: maximize plot width; keep vertical-axis labels short; put units in title; place long category labels inside plot area if nothing important is obscured.
- **Must** make every chart accessible (VoiceOver). Add Audio Graphs for tones plus text summary.
- Interaction allowed when useful; **never** require interaction to reveal critical info (Stocks: line graph visible, drag indicator for detail).
- Small marks hard to hit (finger/pointer): expand hit target to whole plot area, allow scrubbing.
- Keyboard/full keyboard access/Switch Control: default is linear sequence. Customize via accessibility APIs (`accessibilityRespondsToUserInteraction(_:)`) for logical path (e.g. along X axis), or let focus move among subsets of values for large datasets. Helps VoiceOver too.
- Make mark/axis changes noticeable: animate, plus non-animation cues (accessibility notifications: `UIAccessibility.Notification` / `NSAccessibility.Notification`) for VoiceOver and reduce-motion users.
- Align chart with surrounding interface: leading edge flush with other views; put vertical grid line labels on trailing side; consider Y axis on trailing side so tick labels don't protrude past leading edge; anchor orphan label with a tick.
- Color: avoid relying solely on color to separate data or convey essentials; add shapes/patterns (Health blood pressure: circle vs diamond).
- Add visual separation between adjacent color areas (narrow gaps between stacked bar segments, as iPhone Storage).
- Accessibility with Swift Charts: default Audio Graphs plus per-mark accessibility element. Customize chart title and summary. Without Audio Graphs, supply overview: chart type, what each axis represents, axis bounds.
- Unlike image (one label), chart often needs a label per important/interactive element. Decide per-mark vs grouped labels by chart purpose and density (Maps elevation: summarize portions; Health steps: label each bar). Single succinct label OK for small chart used as button opening detail.
- Accessibility label rules: give context (date/location) with value, no repeating what axis name/overview already gives; context first, then details. No subjective words (rapidly, gradually, almost); use actual values. Avoid ambiguous formats/abbreviations ("June 6" not "6/6"; "60 minutes" not "60m"). Describe what data represents, not how it looks (no color names). Refer to axes consistently (e.g. X first).
- Hide visible axis/tick text labels from assistive tech (values come via labels and Audio Graphs).
- iOS, iPadOS, macOS: no additional considerations.
- Other platforms: out of scope.

## Image views ([HIG](https://developer.apple.com/design/human-interface-guidelines/image-views))
- Image view displays one image (or animated sequence) on transparent/opaque background; can stretch, scale, size-to-fit, pin. Usually non-interactive.
- Use image view when purpose is just displaying an image. For interactive image, configure a system button to show the image; do not add button behavior to image view.
- For icons, prefer SF Symbols or interface icons over image views (template images take accent colors).
- Formats: PNG, JPEG, PDF, etc.
- Text over images: ensure strong contrast; add text shadow or background layer to lift legibility.
- Animated sequences: use same size for all frames; prescale to view size to avoid system scaling (better performance).
- iOS, iPadOS: no additional considerations.
- macOS: for editable image, use image well (supports copy, paste, drag, Delete key to clear). For clickable image, use image button (triggers instant app action), not image view.
- Other platforms: out of scope.

## Text views ([HIG](https://developer.apple.com/design/human-interface-guidelines/text-views))
- Text view: multiline styled text, optionally editable; any height, scrolls on overflow. Defaults: leading alignment, system label color.
- Use for long, editable, or specially formatted text. Small text: label, or text field if editable.
- Keep text legible. Adopt Dynamic Type; test with accessibility options (e.g. Bold Text).
- Make useful text selectable/copyable (error message, serial number, IP address).
- iOS, iPadOS: editable text view shows keyboard on select; show keyboard type matching content (see virtual keyboards).
- macOS: no additional considerations.
- Other platforms: out of scope.

## Web views ([HIG](https://developer.apple.com/design/human-interface-guidelines/web-views))
- Web view embeds HTML/web content in app (Mail message HTML).
- Support forward/back navigation when people may visit multiple pages; not default, so provide controls.
- Avoid building a web browser with a web view; brief in-context access is fine, Safari is the browser.
- iOS, iPadOS, macOS: no additional considerations.
- Other platforms: out of scope.
