import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://huxerui.github.io",
  integrations: [
    sitemap(),
    starlight({
      title: "HuxerUI",
      description: "Declarative, native, cross-platform UI in modern C++.",
      disable404Route: true,
      logo: {
        light: "./src/assets/logo-light.png",
        dark: "./src/assets/logo-dark.png",
        alt: "HuxerUI",
      },
      favicon: "/favicon.svg",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/HuxerUI/HuxerUI",
        },
      ],
      editLink: {
        baseUrl: "https://github.com/HuxerUI/huxerui.github.io/edit/main/",
      },
      customCss: ["./src/styles/starlight.css"],
      components: {
        Header: "./src/components/DocsHeader.astro",
      },
      head: [
        {
          tag: "meta",
          attrs: { property: "og:image", content: "https://huxerui.github.io/social-card.png" },
        },
        {
          tag: "meta",
          attrs: { name: "twitter:card", content: "summary" },
        },
      ],
      sidebar: [
        {
          label: "Start here",
          items: [
            { label: "Overview", link: "/docs/" },
            { label: "Installation", link: "/docs/get-started/installation/" },
            { label: "Create a project", link: "/docs/get-started/create-a-project/" },
            { label: "First application", link: "/docs/get-started/first-application/" },
          ],
        },
        {
          label: "The HuxerUI DSL",
          items: [
            { label: "DSL fundamentals", link: "/docs/dsl/fundamentals/" },
            { label: "State and recomposition", link: "/docs/dsl/state-and-recomposition/" },
            { label: "Events and interaction", link: "/docs/dsl/events-and-interaction/" },
            { label: "Interaction visuals", link: "/docs/guides/interaction-visuals/" },
            { label: "Modifiers", link: "/docs/dsl/modifiers/" },
            { label: "Composition and identity", link: "/docs/dsl/composition-and-identity/" },
          ],
        },
        {
          label: "Layout",
          items: [
            { label: "Layout and constraints", link: "/docs/layout/" },
            { label: "Responsive interfaces", link: "/docs/layout/responsive-interfaces/" },
          ],
        },
        {
          label: "Components",
          items: [{ autogenerate: { directory: "components" } }],
        },
        {
          label: "Build applications",
          items: [
            { label: "Navigation and routing", link: "/docs/guides/navigation-and-routing/" },
            { label: "Presentation", link: "/docs/guides/presentation/" },
            { label: "Theme and styling", link: "/docs/guides/theme-and-styling/" },
            { label: "Animation", link: "/docs/guides/animation/" },
            { label: "Resources and localization", link: "/docs/guides/resources-and-localization/" },
            { label: "Accessibility", link: "/docs/guides/accessibility/" },
            { label: "Lifecycle and activation", link: "/docs/guides/lifecycle-and-activation/" },
            { label: "Tasks", link: "/docs/guides/tasks/" },
            { label: "HTTP", link: "/docs/guides/http/" },
            { label: "Files", link: "/docs/guides/files/" },
            { label: "Window and system UI", link: "/docs/guides/window-and-system-ui/" },
          ],
        },
        {
          label: "Graphics and integration",
          items: [
            { label: "Canvas, paint, path, and vector", link: "/docs/guides/graphics/" },
            { label: "PlatformView", link: "/docs/guides/platform-view/" },
            { label: "PlatformModule", link: "/docs/guides/platform-module/" },
            { label: "ExternalTexture", link: "/docs/guides/external-texture/" },
          ],
        },
        {
          label: "Extend HuxerUI",
          items: [
            { label: "Extension points", link: "/docs/guides/extensions/" },
          ],
        },
        {
          label: "Tooling and delivery",
          items: [
            { label: "CLI reference", link: "/docs/tooling/cli/" },
            { label: "CMake integration", link: "/docs/tooling/cmake/" },
            { label: "SDK structure", link: "/docs/tooling/sdk/" },
            { label: "Testing and delivery", link: "/docs/tooling/testing-and-delivery/" },
          ],
        },
        {
          label: "Platform guides",
          items: [{ autogenerate: { directory: "platforms" } }],
        },
        {
          label: "API reference",
          items: [{ autogenerate: { directory: "reference" } }],
        },
      ],
    }),
  ],
});
