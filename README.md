# HuxerUI website

This repository builds the official HuxerUI website and user documentation at [huxerui.github.io](https://huxerui.github.io).
Astro owns the public landing pages and Starlight renders documentation written and maintained in this repository.

## Requirements

- Node.js 22.23.4 or later (Node.js 24 is used in CI)
- Git
- Emscripten 4.0.19, CMake, and Ninja only when building interactive Web examples locally

## Local development

Install exact dependencies:

```bash
npm ci
```

Run the local development server:

```bash
npm run dev
```

## Documentation

User documentation lives under `src/content/docs` and is organized around the HuxerUI DSL, components, application services, platform integration, and complete public API coverage.
Current public headers, executable tests, and examples in [HuxerUI/HuxerUI](https://github.com/HuxerUI/HuxerUI) are the evidence for documented behavior.
Framework architecture and design notes are not copied into the website.

`huxerui-source.json` selects the framework repository, ref, and published Web example set.

## Releases

`scripts/collect-release-data.mjs` requests the latest GitHub Release during the build, reads its archive checksums, and writes ignored static data.
The resulting page does not call GitHub at browser runtime.
Before the first tagged SDK release, the page presents an explicit unpublished state rather than invented download information.

## Interactive examples

The Pages deployment builds the curated showcases selected by `huxerui-source.json`, with presentation metadata in `src/data/examples.ts`. Keep the two catalogs aligned. Prefer examples that demonstrate distinct framework capabilities through a complete interactive experience; basic component and service examples belong in the documentation and linked source repository, not additional online demo pages.

`scripts/stage-web-examples.mjs` copies each HTML, ES module, Wasm binary, and optional resource payload into its own ignored `public/demos/<name>` directory.
Each example route lazy-loads only its selected application.
The deployment resolves the repository and ref selected by `huxerui-source.json` into `.cache/huxerui`; this source checkout is used only to build the interactive examples.

To stage an existing local Web build:

```powershell
$env:HUXERUI_WEB_BUILD_DIR = "D:\path\to\huxerui-web-build"
npm run stage:examples
```

## Validation and deployment

```bash
npm run check
npm run build
npm run check:links
```

`validate.yml` checks every website change.
`deploy.yml` builds the selected HuxerUI Web examples, validates the site, and deploys the `dist` artifact through GitHub Pages Actions.
No `gh-pages` branch content is maintained manually.

## Updating the framework revision

Audit the candidate with npm run audit:revision -- /path/to/HuxerUI. Review changed header owners, public member contracts and selected examples before pinning huxerui-source.json. Update user-facing content and scripts/api-coverage.mjs, then record the reviewed headers with --record-header-review. The tracked scripts/api-review.json catches any later header change, including additions inside an existing header; its hashes are review signals, not an automatic API classification.

Complete C++ fences use compile="id"; explanatory fences use fragment. Add module to a complete import-based unit. Module units are compiled with the pinned modules/huxerui.cppm and the selected MSVC std module, separately from C++20 header examples. Deployment requires both profiles.

The documentation version notice identifies the source revision. Release metadata is refreshed during checks/builds, and the download page can report an older released SDK than this development manual. Keep source build instructions and the explicit platform verification boundaries current.
