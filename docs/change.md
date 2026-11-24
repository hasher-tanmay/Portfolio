# Portfolio frontend revision

## Review

The supplied localhost screenshots show the closed cover beside open spreads, a text-heavy Research spread with an excerpt link, and Harbor references on the OAK-D-Lite recording spread. The animation blink, first right-arrow failure, and varying page heights were reported by Tanmay. Reproduce these in the deployed build and locally before diagnosing the code. Compare the deployed and local revisions if their behavior differs.

## Changes

1. **Cover and open book.** Use the centered cover on the home route. On opening, hinge it away around the spine, then show a centered spread with the left bookmarks. Render no standalone cover beside an open spread. Put a compact Back to cover control near the book. Direct spread URLs open immediately.
2. **Page turn.** Keep the outgoing and incoming pages visible during a CSS 3D turn. Animate a two-sided sheet around its spine with perspective, a moving shadow, and direction reversed for Previous. Keep the destination underneath and reserve the same book dimensions throughout the turn. Start around 450–550 ms and tune by feel. Use immediate navigation with reduced motion. Ensure rapid or repeated input cannot leave the controls stuck, and preserve interactive media and links once the turn ends.
3. **Visual evidence.** Give each flagship spread one dominant visual. Use annotated Vendor AI screenshots for product clarification and returns, the OAK-D-Lite demo with a stable video poster, and a verified method figure or results visual for Meta-Contrast. Put a short caption beside each visual explaining what it demonstrates. Keep copy tight and avoid stock imagery or invented metrics.
4. **Research PDF.** Replace the excerpt CTA with “Read the conference paper (PDF)” pointing to the full Tanmay_Patel_Conference_paper.pdf. Verify the title and multiple pages in the production build. If a thesis link is included, label it separately.
5. **OAK-D-Lite and Harbor.** Remove Harbor copy and links from the pothole content. Put the recording with the OAK-D-Lite featured project, with any Experiments reference pointing back to it. If Harbor is approved for the portfolio, give it a separately labeled entry with its own evidence.
6. **First right arrow.** Reproduce on the cover and immediately after opening. Trace button events, disabled logic, overlays, and the active route against the ordered spread list. Use the same next/previous logic for the buttons, keyboard, and mobile taps or swipe. Confirm About → first Projects spread and that Next disables only at the end.
7. **Responsive dimensions.** Size the desktop book from its available width and viewport height, with a shared page frame and stable navigation position. Keep short spreads compact by editing copy and balancing visuals, and split long content into another spread or a clearly linked detail section. Reserve media space before it loads. Use a single naturally scrolling page on mobile. Avoid a height equal to the tallest spread, clipped content, and nested mobile scrolling.

## Verification

- Check cover → About → Projects, reverse navigation, bookmarks, direct URLs, and browser Back and Forward.
- Check forward and backward turns, quick repeat input, reduced motion, and keyboard access.
- Compare a short and long spread at 1440px, 1024px, and 390px. Verify readable text, reachable controls, stable desktop geometry, and no horizontal overflow.
- Play the pothole recording and open the full conference PDF from the production build. Confirm Harbor is absent from the pothole spread.



