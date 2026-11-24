# Portfolio responsive fixes

Implementation brief for OpenCode. Work in `C:\Users\LENOVO\portfolio\frontend`. Use `test_results.md` as the baseline and `tests.md` for coverage. This pass covers phone geometry, phone landscape, and one narrow two-page Skills overflow. The existing desktop design is the reference.

## What the tests found

| Priority | Finding | Measured result |
| --- | --- | --- |
| 1 | Phone leaves change size with their content | At 390 × 844 the cover is 353.2 × 608 px and the open book is 359.6 px wide and 289.6–793.9 px tall. At 320 × 568 the longest leaf reaches 963.2 px against a 482.8 px cover. |
| 1 | Phone rotation switches to a two-page spread and disables horizontal swipes | Rotating the touch-emulated phone from 390 × 844 to 844 × 390 crosses the current 760/761 px breakpoint. The route survives, but the view shows two leaves and the swipe does not advance. |
| 2 | Mobile turns move the frame and controls | At 390 × 844, Transcript App’s facing leaf to Meta-Contrast’s opening leaf and back changes the book height 388.5 → 580.0 → 388.5 px and the controls’ top position 519.2 → 710.7 → 519.2 px. Font and media load did not cause the jump. |
| 2 | Skills expands the narrow two-page book | Compared with other spreads, Skills adds 189.6 px at 768 × 1024 and 204.9 px at 761 × 900. The AI FDE bullets wrap in narrow columns. |

All 11 existing Playwright tests passed in the report. The wider desktop runs, portrait swipe behavior, reduced motion, images, both videos, PDF links, and QR already passed their reported checks. The Transcript App demo is already 280.874 seconds with audio. Physical Android and iOS were not run.

## 1. Give the phone cover and every leaf the same frame

In `src/styles.css`, use a single set of compact-layout dimensions for the visible cover border and the visible open-book border. Base the border-box width and height on available viewport space with cover-appropriate limits. Account for the book’s own border and edge padding inside that size. Short content can leave blank space. A long Skills, Research, or project leaf should have one native vertical scroll region inside the frame when it needs it. Keep Previous and Next outside that region so they stay in the same position while the reader scrolls. The document may still scroll to bring the book and controls into view on short screens.

Make the scroll region keyboard usable and preserve visible focus. Verify the first and last lines, links, and media controls are reachable at 320 × 568 and under zoom. Preserve pinch zoom, ordinary vertical touch scrolling, and natural scroll chaining. Start a new leaf at the top. Keep the existing desktop document scroll behavior. Use the actual closed-cover border as the acceptance reference at each compact viewport, within 2 CSS px per dimension.

## 2. Keep one leaf in phone landscape

The current `mobileQuery` in `src/App.tsx` and the mobile CSS depend on width alone. Keep the existing compact-width path, including narrow desktop windows and browser zoom. Add a compact-landscape branch for short, touch-first viewports above 760 px, covering 844 × 390 and excluding ordinary mouse/keyboard desktop windows. A landscape orientation plus a phone-like viewport height and coarse primary pointer is a suitable starting point. Verify the chosen condition on both inputs at the same viewport.

Use the same layout decision for React rendering, route step size, swipe handling, and CSS styling. Scope desktop-only CSS so it cannot also apply to the compact-landscape book. Keep the normal two-page mode around 761 × 900 and 768 × 1024. Preserve the active route and leaf during rotation and when resizing back and forth. A horizontal swipe on a non-interactive part of the page should move exactly one leaf. Keep taps, short and diagonal gestures, scrolling, and native media controls behaving as they did in the passing portrait checks.

## 3. Keep the mobile frame stationary during a turn

`Book` in `src/App.tsx` currently applies a transition-time `minHeight` from the outgoing leaf. Use the compact layout’s shared frame for both settled pages and animation layers so the compact book and controls stay at the same position before, during, and after a turn. Any size measurement needed by the existing two-page animation can stay in that path. Preserve the turning-sheet interaction, destination URL, focus handoff, and reduced-motion behavior.

Repeat the Transcript App facing leaf ↔ Meta-Contrast opening leaf scenario at 390 × 844. Measure the stationary border and controls in both directions before, during, and after the turn. Compare control positions relative to the book or at a common document scroll offset. Keep size and position within 2 CSS px and confirm rapid alternating input still settles correctly. Smoke-test the same transition with video playback, media focus, and reduced motion.

## 4. Contain Skills in the narrow two-page layout

Limit this change to the Skills spread in the narrow two-page width range where the report reproduced it. Use the surrounding spreads’ normal leaf height. First adjust local row gaps and wrap long bullets at natural boundaries to fit more cleanly with readable type. If content still exceeds the frame, provide native vertical scrolling within the overflowing Skills leaf. Keep all skills, links, and focus states accessible. Avoid a global fixed-height override for desktop spreads.

At 761 × 900 and 768 × 1024, compare Skills against About and another open spread. Both leaves and the outer frame should match their local two-page reference within 2 CSS px, with the final AI FDE bullet reachable. Retest the desktop Skills layout at 1024 and 1440 widths.

## Desktop regression gate

Take a baseline on the current checkout before editing. Use the current report’s measurements as a cross-check. The narrowly scoped Skills fix above covers the only two-page geometry change requested.

| Verify | Required outcome |
| --- | --- |
| 1920 × 1080, 1440 × 900, 1280 × 720, 1024 × 768 with mouse and keyboard | Preserve the two-page book, cover, lead and facing leaf dimensions, typography, bookmarks, and controls. At 1440 × 900 sweep all spreads. At the other desktop sizes compare representative short, Skills, and media spreads. Compare before/after screenshots and settled dimensions. |
| Desktop navigation and motion | Previous/Next, keyboard arrows, bookmarks, refresh, history, and forward/reverse animation behave as in the baseline. The desktop frame and controls stay steady. Reduced-motion checks pass. |
| Desktop zoom and short windows | At 125% and 200%, keep the existing responsive reflow, direct-leaf routes, and reachable controls. Verify the short desktop viewport can still scroll the document. |
| Shared evidence | Smoke-test video playback and native seeking, certificate images, research PDFs and résumé QR. Keep approved content, URLs and media intact. |
| Short mouse viewport | Check 844 × 390 with a fine pointer as well as touch emulation. The compact-landscape exception applies to the phone case. |

## Run and report

- Run `npm.cmd run build` and `npm.cmd test` from `frontend/`. Use the production preview for the supplemental cases.
- Rerun SIZE-01, SIZE-02, SIZE-03, NAV-02 and ANIM-01 from `tests.md`, then smoke-test the passing interactions. Sweep all 20 leaves at 390 × 844. Sample the remaining compact sizes from the report and verify phone landscape, breakpoint behavior and both narrow two-page widths.
- Check real Android Chrome and iOS Safari if available. Record physical devices and emulation separately. Mark unavailable runs as **Not run**.
- Update `docs/test_results.md` with the before/after measurements, viewport and input type, remaining failures, desktop screenshot comparisons, and automated results. Preserve the original baseline evidence. Treat any new desktop regression as a failure of this pass.
