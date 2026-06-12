# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project overview

Smile — Shox parda tekshiruvi: a mobile-first, Uzbek-language web app that "checks" eye health in ~10 seconds, built as the Uzbek adaptation of LION's Smile cornea-checker service for the official distributor in Uzbekistan (the product funnel sells LION "Smile" eye drops). The user takes a front-camera selfie, MediaPipe Face Landmarker locates the eyes **entirely in the browser** (the image never leaves the device — keep it that way; do not add server-side upload of captures), a heuristic scores redness and openness, and the result funnels into product recommendations. It is explicitly **not a medical device** — the UI repeats this disclaimer in several places; preserve those disclaimers when editing.

The UI is being matched to screenshots of the original Japanese app (eyecare-app.lion-apps.jp) supplied by the owner; visual details (green oval camera frame, score bars, star rating, "scroll ♡" hint, squircle bottom nav) intentionally mirror it. Original photos/text are not copied — illustrations are stylized SVGs and all copy is original Uzbek.

The UI is bilingual (Uzbek/Russian): all copy lives in the dictionaries in `src/lib/i18n.tsx` (`LanguageProvider` + `useLang()`); never hardcode UI strings in pages/components. The chosen language is stored in `localStorage` (`smile-lang`); on first visit `LanguageGate` blocks the app until a language is picked. SSR prerenders Uzbek (`<html lang="uz">`, updated client-side). Product copy (`short`/`description`) is localized per-product in `site.ts` via the `Localized` type. Code comments are in Uzbek. A "Powered by Dr Schats" mark (`PoweredBy`) appears on the home, terms, result pages and the language gate — keep it.

## Commands

- `npm install` — postinstall runs `scripts/setup-assets.mjs`: copies MediaPipe wasm out of `node_modules` and downloads the ~3.7 MB `face_landmarker.task` model into `public/mediapipe/wasm/` and `public/models/` (both gitignored; delete the files to force re-fetch).
- `npm run dev` — dev server. The camera (getUserMedia) only works on `localhost` or HTTPS; to test on a phone, expose the dev server through a tunnel (ngrok/cloudflared) or deploy.
- `npm run build` — production build; also runs the TypeScript check. All routes prerender statically.
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`).

No test framework is configured.

## Architecture

Capture, analysis, and result handoff are all client-side; the only backend is a small serverless API for the product catalog and admin panel (see below). The captured image must never be sent to a server:

1. `/` (home) — `CheckFlow.tsx` owns the pre-check modal sequence (disclaimer → remove glasses → face-in-frame → capture instructions) and only then navigates to `/check`.
2. `/check` — opens the front camera, pre-warms the landmarker, runs a 3‑2‑1 countdown, draws the video frame onto a canvas, and calls `analyzeCapture()`. On success the `AnalysisResult` is stored in `sessionStorage` under `RESULT_STORAGE_KEY` and the page navigates to `/result`.
3. `/result` — reads the result from `sessionStorage` after mount (redirects to `/` if missing), renders cornea/moisture score bars, a star rating, and per-eye crops (dataURL JPEGs).
4. The funnel continues `/result` → `/info` (cornea damage + Vitamin A explainer, inline stylized SVG illustrations) → `/products` (product carousel, `ProductCarousel.tsx`, scroll-snap with dots/arrows) → `/search` (5-step eye-drop finder wizard mirroring the original: symptoms multi-select → primary symptom → cooling feel → usage scene → product features). Results come from `searchProducts()`: strict AND filter over all criteria, falling back to primary-symptom matches with a "nothing matched everything" message when empty. Product `cooling` is the original's 0–7 star scale. The bottom nav's third item points to `/search`.

### `src/lib/analysis.ts` — the analysis core

Everything measurable lives here, including all calibration constants:

- `getFaceLandmarker()` — module-level singleton promise; loads self-hosted assets from `/mediapipe/wasm` and `/models/face_landmarker.task`; tries the GPU delegate and falls back to CPU; resets itself on failure so a retry can re-initialize.
- Redness — mean `R/(R+G+B)` over sclera pixels (inside the FaceMesh eye-contour polygon, outside the iris circle, skipping dark lash/shadow pixels), mapped from `[0.345, 0.43]` to 0–100.
- Openness — EAR (eye aspect ratio) mapped from `[0.14, 0.34]` to 0–100.
- `score = 100 − 0.7·redness − 0.3·(100−openness)`; level: ≥75 `good`, ≥50 `moderate`, otherwise `attention`. The `Level` union drives both the result verdict and product matching.

### Product catalog and admin panel

- The live catalog is stored in Vercel Blob (`catalog/products.json`, written by `saveCatalog()` in `src/lib/catalog.ts`); `src/config/site.ts` holds the seed list used as fallback whenever Blob is unconfigured (`BLOB_READ_WRITE_TOKEN` absent) or unreadable — the site must never end up productless. Client pages read via the `useProducts()` hook (renders seed first, then swaps in `/api/products` data; module-level cache).
- `/admin` (Uzbek-only, unlinked, noindex) manages products: add/edit/delete/reorder + multi-image upload to Blob (`/api/admin/upload`; the browser downscales to ~1200px JPEG via `compressImage()` before sending, server still caps at 4 MB JPG/PNG/WebP). Products carry `images: string[]` (first = main; carousel shows the first, search results render a thumbnail switcher); `validateProduct()` migrates legacy single-`image` records. Auth is `ADMIN_PASSWORD` env (min 8 chars; login disabled when unset — no default password) with an HMAC-derived httpOnly cookie (`src/lib/adminAuth.ts`). `PUT /api/admin/products` replaces the whole catalog after `validateCatalog()`.
- `searchProducts(catalog, criteria)` and `recommendedProducts(catalog, level)` take the catalog as a parameter — don't reintroduce module-level product reads.

### Configuration and theming

- `src/config/site.ts` is the single source for the brand name, headline, taglines, and the seed product catalog (LION "Smile" eye-drop lineup — exact assortment/copy pending distributor confirmation). Change brand copy here, not in pages.
- Tailwind CSS v4 — there is no `tailwind.config`; design tokens are CSS variables in `src/app/globals.css` mapped through `@theme inline` to utility names (`brand-green`, `brand-red`, `accent-dark`, `surface`, `muted`, …). Shared effects (`dot-pattern`, `glow-card`, `bracketed`, pop-in/pulse animations) are defined there too.
- Layout is mobile-first: every page constrains content to `max-w-md`.
