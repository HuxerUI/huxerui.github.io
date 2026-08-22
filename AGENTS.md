# HuxerUI Website Agent Guide

This repository owns the HuxerUI public website, user documentation, presentation metadata, build integration, and deployment.
The framework repository remains the source of truth for public API declarations, executable behavior, examples, supported capabilities, architecture notes, and release artifacts.

## Workflow

- Discuss intended edits before changing files unless the current request explicitly authorizes implementation.
- Preserve concurrent owner changes and inspect `git status --short` before and after work.
- Do not stage, commit, push, rewrite history, or publish without an explicit request.
- Use English for website content, source comments, diagnostics, and maintenance documentation.
- Use English Conventional Commits when a commit is requested.
- Keep generated documents, release metadata, Web demo artifacts, build output, and checkout caches ignored.

## Content ownership

- Write and organize user documentation in this repository instead of publishing framework design documents.
- Treat current public headers, executable tests, and examples as evidence for documented contracts; do not copy framework Markdown into website pages.
- Keep the selected framework ref for Web examples centralized in `huxerui-source.json`.
- Every public component has a dedicated user page, while complete API coverage is organized by coherent module rather than one page per trivial type.
- Curated website content must not claim capabilities absent from current public headers, tests, or examples.
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
