# Tanmay’s Portfolio — Release 1

A local frontend preview of Tanmay Patel’s engineering notebook. No backend, API keys, or live chat are needed.

## Run locally

Use Node.js 20.19+ (20.x) or 22.12 or newer.

```sh
cd frontend
npm ci
npm run dev
```

Open `http://localhost:5173` (or use the URL printed by Vite).

## Production preview and browser checks

```sh
npm run typecheck
npm run build
npm run preview
```

Open `http://localhost:4173`. On desktop, press Right Arrow or select **Open portfolio** to open the cover, then use the arrow keys, page controls, or chapter bookmarks. Individual spreads, such as `/spread/skills-and-frameworks` and `/spread/oak-d-lite-pothole-detection`, also work on refresh. The old Experiments URL opens Skills and Frameworks. On mobile, add `#page-2` to open the facing page directly, or use tap and horizontal swipe without blocking vertical scroll.

To run the browser checks, stop the preview above first, then run:

```sh
npx playwright install chromium
npm test
```

The test runner starts its own production preview on port 4173 and writes visual-review screenshots to `frontend/test-results/`.

The original evidence remains in `assests/`. Only files selected for `frontend/public/` are served. The Transcript App uses the approved full-length practice recording with its original stereo audio. Research links to the full conference paper and to a separate dissertation PDF containing only source pages 1–59. Certificates precede the final résumé spread, which still offers the local PDF and Google Drive QR. See [`docs/new_changes.md`](docs/new_changes.md) for the revision brief. Deployment and live chat are outside this revision.
