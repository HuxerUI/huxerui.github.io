# HuxerUI website

This repository builds the official HuxerUI website at [huxerui.github.io](https://huxerui.github.io).
Astro owns the public landing pages and Starlight renders canonical framework documentation synchronized from [HuxerUI/HuxerUI](https://github.com/HuxerUI/HuxerUI).

## Requirements

- Node.js 22.12 or later
- Git
- Emscripten 4.0.19, CMake, and Ninja only when building interactive Web examples locally

## Local development

Install exact dependencies:

```bash
npm ci
```

Point the website at a local HuxerUI checkout to avoid a temporary clone:

```powershell
$env:HUXERUI_SOURCE_DIR = "D:\path\to\HuxerUI"
npm run dev
```

```bash
HUXERUI_SOURCE_DIR=/path/to/HuxerUI npm run dev
```

Without `HUXERUI_SOURCE_DIR`, the content synchronizer clones the configured source ref into `.cache/huxerui` and refreshes that ref on later runs.

## Canonical content

`huxerui-source.json` is the single website configuration for the framework repository, selected ref, synchronized documents, and published Web example set.
`scripts/sync-huxerui-content.mjs` generates Starlight-ready documents under `src/content/docs/generated` and keeps edit links pointed at the canonical source.
Generated documents are never committed.

The custom Components, Platforms, Examples, and Downloads pages contain display metadata only.
Technical contracts remain owned by the framework repository.

## Releases

`scripts/collect-release-data.mjs` requests the latest GitHub Release during the build, reads its archive checksums, and writes ignored static data.
The resulting page does not call GitHub at browser runtime.
Before the first tagged SDK release, the page presents an explicit unpublished state rather than invented download information.

## Interactive examples

The Pages deployment configures HuxerUI with Emscripten and builds these independent examples:

- UI Gallery
- Canvas
- Tabs
- Navigation
- Theme
- Image
- Presentation

`scripts/stage-web-examples.mjs` copies each HTML, ES module, Wasm binary, and optional resource payload into its own ignored `public/demos/<name>` directory.
Each example route lazy-loads only its selected application.

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
