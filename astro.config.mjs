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
          items: [
            { label: "Component overview", link: "/docs/components/" },
            {
              label: "Content",
              collapsed: true,
              items: [
                { label: "Text", link: "/docs/components/text/" },
                { label: "Image", link: "/docs/components/image/" },
                { label: "Canvas", link: "/docs/components/canvas/" },
                { label: "ExternalTexture", link: "/docs/components/external-texture/" },
                { label: "Divider", link: "/docs/components/divider/" },
                { label: "Spacer", link: "/docs/components/spacer/" },
              ],
            },
            {
              label: "Input and selection",
              collapsed: true,
              items: [
                { label: "Button", link: "/docs/components/button/" },
                { label: "IconButton", link: "/docs/components/icon-button/" },
                { label: "Chip", link: "/docs/components/chip/" },
                { label: "Checkbox", link: "/docs/components/checkbox/" },
                { label: "RadioButton", link: "/docs/components/radio-button/" },
                { label: "Switch", link: "/docs/components/switch/" },
                { label: "Slider", link: "/docs/components/slider/" },
                { label: "SegmentedButton", link: "/docs/components/segmented-button/" },
                { label: "TextField", link: "/docs/components/text-field/" },
                { label: "SelectionArea", link: "/docs/components/selection-area/" },
              ],
            },
            {
              label: "Feedback and progress",
              collapsed: true,
              items: [
                { label: "ProgressBar", link: "/docs/components/progress-bar/" },
                { label: "ProgressCircle", link: "/docs/components/progress-circle/" },
                { label: "Tooltip", link: "/docs/components/tooltip/" },
              ],
            },
            {
              label: "Layout and scrolling",
              collapsed: true,
              items: [
                { label: "Column", link: "/docs/components/column/" },
                { label: "Row", link: "/docs/components/row/" },
                { label: "Flow", link: "/docs/components/flow/" },
                { label: "Stack", link: "/docs/components/stack/" },
                { label: "ScrollView", link: "/docs/components/scroll-view/" },
                { label: "VirtualList", link: "/docs/components/virtual-list/" },
                { label: "VirtualGrid", link: "/docs/components/virtual-grid/" },
                { label: "Scope", link: "/docs/components/scope/" },
              ],
            },
            {
              label: "Navigation",
              collapsed: true,
              items: [
                { label: "Tabs", link: "/docs/components/tabs/" },
                { label: "TopAppBar", link: "/docs/components/top-app-bar/" },
                { label: "NavigationBar", link: "/docs/components/navigation-bar/" },
                { label: "NavigationPane", link: "/docs/components/navigation-pane/" },
                { label: "NavigationStack", link: "/docs/components/navigation-stack/" },
                { label: "DrawerLayout", link: "/docs/components/drawer-layout/" },
                { label: "StartDrawer", link: "/docs/components/start-drawer/" },
                { label: "EndDrawer", link: "/docs/components/end-drawer/" },
              ],
            },
            {
              label: "Presentation",
              collapsed: true,
              items: [
                { label: "Toast", link: "/docs/components/toast/" },
                { label: "Dialog", link: "/docs/components/dialog/" },
                { label: "BottomSheet", link: "/docs/components/bottom-sheet/" },
                { label: "Menu", link: "/docs/components/menu/" },
                { label: "Popup", link: "/docs/components/popup/" },
              ],
            },
            {
              label: "Platform integration",
              collapsed: true,
              items: [
                { label: "PlatformView", link: "/docs/components/platform-view/" },
                { label: "WindowTitleBar", link: "/docs/components/window-title-bar/" },
              ],
            },
          ],
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
