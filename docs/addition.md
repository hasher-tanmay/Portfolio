# Add 8bit to the portfolio

OpenCode implementation brief for `C:\Users\LENOVO\portfolio\frontend`. Replace the existing **Ask how I built this** preview panel with 8bit and its speech bubble. Keep the rest of the portfolio as it is.

## Inputs

Tanmay will put these in the checkout’s asset folder, currently named `assests/`:

| Asset | Use |
| --- | --- |
| `8bit-preview.html` | Reuse the pixel mascot, palette and six animation poses. Extract the mascot markup and scoped CSS. |
| `8bit-dialogue.md` | The approved copy. Each route or leaf has exactly three options. Preserve wording, punctuation and contact details. |
| `8bit-placement.png`, if supplied | Visual reference for the top-right placement on desktop and phone. |

Use the standalone HTML as a source for the mascot. Keep its demo controls and page styles out of the portfolio. If a supplied file is named differently, match it by contents. Report any asset or dialogue entry that is missing so it can be supplied.

## Replace the panel and place 8bit

- In `src/App.tsx`, remove the `details.sidekick` preview from `Book` and remove CSS used exclusively by that panel from `src/styles.css`.
- Mount one 8bit instance by the **top-right corner of the stationary frame** on the cover and open notebook. Give the linked Vendor AI data-flow exhibit the same top-right treatment. Keep the component outside the animated sheets and out of the frame’s normal layout flow.
- Open the bubble to the left of 8bit in the space above the page. Keep the phone sprite smaller and use the established compact layout, including touch landscape. The avatar and bubble have to clear existing links, bookmarks, media controls, and the leaf’s swipe and scroll area. Use the existing space around the book so showing or dismissing a bubble adds no height and shifts no controls. At narrow widths, fit the bubble within the available viewport space and wrap the text.
- Make the message text slightly smaller than in the placement mockup. Start around `0.875rem` on desktop and `0.8125rem` in compact mode, with line height around `1.35`. Keep the notebook’s type and spacing unchanged. Let the contact line wrap when necessary so both links remain readable and tappable.
- Use a real button with an accessible name such as **Show another 8bit message**. Keep a visible focus ring and a usable touch target even with a smaller sprite. Only the avatar and interactive bubble content should receive pointer input.

## One page, one message

1. Put the approved copy in a small typed frontend catalog indexed by the existing route and leaf. Treat each entry as a tuple of exactly three options. Use the existing router and layout mode to determine the key. Keep Markdown as the review source and use plain strings in the UI.
2. Use the cover’s options at `/` and the exhibit’s options at `/spread/vendor-ai-assistant/data-flow`. In compact mode, use the visible lead or facing leaf, including `#page-2`. In two-page mode, use the facing leaf’s options, since it is closest to 8bit. Display one bubble per spread. Every lead and facing leaf still has its own three options in compact mode.
3. After a page settles, randomly pick **one** of its three options. On a repeat visit to the same page within the tab session, draw from the other two so the same line does not repeat immediately. Keep the selection stable through ordinary renders. Resizing or rotating only requires a new pick if the effective dialogue key changes.
4. On click, tap, or keyboard activation, draw another option for the **current** page and show it immediately. Keep only one bubble visible. Let a short automatic greeting fade after a few seconds. Keep a visitor-opened bubble available until dismissed, replaced, or navigated away from. Allow Escape to dismiss it, and pause automatic dismissal while a link has focus or is being hovered.
5. Cancel any old delay and clear the previous bubble when navigation begins. Show the destination’s line after its turn settles, including after Back, Forward, or a direct link. The message must never lag one page behind.
6. On the cover and final résumé leaf, preserve the hiring line and render `workingtanmay@gmail.com` and `+919317687514` as `mailto:` and `tel:` links. These links should open through their native behavior without flipping the page.

All dialogue and randomization run locally in the frontend. Use the supplied three options as the complete source of visible messages.

## Randomize the existing poses

- Reuse **Idle, Blink, Peek, Wave, Thinking, and Celebrate** from the preview.
- Choose a short pose when a message appears, independently of the chosen line. Avoid the immediately previous pose when picking again. Rest between poses and keep 8bit stationary during page turns. A replay should restart the chosen animation cleanly.
- Respect `prefers-reduced-motion`. Show a still pose and the same copy while skipping the mascot’s movement and bubble transitions.
- Keep avatar styles scoped so its keyframes, layout and button rules don’t affect the notebook. Use the existing book-turn lifecycle rather than creating a second navigation or animation system.

## Verify before handoff

- Run `npm.cmd run build` and `npm.cmd test` from `frontend/`.
- Check all 22 dialogue keys in the supplied draft: cover, 20 leaves, and the data-flow exhibit. Verify that each resolves to exactly three options, that only one is visible, and that every repeat pick comes from the current page. Walk through enough states to check all six poses, including the reduced-motion fallback.
- At desktop and phone sizes, compare the cover, frame dimensions, navigation positions, and media against the current build. Check at 1440 × 900, 390 × 844, 320 × 568, and touch landscape. Verify the bubble clears the content, and that opening, swapping or dismissing it causes no shifts.
- Smoke-test page turns, touch swipes, bookmarks, keyboard navigation, direct leaf links, browser history, video controls and contact links. Check fast turns and taps so stale messages never appear.
- Report the files changed and what passed. The only intended visible differences are removal of the preview panel and the new 8bit mascot and bubble. Keep the current pages, order, links, artwork, media, frame sizes, and animation of the notebook itself intact.
