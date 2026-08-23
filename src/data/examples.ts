import sourceConfig from "../../huxerui-source.json";

export interface Example {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  source: string;
  documentation: string;
  featured?: boolean;
}

export const examples: Example[] = [
  {
    slug: "counter",
    title: "Counter",
    eyebrow: "State and scope",
    description: "Two independently scoped counters demonstrate natural State reads, mutation operators, and local recomposition.",
    source: "examples/counter/main.cpp",
    documentation: "/docs/dsl/state-and-recomposition/",
    featured: true,
  },
  {
    slug: "ui_gallery",
    title: "UI Gallery",
    eyebrow: "Responsive workspace",
    description: "Controlled inputs, TextField validation, layout, motion, themes, and responsive drawer composition.",
    source: "examples/ui_gallery/main.cpp",
    documentation: "/docs/components/",
  },
  {
    slug: "dynamic_list",
    title: "Controlled collection",
    eyebrow: "Identity and events",
    description: "Insert, remove, and reorder application-owned data while stable keys preserve each item's local state.",
    source: "examples/dynamic_list/main.cpp",
    documentation: "/docs/dsl/composition-and-identity/",
  },
  {
    slug: "scroll_view",
    title: "ScrollView",
    eyebrow: "Scrolling",
    description: "Programmatic scrolling, live metrics, horizontal content, nested containers, and boundary handoff.",
    source: "examples/scroll_view/main.cpp",
    documentation: "/docs/components/scroll-view/",
  },
  {
    slug: "virtual_list",
    title: "VirtualList",
    eyebrow: "Large collections",
    description: "A variable-height list with 10,000 keyed items, retained item state, and direct scroll-to-item control.",
    source: "examples/virtual_list/main.cpp",
    documentation: "/docs/components/virtual-list/",
  },
  {
    slug: "virtual_grid",
    title: "VirtualGrid",
    eyebrow: "Adaptive virtualization",
    description: "An adaptive 10,000-item grid with spans, fixed row extents, and stateful visible cells.",
    source: "examples/virtual_grid/main.cpp",
    documentation: "/docs/components/virtual-grid/",
  },
  {
    slug: "task",
    title: "Structured tasks",
    eyebrow: "Async lifetime",
    description: "TaskScope, cancellation, lifecycle dependencies, delays, and UI-thread State updates in one component flow.",
    source: "examples/task/main.cpp",
    documentation: "/docs/guides/tasks/",
  },
  {
    slug: "http",
    title: "HTTP",
    eyebrow: "Platform service",
    description: "Launch an HTTPS request, separate transport failures from response status, and cancel work with component lifetime.",
    source: "examples/http/main.cpp",
    documentation: "/docs/guides/http/",
  },
  {
    slug: "files",
    title: "Files",
    eyebrow: "Storage and pickers",
    description: "Application directories, asynchronous local file operations, external file references, open, and save workflows.",
    source: "examples/files/main.cpp",
    documentation: "/docs/guides/files/",
  },
  {
    slug: "lifecycle",
    title: "Lifecycle effects",
    eyebrow: "Setup and cleanup",
    description: "Dependency-aware setup, deterministic cleanup, component unmount, and an observable lifecycle event log.",
    source: "examples/lifecycle/main.cpp",
    documentation: "/docs/guides/lifecycle-and-activation/",
  },
  {
    slug: "application",
    title: "Application lifecycle",
    eyebrow: "Activation and sessions",
    description: "Startup activation, later URL or file activation, foreground state, and asynchronous text-file preview policy.",
    source: "examples/application/main.cpp",
    documentation: "/docs/guides/lifecycle-and-activation/",
  },
  {
    slug: "canvas",
    title: "Canvas",
    eyebrow: "Retained graphics",
    description: "Tabbed effects using paths, transforms, clipping, shadows, and retained animation.",
    source: "examples/canvas/main.cpp",
    documentation: "/docs/guides/graphics/",
  },
  {
    slug: "tabs",
    title: "Tabs",
    eyebrow: "Controlled navigation",
    description: "Theme-driven tab policies, disabled destinations, and responsive viewport behavior.",
    source: "examples/tabs/main.cpp",
    documentation: "/docs/components/tabs/",
  },
  {
    slug: "navigation",
    title: "Navigation",
    eyebrow: "Pages and typed routes",
    description: "Factory stacks, typed paths, nested navigation, transitions, and browser URL history.",
    source: "examples/navigation/main.cpp",
    documentation: "/docs/guides/navigation-and-routing/",
  },
  {
    slug: "theme",
    title: "Themes",
    eyebrow: "Material and Flat",
    description: "Theme inheritance, component styles, nested overrides, text fields, and interaction states.",
    source: "examples/theme/main.cpp",
    documentation: "/docs/guides/theme-and-styling/",
  },
  {
    slug: "image",
    title: "Images and resources",
    eyebrow: "Typed assets",
    description: "Density-aware raster images, compiled SVG vectors, localized strings, and raw resources.",
    source: "examples/image/main.cpp",
    documentation: "/docs/guides/resources-and-localization/",
  },
  {
    slug: "presentation",
    title: "Presentation",
    eyebrow: "Window-level layers",
    description: "Toast, Dialog, BottomSheet, Popup, Menu, anchored surfaces, and declarative presentation.",
    source: "examples/presentation/main.cpp",
    documentation: "/docs/guides/presentation/",
  },
];

const catalogSlugs = examples.map(({ slug }) => slug).sort();
const configuredSlugs = [...sourceConfig.webExamples].sort();
if (catalogSlugs.length !== configuredSlugs.length || catalogSlugs.some((slug, index) => slug !== configuredSlugs[index])) {
  throw new Error("The example catalog and huxerui-source.json must publish the same Web examples.");
}
