# Tanmay Patel Portfolio — Release 1

## Scope and starting point

Build a runnable, local-only frontend preview in `C:\Users\LENOVO\portfolio\frontend`. No deployment, backend, live chat, API keys, or running project integrations. Release 1 is implemented; verification and omissions are recorded below.

The current workspace has a starter `frontend/package.json`. Read `docs/AGENTS.md` and its three linked specs (`docs/PRODUCT.md`, `docs/BRAND.md`, and `docs/TECHSTACK.md`). The evidence folder is actually spelled `assests/`; its extensionless `design` file is the notebook mockup. The user's explicit four-project selection controls the Projects index; the OAK-D-Lite material is a candidate for Experiments, not a fifth project.

## 1. Build the notebook

- Use React, Vite, strict TypeScript without `any`, and responsive CSS. Pin dependency versions and document setup at implementation. Keep one typed content catalog for spreads, source links, and reading order; derive the active spread from the router rather than duplicating route state. Bundle only approved assets; do not expose the entire evidence folder.
- Start `/` on the closed cloth cover with “Open portfolio” leading to About. Once open on desktop, recreate the mockup’s two-page graphite notebook, left-side chapter bookmarks, layered paper edges, center fold, and thin rules. Use the Vendor AI Assistant spread for visual comparison. The mockup is a visual reference, not a flattened web page or a source of technical claims.
- Use the Brand palette: backdrop `#101011`, cover `#19191B`, paper `#242325`, primary ink `#F2E6D5`, muted ink `#BFB4A8`, and copper `#DE9A70` for active bookmarks, links, and focus. Use Instrument Serif for major titles, Instrument Sans for body and navigation, and JetBrains Mono for metrics/code, with system fallbacks.
- Desktop: Previous/Next links and Left/Right keyboard shortcuts; leave shortcuts inactive when typing or using media controls. Mobile: one page at a time, with tap and horizontal-swipe navigation plus compact bookmarks. Keep vertical scrolling and media controls usable; tap controls must work without swiping. A direct spread URL opens the first page of that spread immediately; use a URL fragment for the second mobile page so refresh and browser history can restore it. Use semantic navigation, visible focus, current-page indication, usable touch targets, and predictable focus after navigation.
- Use a short spine-pinned CSS 3D page turn (no Three.js). Under `prefers-reduced-motion`, switch pages immediately and remove animated scrolling and nonessential transitions. Recorded media are user-initiated, never autoplayed.

## 2. Add the chapters and four selected projects

Proposed reading order and direct paths:

| Page | Path | Evidence and editorial approach |
| --- | --- | --- |
| Cover | `/` | `assests/design`; “Build Log,” “Tanmay’s Portfolio,” and “Backend & Applied AI Engineer,” as specified in Product and Brand. |
| About | `/spread/about` | Résumé-backed introduction, Octro data engineering experience, and NIT Hamirpur education. Link [GitHub](https://github.com/hasher-tanmay) and [LinkedIn](https://www.linkedin.com/in/tanmay-patel22/). |
| Projects index | `/spread/projects` | List exactly the four repositories selected in the screenshot. |
| Vendor AI Assistant | `/spread/vendor-ai-assistant` | [Repository](https://github.com/hasher-tanmay/Vendor-AI-Assistant), résumé, and the two `vendor_project*.png` captures. Describe the role-aware assistant, PySpark Bronze/Silver/Gold pipeline, SQLite serving, and separate policy-document retrieval. Draw the flow from evidence rather than treating the mockup’s simplified arrows as fact. Use screenshots rather than the temporary Gradio URL. |
| Harbor — Autonomous Task Worker | `/spread/autonomous-task-worker` | [Repository](https://github.com/hasher-tanmay/autonomous-task-worker) README. Describe the synthetic invoice portal prototype, with human approval and record verification as design decisions. Link repository evidence; do not run or embed the worker or claim production use. |
| Transcript App | `/spread/transcript-app` | [Repository](https://github.com/hasher-tanmay/transcript-app) was empty when checked. Review `assests/trasncript_app demo.mp4` before writing feature copy or serving it. Use only what the recording demonstrates; no claims about architecture, transcription accuracy, or availability without more evidence. If linking GitHub, label it “Repository,” not “View code.” |
| Meta-Contrast — Endoscopy Image Classification | `/spread/endoscopy-image-classification` | [Repository](https://github.com/hasher-tanmay/Endoscopy_Image_Classification), conference paper, and résumé. Describe the research approach and report 96.92% test accuracy on the Kvasir-VQA subset as a paper-reported result, not clinical validation. Use EfficientNetV2-B0 as described in the paper and résumé rather than repeating the GitHub summary’s “EfficientNetB0.” Omit conflicting class-distribution, split, and kappa details unless reconciled or clearly attributed. |
| Research | `/spread/research` | Summarize the Meta-Contrast paper and ICICST 2026 presentation; distinguish “presented” from “published.” Use the conference paper as a local artifact after shareability review. Keep the raw thesis out of the frontend because it includes a similarity report and identifiers; a clean copy can be added later. |
| Experiments | `/spread/experiments` | Review `assests/960-oak-d-live_video.mp4`; show only confirmed, shareable material as a recorded experiment, separate from the four projects. Add OpenClaw or other interview-build notes only if approved evidence is supplied or identified; cross-link Harbor if useful rather than duplicating it. If nothing is verified, keep a brief no-evidence note rather than inventing content. |
| Résumé / final spread | `/spread/resume` | Local PDF open/download, GitHub and LinkedIn, and a high-contrast QR code plus a clickable link to the supplied Google Drive résumé. |

On case-study spreads, put the problem, Tanmay’s contribution (in first person), and engineering decision on the left; put a diagram, demo, or reported results on the right. Use short captions and meaningful alt text. Review videos for visible private information and provide captions or a text equivalent as appropriate; load the 32 MB Transcript App recording only on request. Certificates are optional evidence, not automatic downloads. Do not copy private identifiers or phone details into site copy. Include “Ask how I built this” as a collapsed, labeled Preview disclosure; it opens to a short note that live chat is coming later. No input, network requests, or chat backend.

## 3. Make the résumé QR usable without deployment

- Serve `assests/Tanmay_Patel_Resume.pdf` at a stable local URL such as `/resume.pdf` for open/download in the preview. Use a local QR generator, not an external QR service. Encode the exact supplied URL: `https://drive.google.com/file/d/1bbphDAvdkYb4XFUR4Ba1KKkAuMNY95wn/view?usp=sharing`. Use the same target for the nearby “Open résumé on Google Drive” link.
- Verify the QR decodes to that URL and check Drive access in a signed-out browser; the URL was reachable during planning, but account-free document access was not confirmed. Report any permissions issue instead of claiming public access. The phone doesn't need to reach the local server for the Drive QR. Report a real-device scan separately from browser emulation.

## 4. Verification and handoff

- Proposed local run from `frontend/`: `npm install`, then `npm run dev`. Run `npm run typecheck` and `npm run build`, then use `npm run preview` for browser checks against the production output. Document the actual preview URL and Node requirement.
- On desktop, compare the cover and Vendor spread against `assests/design`; test Open Portfolio, the bookmarks, all four project links, Previous/Next, Left/Right navigation, browser Back/Forward, keyboard focus, and the static Preview disclosure.
- At mobile width (e.g. 390 px, plus a 320 px overflow check), test tap and swipe navigation across pages and spreads. Verify vertical scrolling, media interaction, browser history, QR visibility, and no horizontal overflow.
- Open every `/spread/...` path independently in the production preview and hard-refresh it. Check that headings and active sections survive, verify a second-page mobile link, confirm evidence links and assets resolve, and check that an unknown slug offers a way back. Use the local preview's SPA fallback; actual host configuration is deferred.
- Emulate reduced motion and verify there is no page turn or smooth scrolling while links, focus, and history still work. Check the PDF opens/downloads, the QR decodes, and all included local media render or play.
- Report what passed and what wasn't tested. List any omitted assets or claims and why, including anything unavailable, unverified, or unsuitable for sharing. Leave deployment and live chat for a later release.

## Questions before implementation

No required clarification for the proposed scope. If there are approved OpenClaw/interview-build materials, a clean thesis PDF, or a separate shareable Transcript App code link, provide them before implementation if they should be included. Otherwise leave unsupported material out and report the omission.

## Release 1 handoff

- Run from `frontend/` with `npm ci` then `npm run dev`. To serve the production build locally, run `npm run build` then `npm run preview`.
- `npm run typecheck`, `npm run build`, and all five Chromium tests passed. Verified desktop links, arrow keys, and history; emulated mobile tap, horizontal swipe, vertical scroll, and 320 px layouts; all nine direct spread refreshes; mobile `#page-2`; reduced motion; curated asset URLs, OAK-D playback, résumé download, and QR decoding. Compared the cover and Vendor spread screenshots with the mockup.
- The Drive link opened in a signed-out browser, and its downloaded PDF matched the local PDF byte for byte. The GitHub profile, all four repository URLs, and Harbor’s demo section were verified. LinkedIn blocked automated verification; the supplied URL is included unchanged in meaning. A physical-device scan was not performed.
- The original Transcript App recording contains browser chrome, webcam footage, and transcript details; use a cropped still and a text walkthrough instead. The empty repo is labeled “Repository.” Use only the architecture page from the conference paper; don't serve the full paper with its medical imagery or the thesis with its administrative attachments. No unconfirmed research metrics, OpenClaw notes, unused certificates, or temporary Gradio demo links were included.
