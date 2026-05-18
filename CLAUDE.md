# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run lint` — ESLint over the repo
- `npm run preview` — preview the built `dist/`
- `npm run deploy` — builds (via `predeploy`) and publishes `dist/` to GitHub Pages via `gh-pages`

No test framework is configured.

## Architecture

Single-page React 19 + Vite + Tailwind app that recommends Sprint Retrospective formats. The entire app is in `src/App.jsx`; `src/main.jsx` just mounts it. There is no router — navigation is a `view` state string (`'home' | 'quiz' | 'result' | 'all' | 'detail'`) switched inside `App`.

Key data structures inside `App.jsx`:

- `patternsData` — the source of truth for all 12 retro patterns. Each entry has `id`, `name`, `category`, `icon` (a `lucide-react` JSX element), `imageUrl`, `pros`/`cons`/`scenario`, `tags`, and an `areas` array. Each `area` has its own icon, `colorBg` (Tailwind classes), `desc`, and `commonTags`. When adding a pattern, mirror this shape exactly — the detail view and card both iterate these fields without optional-chaining beyond `imageUrl` and `commonTags`.
- `quizOptions` — quiz answers (A–F). Each option's `results` array lists pattern IDs to weight. `handleSubmitQuiz` tallies frequency across multi-selected options and shows the top 3.
- `getTagStyle(tag)` — maps Chinese keyword substrings in `commonTags` (慶祝/保持/阻礙/嘗試/風險/疑惑/學習) to colored Tailwind badge classes. New tag categories must be added here or they fall back to slate.

UI copy is in Traditional Chinese; preserve language when editing user-facing strings.

## Deployment

- Vite `base` is hardcoded to `/retro-finder/` (`vite.config.js`) to match the GitHub Pages path. `package.json` `homepage` points at `https://rest950.github.io/retro-finder`. If the repo or Pages path changes, update both.
- `npm run deploy` pushes `dist/` to the `gh-pages` branch.
