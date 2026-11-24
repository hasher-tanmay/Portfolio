# Portfolio responsiveness and notebook QA

## Summary

**The phone can be read one leaf at a time in portrait, but it does not behave like a fixed-size diary.** At 390 × 844, the cover is 353.2 × 608.0 CSS px while the open frame is 359.6 px wide and ranges from 289.6 to 793.9 px tall. Turning between a short and a long leaf moves the controls. At 844 × 390, the same touch-emulated phone switches to two pages and horizontal swipes no longer turn the book.

**Desktop turns were stable at 1440 × 900.** Open frames and both leaves also matched in the sampled 1920 × 1080, 1280 × 720, and 1024 × 768 runs. The Skills spread grows **189.6 px** at 768 × 1024 and **204.9 px** at 761 × 900 compared with the other sampled spreads at those sizes.

**Acceptance totals:** 6 Pass, 5 Fail, 0 Blocked, 2 Not run. This counts the 10 named cases, one desktop zoom check, and two physical-device checks once each. A named case is Fail when any relevant run fails. Separately, the production build and all **11 existing Playwright tests passed**. No app source or configuration was changed.

## Environment and coverage

- **Checkout:** `C:\Users\LENOVO\portfolio\frontend`. No `.git` was found in this checkout or its parents; branch, commit, and dirty state are unavailable. Build fingerprint: `index-DckJW4Wg.js` (SHA-256 `15e72d12e791da91659bc1beb8bd8ebf2122d86dcb72434384bb52ddfbff8702`) and `index-BH3WgtNt.css`.
- **Host:** Windows 10 Home Single Language, 10.0.19045 (build 19045); Node 24.19.0; npm 11.0.0; Playwright Chromium **159.0.8154.6**, headless. Desktop input used mouse/keyboard. Tablet-width and phone runs through 844 px used Chromium mobile/touch emulation at device scale 1; these were not physical devices. No Android or iPhone was available.
- **Commands:** `npm.cmd run build` (includes TypeScript; passed), then `npm.cmd test` (production preview on `127.0.0.1:4173`; 11 passed). Temporary Playwright probes ran outside app source against the same `dist/` via Vite preview on ports 4174–4178; they covered bounds, cold load, full reading order, gestures, resize, sampled animation frames, native media controls, actual Chromium tab zoom, images, and PDF links. `uv run --no-project --with pypdf python …` checked built PDF page counts and compared the dissertation export with the source.
- **Full sweeps:** 1440 × 900, all 10 spreads; 390 × 844, all 20 leaves. Each other viewport checked the cover, Skills, Transcript App, Meta-Contrast diagram, Résumé and About. The live breakpoint is **760 px single leaf / 761 px two leaves**. Resizing the Skills second-leaf URL across that boundary and back preserved the route and restored the second leaf.
- **Error capture:** The supplemental viewport sweep recorded no uncaught page errors or failed asset requests. Intentional navigation cancellations were excluded. The built cover has no separate image asset.
- **Evidence:** [Raw per-route measurements and interaction logs](../frontend/test-results/qa-responsive/measurements.json) · [Gesture/rotation retest](../frontend/test-results/qa-responsive/retest.json) · [Zoom results](../frontend/test-results/qa-responsive/zoom.json) · [Native timeline results](../frontend/test-results/qa-responsive/interactions.json).

## Measurements

Dimensions are settled CSS px, shown as width × height. The mobile reference compares the visible closed-cover border with the visible open-book border around the single leaf; the inner leaf is also logged separately to distinguish it from the frame. For two-page views, the reference is the common size among the non-Skills spreads, not the separately sized cover. Tolerance: ±2 px per dimension.

| Viewport | Input / layout | Cover | Settled outer book and inner leaf | Delta / result |
| --- | --- | --- | --- | --- |
| 1920 × 1080 | Mouse/keyboard, 2 leaves | 496 × 704 | 1088 × 675.6; each 529.4 × 656 | 0 across sampled open spreads |
| 1440 × 900 | Mouse/keyboard, 2 leaves | 496 × 704 | 1088 × 675.6; each 529.4 × 656 | 0 across all 10 spreads |
| 1280 × 720 | Mouse/keyboard, 2 leaves | 496 × 619.2 | 1088 × 627.6; each 529.4 × 608 | 0; document scroll available |
| 1024 × 768 | Mouse/keyboard, 2 leaves | 496 × 660.5 | 848 × 627.6; each 409.4 × 608 | 0 across sampled open spreads |
| 768 × 1024 | Touch emulation, 2 leaves | 496 × 704 | 644 × 675.6–865.2; each 307.4 × 656–845.6 | Skills +189.6 height; [screenshot](../frontend/test-results/qa-responsive/size-768x1024.png) |
| 761 × 900 | Touch emulation, 2 leaves | 496 × 704 | 637 × 675.6–880.5; each 303.9 × 656–860.9 | Skills +204.9 height; [screenshot](../frontend/test-results/qa-responsive/size-761x900.png) |
| 760 × 900 | Touch emulation, 1 leaf | 496 × 608 | 529.6 × 373.9–644.3; leaf 514.2 × 360.1–630.5 | +33.6 width; −234.1 to +36.3 height; [screenshot](../frontend/test-results/qa-responsive/size-760x900.png) |
| 430 × 932 | Touch emulation, 1 leaf | 393.2 × 608 | 399.6 × 373.9–706.5; leaf 384.2 × 360.1–692.7 | +6.4 width; −234.1 to +98.5 height; [screenshot](../frontend/test-results/qa-responsive/size-430x932.png) |
| 390 × 844 | Touch emulation, 1 leaf | 353.2 × 608 | 359.6 × 289.6–793.9; leaf 344.2 × 275.8–780.1 | +6.4 width; −318.4 to +185.9 height; [screenshot](../frontend/test-results/qa-responsive/size-390x844.png) |
| 360 × 800 | Touch emulation, 1 leaf | 323.2 × 608 | 329.6 × 373.7–856.0; leaf 314.2 × 359.9–842.2 | +6.4 width; −234.3 to +248.0 height; [screenshot](../frontend/test-results/qa-responsive/size-360x800.png) |
| 320 × 568 | Touch emulation, 1 leaf | 283.2 × 482.8 | 289.6 × 354.1–963.2; leaf 274.2 × 340.3–949.3 | +6.4 width; −128.7 to +480.4 height; [screenshot](../frontend/test-results/qa-responsive/size-320x568.png) |
| 844 × 390 | Touch emulation, **2 leaves** | 496 × 455.8 | 720 × 627.6–750.3; each 345.4 × 608–730.7 | Wrong layout for a phone; Skills +122.7 vs. other open spreads; [screenshot](../frontend/test-results/qa-responsive/rotation-landscape.png) |

At 760, 430, 390, 360 and 320 px, **every measured portrait leaf** exceeded the cover-frame tolerance in at least one dimension. At 390 × 844, all 20 have an outer width of 359.6 and an inner width of 344.2; the per-route heights and outer-frame delta from the 608 px cover are:

| Spread | Leaf 1 outer / inner height (delta) | Leaf 2 outer / inner height (delta) |
| --- | ---: | ---: |
| About | 539.5 / 525.6 (−68.5) | 470.0 / 456.2 (−138.0) |
| Skills and Frameworks | 785.6 / 771.8 (+177.6) | 793.9 / 780.1 (+185.9) |
| Selected projects | 289.6 / 275.8 (−318.4) | 641.9 / 628.1 (+33.9) |
| Vendor AI Assistant | 588.8 / 574.9 (−19.2) | 581.5 / 567.7 (−26.5) |
| OAK-D-Lite | 529.6 / 515.8 (−78.4) | 496.3 / 482.5 (−111.7) |
| Transcript App | 511.7 / 497.8 (−96.3) | 388.5 / 374.6 (−219.5) |
| Meta-Contrast | 580.0 / 566.1 (−28.0) | 467.4 / 453.6 (−140.6) |
| Research notes | 620.8 / 607.0 (+12.8) | 555.0 / 541.2 (−53.0) |
| Certificates | 564.3 / 550.5 (−43.7) | 478.4 / 464.6 (−129.6) |
| Résumé | 460.5 / 446.7 (−147.5) | 373.9 / 360.1 (−234.1) |

No horizontal document overflow was measured on any sampled page. At 320 × 568 the dense AI FDE leaf remained readable and Next was reached at `scrollY=648`; ordinary document scrolling returned to `0`. Next worked from Skills at all supplemental widths (mouse on desktop, synthesized click in touch emulation); mouse and ArrowLeft also worked at 1920, 1280, and 1024. [Control checks](../frontend/test-results/qa-responsive/controls.json) · [Narrow Skills screenshot](../frontend/test-results/qa-responsive/narrow-skills.png).

## Failing checks

| Test | Severity | Route / viewport | Steps and expected | Actual and evidence |
| --- | --- | --- | --- | --- |
| SIZE-01 | Medium | All measured single-leaf widths, especially 390 × 844 and 320 × 568 | Compare the settled cover border, then the opening and successive reading frames. Width/height should match within 2 px. | Open frames are wider and change height with content. At 390 the short Projects opener is 289.6 px tall, while the Skills AI FDE leaf is 793.9; at 320 the AI FDE leaf is 963.2 against a 482.8 px cover. [390 evidence](../frontend/test-results/qa-responsive/size-390x844.png) · [320 evidence](../frontend/test-results/qa-responsive/size-320x568.png). |
| SIZE-01 | Medium | Skills versus About, video, diagram and Résumé at 768 × 1024 and 761 × 900; also 844 × 390 in its two-page layout | Compare open spread and leaf bounds at the same viewport. | The AI FDE course bullets wrap into more lines and enlarge both leaves. Outer frame gains 189.6, 204.9, and 122.7 px respectively over the other sampled spreads. Content remains reachable. [768 evidence](../frontend/test-results/qa-responsive/size-768x1024.png) · [761 evidence](../frontend/test-results/qa-responsive/size-761x900.png). |
| SIZE-02, ANIM-01 | Medium | Transcript App facing leaf ↔ Meta-Contrast opening leaf, 390 × 844 | Cold-load the poster/fonts, start playback, turn Next then Previous; also send rapid repeated/alternating inputs. The stationary frame and controls should stay in place. | Loading/fonts/starting video do **not** resize the frame. The turn changes settled height **388.5 → 580.0 → 388.5** and controls top **519.2 → 710.7 → 519.2**. A sampled forward animation also briefly showed a 608 px stationary frame before settling to 580 px. Rapid input settled on the correct page and reverse still worked. [Samples](../frontend/test-results/qa-responsive/measurements.json) · [forward frame](../frontend/test-results/qa-responsive/motion-390-next-100.png) · [reverse frame](../frontend/test-results/qa-responsive/motion-390-reverse-420.png). |
| SIZE-03, NAV-02 | Medium | Skills and About, 390 × 844 rotated to 844 × 390 | Keep the current leaf as a one-page phone diary in landscape; swipe to advance one leaf. | At 844 px the page uses a two-leaf desktop view. A left swipe on About facing content left `/spread/about#page-2` unchanged. Controls remained reachable by vertical scroll; the Skills second leaf restored when rotated back. [Landscape screenshot](../frontend/test-results/qa-responsive/rotation-landscape.png) · [retest](../frontend/test-results/qa-responsive/retest.json). |

## Pass and skip matrix

| Check | Desktop / tablet | Phone or touch emulation | Coverage and notes |
| --- | --- | --- | --- |
| SIZE-01 — settled frame | **Pass:** 1920, 1440, 1280 and 1024 widths. **Fail:** 768 and 761 widths. | **Fail:** 760, 430, 390, 360 and 320 widths; 844 landscape also fails. | All baseline routes and the sampled remainder are in the measurements above. |
| SIZE-02 — load, playback, turns | **Pass:** 1440 × 900. | **Fail:** 390 × 844 on turns; cold load and playback subchecks pass. | Fresh browser contexts with font/image requests delayed, then measured after decoding, video start and both turn directions. |
| SIZE-03 — overflow, scroll, resize | **Pass:** 761 ↔ 760 retains the active URL/content after settling. | **Fail:** landscape changes to two leaves. **Pass:** narrow/short scrolling, no horizontal overflow, portrait restores the original leaf. | Resized the already-open Skills second leaf and checked that bottom navigation and top could be reached. |
| NAV-01 — reading order | **Pass:** complete 10-spread round trip at 1440; desktop ArrowRight/Left and bookmarks, refresh, history and legacy URL worked. | **Pass:** complete 20-leaf round trip at 390; first Next, About state on Skills, Certificates before Résumé, last leaf without Next, deep refresh, history and legacy redirect worked. | `/spread/experiments#page-2` resolves to `/spread/skills-and-frameworks#page-2`. |
| NAV-02 — touch gestures | Not applicable to mouse-only runs. | **Pass:** 390 × 844 on page content. **Fail:** 844 × 390 rotating to two leaves disables swipe. | Portrait checks covered both Skills/Certificates leaves, chapter boundaries, short/diagonal gestures, vertical scrolling, cover/end and taps. Starting a swipe directly on the linked certificate preview does not turn the page; starting on the non-interactive leaf below it moves exactly one leaf in either direction. |
| ANIM-01 — ordinary motion | **Pass:** 1440 × 900; stationary frame 676 px rounded throughout sampled forward/reverse video-spread turns. | **Fail:** 390 × 844 frame jump; alternating input recovered and no blank full-book frame was seen in the sampled snapshots. | Reviewed cover-open and forward/reverse snapshots at 100/240/420 ms, plus per-frame stationary frame measurements. |
| ANIM-02 — reduced motion | **Pass:** cover, Next and Previous introduced zero animation layers; keyboard focus ring visible and focused controls didn’t turn pages. | **Pass:** identical controls plus a swipe ending on About facing leaf with no animation layer. | 1440 × 900 mouse/keyboard and 390 × 844 touch with keyboard for focus checks. |
| IMG-01 — assets | **Pass:** 1440 × 900. | **Pass:** 390 × 844. | Seven unique raster images decoded (two Vendor screenshots, two video posters, architecture and two certificates), no broken image or cropped edges seen. Small document labels can be inspected in the original linked images/PDFs. Diagram opens at 1100 × 510; 192 × 192 vector QR rendered intact and decoded in the existing suite. [Desktop visuals](../frontend/test-results/qa-responsive/asset-contact-sheet-1440.jpg) · [Phone visuals](../frontend/test-results/qa-responsive/asset-contact-sheet-390.jpg). |
| MEDIA-01 — playback | **Pass:** play, pause, seek, fullscreen/exit and subsequent Next for both clips. | **Pass:** inline playback, timeline touch, fullscreen/exit and subsequent Next. | Transcript: 280.874 s, audio decoded and unmuted before interaction, sought to 245 s; OAK-D-Lite: 3.000 s, silent, sought to 2.04 s. Native touch scrubber moved Transcript to ~199.2 s and OAK to ~2.13 s without turning pages. [Transcript touch](../frontend/test-results/qa-responsive/touch-timeline-transcript-app.png) · [OAK touch](../frontend/test-results/qa-responsive/touch-timeline-oak-d-lite-pothole-detection.png). |
| LINKS-01 — PDFs and QR | **Pass:** five actual PDF links opened from the 1440 desktop pages. | **Pass:** same from the corresponding 390 leaves. | All HTTP 200, PDF content. Paper 10 pages; dissertation 59 and matched source pages 1–59 by extracted text; certificates and résumé one page each. Decoded QR matches the Google Drive link, which returned HTTP 200 as `Tanmay_Patel_Resume.pdf` while signed out. No physical scan. |
| Desktop zoom | **Pass:** actual Chromium tab zoom 125% and 200% from 1440 × 900. | Not applicable. | At 125% viewport was 1152 × 720 with two leaves; 200% yielded 720 × 450 with one leaf. Both Skills URLs retained their content and Next was reachable without horizontal overflow. [125%](../frontend/test-results/qa-responsive/zoom-125.png) · [200%](../frontend/test-results/qa-responsive/zoom-200-second.png). |
| Physical Android Chrome | — | **Not run** | No physical Android device available. |
| Physical iOS Safari | — | **Not run** | No physical iPhone/Safari available; Chromium emulation is not Safari coverage. |

## Responsive fixes — verification after implementation

The sections above are the original baseline. This pass implements [`fixes.md`](fixes.md). The production build and TypeScript checks passed; **15/15 Playwright tests passed**. Supplemental checks used the same Windows host and headless Chromium 159.0.8154.6. Artifacts were written to separate directories to preserve the original captures. The production bundle for this run is `index-8UqWH_CM.js` / `index-CVmZrX7b.css`.

| Check | Before → after | Result |
| --- | --- | --- |
| SIZE-01 — single-leaf frame | At 390 × 844, cover **353.2 × 608.0** and book **359.6 × 289.6–793.9** → cover and every book **353.2 × 608.0**. At 320 × 568 the longest sample was **289.6 × 963.2** → **283.2 × 482.8**, matching the cover. | **Pass** across all 20 leaves at 390 × 844. The other compact sweeps matched their covers: **496 × 608** at 760 × 900; **393.2 × 608** at 430 × 932; **323.2 × 608** at 360 × 800; **283.2 × 482.8** at 320 × 568; **496 × 331.5** at 844 × 390 with touch. Frame measurements use the outer book border, not the inner leaf inside its rim. [Per-leaf results](../frontend/test-results/fixes-after/compact-outer-frame.json). |
| SIZE-02 / ANIM-01 — phone turns | At 390 × 844, Transcript App facing ↔ Meta-Contrast opening changed book height **388.5 ↔ 580.0 px**, controls top **519.2 ↔ 710.7 px**, and briefly enlarged the stationary frame to 608 px. Now **608.0 px** and controls **738.7 px** before loading, after poster/video start, during both directions, and after settling. | **Pass.** Compared at a common document offset. Repeated/alternating moves settled correctly; desktop remained stable. [Timing and route measurements](../frontend/test-results/fixes-after/measurements.json). |
| SIZE-03 / NAV-02 — resize, gesture, scroll | Rotating a touch phone to 844 × 390 previously showed two leaves and disabled swipe. It now shows one leaf, swipes one step each way, and preserves `#page-2` when the viewport rotates or crosses 760/761 px. The fine-pointer 844 × 390 case still shows two pages. | **Pass.** At 320 × 568, keyboard End reached the final Skills line (inner scroll **501/501 px**); a further vertical touch gesture scrolled the document **26 → 168 px** while controls stayed at **613.5 px** in document coordinates. Navigation resets the incoming inner scroll position. No horizontal overflow at the sampled compact widths. [Rotation/gesture retest](../frontend/test-results/fixes-after/retest.json) · [scroll chaining](../frontend/test-results/fixes-after/scroll-chain.json). |
| SIZE-01 — narrow two-page Skills | 768 × 1024: **644 × 865.2 → 644 × 675.6**, leaves **307.4 × 845.6 → 307.4 × 656**. 761 × 900: **637 × 880.5 → 637 × 675.6**, leaves **303.9 × 860.9 → 303.9 × 656**. | **Pass.** Both match About and the sampled media spreads; the last AI FDE bullet remains keyboard reachable. [Before/after bounds](../frontend/test-results/fixes-after/compare/layout.json). |
| Desktop regression gate | 1920 × 1080, 1440 × 900, 1280 × 720, 1024 × 768 and fine-pointer 844 × 390. | **Pass.** All 25 paired cover/About/Skills/Transcript App/Meta-Contrast screenshots were pixel-identical; the 1440 × 900 sweep verified all 10 spreads. Short desktop still uses document scroll. Actual tab zoom at 125% retained two pages; 200% retained compact reflow, both deep links, and reachable controls. [Screenshot diff](../frontend/test-results/fixes-after/desktop-diff.json) · [before screenshots](../frontend/test-results/fixes-baseline/) · [after screenshots](../frontend/test-results/fixes-after/compare/) · [zoom](../frontend/test-results/fixes-after/zoom.json). |
| NAV-01 / ANIM-02 / IMG-01 / MEDIA-01 / LINKS-01 | Existing behavior preserved. | **Pass.** Full forward/backward reading order at both baselines; portrait taps/swipes, reduced motion and focus; video playback/seek/fullscreen; diagram, certificate images, paper/dissertation/certificate/résumé PDFs, and decoded résumé QR. No uncaught page errors or unexpected asset failures in the supplemental sweep. |

Physical Android Chrome and iOS Safari: **Not run**; no physical devices available. Nothing was deployed.

## 8bit addition — verification

- Production build and TypeScript checks passed. All **20/20 Playwright tests passed** in Chromium, covering the six poses, reduced motion, repeat picks, turn timing, browser history, and the existing notebook regressions.
- Checked the 22 dialogue keys against `assests/8bit-dialogue.md`, including the cover, both leaves of all ten spreads, and the Vendor AI data-flow exhibit. Native email and phone links on the cover and final résumé leaf were tapped at 320 × 568: neither was intercepted by the notebook, and neither changed the route. External mail and dialer apps were not launched during emulation.
- Compared the cover, About, Transcript App facing view, final résumé leaf, and data-flow exhibit at 1440 × 900, 390 × 844, 320 × 568, and touch-first 844 × 390. All 20 sampled views retained their baseline frame, navigation, and media bounds within 0.125 CSS px. Showing, swapping, and dismissing the bubble did not change those bounds in document coordinates or change the document height. [Baseline](../frontend/test-results/8bit-baseline/) · [After captures and bounds](../frontend/test-results/8bit-final/).
- As agreed, compact notebook bubbles sit below the page controls. At tight cover/exhibit sizes the bubble can sit below the frame. A visitor-triggered message scrolls into view when needed; automatic greetings leave the viewport alone. The optional placement image was not supplied.

The browser checks used Chromium, including touch emulation. Physical Android Chrome and iOS Safari were **not run**.

### Mobile speech-bubble placement follow-up

The mobile bubble is now anchored to the mascot instead of placed below the cover or page controls. At 400 × 650 and 320 × 568, the cover bubble opens to the mascot’s left. On `/spread/about#page-2`, the mobile popover points toward the mascot from just below the bookmark row, keeping the bookmarks clear. Automatic greetings and tapped messages were fully visible at scroll position `(0, 0)` at both sizes. Desktop placement was also checked at 1440 × 900. [Screenshots and measurements](../frontend/test-results/8bit-anchor-layout/).

Production build and all **21 Chromium tests** passed. A touch swipe starting behind the visible bubble still turned the About leaf, and the Transcript App’s recording launched with the bubble visible. No physical-device checks were run for this follow-up.

### Compact bubble directly below 8bit

This supersedes the previous cover and notebook placement. The popover now floats over the bookmark row instead of moving below it. On the cover and `/spread/oak-d-lite-pothole-detection#page-2`, the arrow tip met the sprite’s bottom edge and was horizontally centered to within 0.1 CSS px at both 400 × 650 and 320 × 568, for automatic greetings and taps. The viewport did not scroll, and the OAK-D-Lite recording was still tappable while the bubble was open. Verification used Chromium touch emulation. [Screenshots](../frontend/test-results/8bit-attached/).
