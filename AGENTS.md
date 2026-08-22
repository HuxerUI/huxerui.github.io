# HuxerUI Website Agent Guide

This repository owns the HuxerUI public website, presentation metadata, build integration, and deployment.
The framework repository remains the source of truth for technical documentation, public APIs, examples, supported capabilities, and release artifacts.

## Workflow

- Discuss intended edits before changing files unless the current request explicitly authorizes implementation.
- Preserve concurrent owner changes and inspect `git status --short` before and after work.
- Do not stage, commit, push, rewrite history, or publish without an explicit request.
- Use English for website content, source comments, diagnostics, and maintenance documentation.
- Use English Conventional Commits when a commit is requested.
- Keep generated documents, release metadata, Web demo artifacts, build output, and checkout caches ignored.

## Content ownership

- Do not copy framework guides into hand-maintained website pages.
- Synchronize canonical documents through `huxerui-source.json` and `scripts/sync-huxerui-content.mjs`.
- Keep the selected framework ref centralized in `huxerui-source.json`.
- Curated website metadata may organize discoverability, but it must not claim capabilities absent from current public headers, examples, or canonical documentation.
- Display planned platforms or features explicitly as planned.
- Fetch Release metadata at build time; do not call the GitHub API from the browser.

## Implementation

- Use Astro and Starlight with TypeScript and ordinary CSS.
- Do not add React, Vue, Tailwind, a CMS, or a server runtime without an approved need.
- Prefer semantic HTML, keyboard-visible focus, reduced-motion support, and responsive layouts.
- Keep each Web example as an independent Emscripten application and load it only on its own page or explicit preview.
- Avoid forwarding-only scripts, duplicate data sources, and abstractions that do not own behavior.
- Keep the GitHub organization Pages base path at `/`.

## Validation

Run `npm ci`, `npm run check`, `npm run build`, `npm run check:links`, and `git diff --check` as appropriate.
Inspect both light and dark themes at desktop and mobile widths.
Report Web example or deployment behavior that cannot be reproduced locally.
