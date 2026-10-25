# iPadOS

last-checked: 2026-10-25
scope: iPadOS rules and hard numbers; source tables are shared "iOS, iPadOS" and live in platforms/ios.md (linked, not duplicated).

## Designing for iPadOS ([HIG](https://developer.apple.com/design/human-interface-guidelines/designing-for-ipados))
- Device traits: large high-res display; held, on a surface, or on a stand; viewing distance typically within about 3 feet; input by Multi-Touch, virtual or attached keyboard, pointing device, Apple Pencil, voice, often combined; sessions from quick actions to hours (games, media, creation, productivity); multiple apps open, side-by-side viewing, inter-app drag and drop.
- System features to integrate: multitasking, widgets, drag and drop.
- Use the large display to elevate content: minimize modal interfaces and full-screen transitions; place controls where easy to reach but not in the way.
- Use viewing distance and input mode to decide size and density of onscreen content.
- Support Multi-Touch, physical keyboard or trackpad, Apple Pencil; consider unique interactions combining input modes.
- Adapt seamlessly to orientation, multitasking modes, Dark Mode, Dynamic Type; transition effortlessly to running in macOS; let people choose configuration.

## Hard numbers
| Item | Value |
|---|---|
| Default text size | 17 pt (minimum 11 pt) |
| Default control size | 44x44 pt (minimum 28x28 pt) |
| Control padding | about 12 pt (bezeled), about 24 pt (no bezel) |
| Image scale factor | @2x |
| App icon layout | 1024x1024 px square, layered; appearances default, dark, clear light, clear dark, tinted light, tinted dark |
| App icon color spaces | sRGB, Gray Gamma 2.2, Display P3 |
- Contrast: up to 17 pt 4.5:1; 18 pt 3:1; bold any size 3:1; Dark Mode custom colors never below 4.5:1, aim 7:1.
- Dynamic Type sizes, AX sizes, emphasized weights, tracking tables (SF Pro, SF Pro Rounded, New York), system colors, system grays (light, dark, increased contrast), dynamic label/separator/link colors, background color sets, materials and vibrancy levels: identical to iOS; see platforms/ios.md.
- Dark Mode base vs elevated backgrounds also separate apps in multitasking and windows in multiple-window contexts; prefer system backgrounds.

## Platform considerations folded in from foundations
- Typography: SF Pro system font, New York allowed; Dynamic Type supported.
- Layout: determine layout by size classes (never idiom or orientation); iPad windows resize (multitasking, Mac) so consider all compact/regular combinations; use larger space to switch tab bar to sidebar or expose overflow items; keep functionality same.
- Materials: four standard materials (ultra-thin, thin, regular default, thick) and vibrancy values: platforms/ios.md.
- Alternate app icons need dark, clear, tinted variants.
- Test with Device Hub for iPad resize; apps may run on Mac via iPhone Mirroring or iPad apps on Mac.
