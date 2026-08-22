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
        baseUrl: "https://github.com/HuxerUI/HuxerUI/edit/main/docs/",
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
        { label: "Overview", link: "/docs/" },
        { label: "Getting Started", link: "/docs/getting-started/" },
        { label: "Core Concepts", link: "/docs/core-concepts/" },
        {
          label: "Build interfaces",
          items: [
            { label: "Components and Input", link: "/docs/components-and-input/" },
            { label: "Layout and Scrolling", link: "/docs/layout-and-scrolling/" },
            { label: "Theme, Animation, and Presentation", link: "/docs/theme-animation-and-presentation/" },
            { label: "Accessibility", link: "/docs/design/semantics/" },
            { label: "Resources and Localization", link: "/docs/design/resources/" },
            { label: "Navigation", link: "/docs/design/navigation/" },
          ],
        },
        {
          label: "Application services",
          items: [
            { label: "Lifecycle and Activation", link: "/docs/design/application/" },
            { label: "Tasks", link: "/docs/design/tasks/" },
            { label: "HTTP", link: "/docs/design/http/" },
            { label: "Files", link: "/docs/files/" },
          ],
        },
        {
          label: "Platforms and integration",
          items: [
            { label: "Platform Guides", link: "/docs/platform-support/" },
            { label: "Native Integration", link: "/docs/extending-huxerui/" },
            { label: "Web", link: "/docs/design/web/" },
            { label: "Window Insets", link: "/docs/design/window-insets/" },
            { label: "Window Chrome", link: "/docs/design/window-chrome/" },
          ],
        },
        {
          label: "Reference",
          items: [
            { label: "Public API", link: "/docs/reference/" },
            { label: "SDK and CLI", link: "/docs/design/sdk-cli/" },
            { label: "Roadmap", link: "/docs/roadmap/" },
          ],
        },
        {
          label: "Architecture and Design",
          collapsed: true,
          items: [{ autogenerate: { directory: "docs/design" } }],
        },
      ],
    }),
  ],
});
