# Components: status

last-checked: 2026-10-25
scope: gauges, progress indicators, rating indicators, activity rings for iOS, iPadOS, macOS

## Gauges ([HIG](https://developer.apple.com/design/human-interface-guidelines/gauges))
- Shows a numeric value within a range; may add range context (e.g. temperature gauge with low/high labels and color spectrum).
- Circular or linear path; standard style = indicator at value; capacity style = fill up to value.
- Accessory variant (circular/linear, standard/capacity): echoes complications look; good for iOS Lock Screen widgets.
- Write succinct labels for current value and both range endpoints. Not every style shows all labels; VoiceOver reads visible ones.
- Consider gradient fill to convey purpose (e.g. red-to-blue temperature).
- iOS/iPadOS: no additional considerations. API: `Gauge`.
- macOS: also level indicator (`NSLevelIndicator`) for capacity, rating (see Rating indicators), rarely relevance.
- macOS capacity style: continuous (translucent track filled by solid bar) or discrete (separate equal segments, segment count = total capacity, each fills fully, never partially).
- macOS: prefer continuous for large ranges (discrete segments get too small).
- macOS: default fill green; consider changing color at significant levels (very low, very high, past middle); tiered state shows several colors in one indicator.
- macOS relevance style (rare): shaded horizontal bar, e.g. relevance in search results.
- Other platforms: out of scope.

## Progress indicators ([HIG](https://developer.apple.com/design/human-interface-guidelines/progress-indicators))
- Show app isn't stalled during loading/lengthy operations; transient (visible only while operation runs).
- Determinate: well-defined duration (file conversion); linear bar fills leading-to-trailing, circular fills clockwise. Indeterminate (activity indicator/spinner): unquantifiable tasks; all platforms have spinning circle; macOS also indeterminate bar. API: `ProgressView`.
- Prefer determinate when possible (helps decide wait, retry, or abandon).
- Report advancement accurately and evenly paced (90 percent in 5 seconds then last 10 percent in 5 minutes feels deceptive).
- Keep indicator moving (stationary = stalled/frozen). On stall, explain problem and what people can do.
- Switch indeterminate bar to determinate once duration becomes known.
- Avoid switching circular style to bar style (different shapes/sizes disrupt layout).
- Optional description: accurate, succinct; avoid vague "loading"/"authenticating".
- Display in a consistent location.
- Allow halting when feasible: Cancel button. If interruption has side effects (lost partial download), also offer Pause.
- If cancel loses progress, show alert to confirm cancel or resume.
- iOS/iPadOS refresh control: specialized activity indicator, hidden until pull-down on view to reload (Mail Inbox). API: `UIRefreshControl`.
- Refresh control: still update content automatically and regularly; don't make people initiate every update.
- Refresh control title only if it adds value; never explain how to refresh; give info (e.g. Podcasts last-update time).
- macOS: indeterminate indicator can be bar or circular (animated).
- macOS: prefer spinner for background operations or tight space (in a text field, next to a button).
- macOS: don't label a spinner (usually appears on user action).
- API: `UIProgressView`, `UIActivityIndicatorView`, `NSProgressIndicator`.
- Other platforms: out of scope.

## Rating indicators ([HIG](https://developer.apple.com/design/human-interface-guidelines/rating-indicators))
- macOS only (not iOS/iPadOS). Row of symbols (default stars) showing rank; whole symbols only (value rounded), constant spacing, symbols don't scale to width. API: `NSLevelIndicator.Style.rating`.
- Make ranking changes easy: adjust inline in ranked lists, no separate editing screen.
- Custom symbol replacing star: ensure purpose clear (star is the recognized rating symbol).

## Activity rings ([HIG](https://developer.apple.com/design/human-interface-guidelines/activity-rings))
- Move, Exercise, Stand daily goal progress. iOS only (iPadOS no additional considerations; not in macOS). API: `HKActivityRingView`.
- iOS: shows all three rings with Apple Watch paired; Move ring only (approximate activity from steps and other apps' workouts) without one. Activity history can mix both styles.
- Show when relevant to health/fitness apps, especially HealthKit contributors (workout metrics screen, post-workout summary).
- Use only for Move, Exercise, Stand. **Never** use for other data or replicate Move/Exercise/Stand in another ring-like element.
- Single person's progress only; label, photo, or avatar makes owner obvious.
- Keep appearance identical everywhere: never alter ring colors (no filters, opacity changes); always on black background; prefer enclosing circle via corner radius (not circular mask); black background visible around outermost ring (thin black stroke if needed, no gradient/shadow/effects); scale appropriately; adapt surrounding UI to rings, never rings to UI.
- Ring-associated labels/values use matching colors:

| Ring | RGB |
|---|---|
| Move | R 250, G 17, B 79 |
| Exercise | R 166, G 255, B 0 |
| Stand | R 0, G 255, B 246 |

- Minimum outer margin no less than distance between rings; nothing crops, obstructs, or encroaches.
- Separate other ring-like elements with padding, lines, labels, color, scale.
- Don't send notifications duplicating system Activity app info; don't show ring element in notifications. Referencing Activity progress uniquely is fine.
- **Never** use for decoration (labels, background graphics) or branding (app icon, marketing).
- Other platforms: out of scope.
