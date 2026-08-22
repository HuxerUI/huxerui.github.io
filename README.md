# HuxerUI website

This repository builds the official HuxerUI website and user documentation at [huxerui.github.io](https://huxerui.github.io).
Astro owns the public landing pages and Starlight renders documentation written and maintained in this repository.

## Requirements

- Node.js 22.12 or later
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
