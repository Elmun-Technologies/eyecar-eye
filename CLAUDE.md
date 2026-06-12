# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project overview

EyeCare — a mobile-first, Uzbek-language web app that "checks" eye health in ~10 seconds: the user takes a front-camera selfie, MediaPipe Face Landmarker locates the eyes **entirely in the browser** (the image never leaves the device — keep it that way; do not add server-side upload of captures), a heuristic scores redness and openness, and the result funnels into product recommendations. It is explicitly **not a medical device** — the UI repeats this disclaimer in several places; preserve those disclaimers when editing.

All UI copy, error messages, and code comments are in Uzbek (`<html lang="uz">`).

## Commands

- `npm install` — postinstall runs `scripts/setup-assets.mjs`: copies MediaPipe wasm out of `node_modules` and downloads the ~3.7 MB `face_landmarker.task` model into `public/mediapipe/wasm/` and `public/models/` (both gitignored; delete the files to force re-fetch).
- `npm run dev` — dev server. The camera (getUserMedia) only works on `localhost` or HTTPS; to test on a phone, expose the dev server through a tunnel (ngrok/cloudflared) or deploy.
- `npm run build` — production build; also runs the TypeScript check. All routes prerender statically.
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`).

No test framework is configured.

## Architecture

There is no backend — capture, analysis, and result handoff are all client-side:

1. `/` (home) — `CheckFlow.tsx` owns the pre-check modal sequence (disclaimer → remove glasses → face-in-frame → capture instructions) and only then navigates to `/check`.
2. `/check` — opens the front camera, pre-warms the landmarker, runs a 3‑2‑1 countdown, draws the video frame onto a canvas, and calls `analyzeCapture()`. On success the `AnalysisResult` is stored in `sessionStorage` under `RESULT_STORAGE_KEY` and the page navigates to `/result`.
3. `/result` — reads the result from `sessionStorage` after mount (redirects to `/` if missing), renders cornea/moisture score bars, a star rating, and per-eye crops (dataURL JPEGs), then links onward to `/info` (cornea info + product CTA) and `/products`.

### `src/lib/analysis.ts` — the analysis core

Everything measurable lives here, including all calibration constants:

- `getFaceLandmarker()` — module-level singleton promise; loads self-hosted assets from `/mediapipe/wasm` and `/models/face_landmarker.task`; tries the GPU delegate and falls back to CPU; resets itself on failure so a retry can re-initialize.
- Redness — mean `R/(R+G+B)` over sclera pixels (inside the FaceMesh eye-contour polygon, outside the iris circle, skipping dark lash/shadow pixels), mapped from `[0.345, 0.43]` to 0–100.
- Openness — EAR (eye aspect ratio) mapped from `[0.14, 0.34]` to 0–100.
- `score = 100 − 0.7·redness − 0.3·(100−openness)`; level: ≥75 `good`, ≥50 `moderate`, otherwise `attention`. The `Level` union drives both the result verdict and product matching.

### Configuration and theming

- `src/config/site.ts` is the single source for the brand name, headline, taglines, and the product catalog; `recommendedProducts(level)` decides what `/info` recommends. Change brand/product copy here, not in pages.
- Tailwind CSS v4 — there is no `tailwind.config`; design tokens are CSS variables in `src/app/globals.css` mapped through `@theme inline` to utility names (`brand-green`, `brand-red`, `accent-dark`, `surface`, `muted`, …). Shared effects (`dot-pattern`, `glow-card`, `bracketed`, pop-in/pulse animations) are defined there too.
- Layout is mobile-first: every page constrains content to `max-w-md`.
