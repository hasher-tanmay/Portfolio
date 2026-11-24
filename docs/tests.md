# Portfolio responsiveness and notebook QA

## Scope and deliverable

OpenCode should run this pass after implementing `new_changes.md`. Use `C:\Users\LENOVO\portfolio\frontend` and test the production preview. Record the current branch or revision, dirty working-tree state if applicable, commands, browser and OS versions, and the viewport and input type for every run. Inspect and exercise the current build. Keep application fixes for a later pass.

Return **`docs/test_results.md`** to Tanmay so it can be used to write `fixes.md`. Save screenshots, videos or traces from failing checks under the existing frontend test-artifact directory and link them from the report. Temporary test scripts are fine. Keep them outside the app source.

## Intended behavior

- **Desktop and wide tablet** use the two-page notebook where the current layout has room for it. The open book and each physical leaf keep the same width and height as the reader moves between spreads at a fixed viewport. Compare open spreads with one another.
- **Phone** behaves like a single-page diary. The closed cover and each content leaf use the same outer width and height at a fixed viewport and orientation. A desktop spread with two leaves becomes two successive mobile pages in reading order. Show one leaf at a time. A swipe should advance exactly one leaf, including across a spread boundary.
- The viewport or orientation may change the book dimensions. Content length, fonts, images, videos and page turns should preserve the frame size within the same viewport. Measure frame dimensions in CSS pixels using the same visible outer boundary each time, with animations settled. Allow up to 2 CSS px per dimension for rounding and log the actual measurements.
- Readable text, reachable controls, intact media and accessible links are required alongside stable dimensions. Normal vertical scrolling should remain available, especially on short screens. Flag clipped or unreachable content, page growth, horizontal overflow or a trapped scroll area. Report the exact content causing the issue for the fixes pass.

## Run setup and viewport coverage

1. In `frontend/`, run `npm.cmd run build` and `npm.cmd test` on Windows. The build includes TypeScript checking, and the existing Playwright config starts a production preview at `http://127.0.0.1:4173`. For manual inspection, run `npm.cmd run preview -- --host 127.0.0.1 --port 4173 --strictPort` when the test server is stopped.
2. Reuse the existing Playwright suite and add temporary probes or do manual checks for coverage gaps. Capture uncaught page errors and failed asset requests. Use touch-enabled emulation for gesture tests and note which runs use browser emulation.
3. Run the full page and asset sweep at 1440 × 900 and 390 × 844. At every other size, check the cover, densest Skills leaf, a video spread, the diagram, and the final Résumé spread. Check both sides of the actual layout breakpoint as well. Resize an already open spread across it and verify the current content remains visible.

| Viewport in CSS px | Check |
| --- | --- |
| 1920 × 1080 and 1440 × 900 | Desktop book, page sizing and mouse/keyboard controls |
| 1280 × 720 | Short desktop window and access to bottom controls |
| 1024 × 768 and 768 × 1024 | Tablet, including the transition to single-page layout |
| 430 × 932 and 390 × 844 | Phone portrait, one-leaf diary and touch navigation |
| 360 × 800 and 320 × 568 | Narrow and short phone screens, densest content and media |
| 844 × 390 | Phone landscape, access to content and controls after rotation |

Use touch on a real phone if available. Prefer one Android Chrome and one iOS Safari run when available. Record the exact device and browser and mark unavailable physical-device checks **Not run**. Emulated swipes count as emulated coverage. On desktop, also spot-check browser zoom at 125% and 200% for loss of content or controls.

## Test cases

| ID | Steps | Expected result |
| --- | --- | --- |
| SIZE-01 | At each viewport, capture the closed cover dimensions. Open the diary and log each relevant settled leaf width and height. On desktop log the open spread dimensions too. Compare a short page, the densest Skills page, media-heavy pages, and Résumé. Run the full comparison on the two baseline viewports. | Mobile leaves match the mobile cover frame. Desktop spread and leaf dimensions stay consistent across open spreads. Record min/max dimensions and the pages responsible for any differences. |
| SIZE-02 | At both baseline viewports, compare the page before and after fonts and media finish loading, after video starts, and before and after forward and reverse turns. Include one cold-cache load. | The book frame and navigation stay in place. The media slot reserves space. Pages remain readable and controls remain reachable. |
| SIZE-03 | Check the narrowest and shortest viewports, rotate a phone view, and resize across the layout breakpoint with an open spread. Scroll down on the densest page and return to the top. | No horizontal overflow or clipped text. Bottom content and navigation remain reachable. The book adapts to the new viewport and retains the active content. |
| NAV-01 | Start from the cover. Step through the complete book in both directions using visible controls. On desktop repeat key boundaries using keyboard arrows. Use bookmarks, open a deep URL directly, refresh, and use browser Back and Forward. | Cover opens correctly. Order and active bookmark match the displayed content. The first Next works, endpoints behave predictably, and deep links restore the expected spread. The Skills spread belongs to About, Certificates precede Résumé, and the old Experiments URL follows the intended redirect. |
| NAV-02 | On a touch viewport swipe left and right through consecutive leaves, including both sides of Skills and the two certificates. Try a short swipe, a diagonal swipe, a vertical scroll, and swipes at the start and end. Repeat with tap controls. | A horizontal swipe moves one leaf in the expected direction. Short or primarily vertical gestures leave the current page in place. Vertical scrolling works normally. No unintended browser scroll or page jump. Tap controls provide equivalent navigation. |
| ANIM-01 | Observe or record cover opening, forward and reverse page turns, and rapid repeated or alternating input on desktop and phone. Include a page containing a video. | Turns look continuous, with no flashing, blank frame, duplicate page, wrong-direction fold or sudden jump in frame size. Rapid input settles on a coherent page and leaves navigation usable. |
| ANIM-02 | Enable reduced motion. Repeat cover opening, Next, Previous and one swipe. Then use a focused link and the video controls with the keyboard. | Reduced motion completes navigation immediately or with minimal motion. Focus is visible, and controls respond without triggering a page turn. |
| IMG-01 | Inventory all displayed images from the current book. For each, check the request, decoded image dimensions, visibility and appearance at both baseline viewports. Check cover artwork if present, Vendor AI screenshots, the Meta-Contrast architecture, video posters, certificate previews if used, and the Résumé QR. | Intended images render clearly without broken placeholders, distortion, or clipped labels or QR edges. Lazy media loads on arrival. The architecture is readable when opened at full size. |
| MEDIA-01 | Play the Transcript App and OAK-D-Lite clips on desktop and phone. Start, pause, seek, and try fullscreen where supported. Try interacting with the timeline on touch. Return to the book afterward. | Both clips load, play, and belong to the correct project. Inline playback works on phone. Media interaction leaves the current page in place, and exiting playback restores usable navigation. |
| LINKS-01 | On desktop and phone, open the conference paper, dissertation, both certificates, and Résumé from their actual links. Follow the Résumé QR destination if practical. | Links resolve in the production build and open the intended files. The conference paper is 10 pages and the public dissertation is the approved 59-page version. The QR points to the public résumé destination. |

For image checks, a successful request alone does not establish visible rendering. Verify the loaded element has decoded content, such as a nonzero `naturalWidth`, and check the visual in context. For frame checks, measure the outer book and leaf after settling. During an animation, check the stationary frame for layout shifts instead of treating the moving sheet’s projected width as a resize.

## Format for `docs/test_results.md`

1. **Summary** — Can a phone reader use it as a one-page diary with cover-matched dimensions? Can a desktop reader turn pages without layout shifts? List the top failures first, followed by counts of passed, failed, blocked and not-run checks.
2. **Environment and coverage** — Record revision, commands and results, tested browser/device combinations, viewports, and any checks that could not be run.
3. **Measurements** — Give viewport, route or leaf, cover dimensions, settled page or spread dimensions, delta from the reference, and any visible clipping or overflow. Include representative passing measurements and every outlier.
4. **Failing checks** — Give one row per reproducible issue with test ID, severity, route or leaf, browser/device and viewport, steps, expected behavior, actual behavior, and evidence link. Where relevant, include the failing asset URL, HTTP status or console error. Group repeated failures with the same symptoms and list affected sizes.
5. **Pass and skip matrix** — Mark each case and relevant viewport as **Pass**, **Fail**, **Blocked**, or **Not run**. Explain blocked and skipped checks. A green existing suite does not replace the viewport, touch and visual checks above.

Use **High** for failures that block reading or navigation, **Medium** for repeatable layout, motion or media defects that materially affect use, and **Low** for cosmetic defects. Record observed behavior and measurements. Leave implementation decisions for `fixes.md`.
