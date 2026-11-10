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
    slug: "ui_gallery",
    title: "UI Gallery",
    eyebrow: "Responsive workspace",
    description: "Controlled inputs, TextField validation, layout, motion, themes, and responsive drawer composition.",
    source: "examples/ui_gallery/main.cpp",
    documentation: "/docs/components/",
    featured: true,
  },
  {
    slug: "transition",
    title: "Transition Studio",
    eyebrow: "Page and scene effects",
    description: "Explore built-in and custom transition effects, including sliced visuals and scene changes.",
    source: "examples/transition/main.cpp",
    documentation: "/docs/guides/animation/",
  },
  {
    slug: "shared_transition",
    title: "Shared transitions",
    eyebrow: "Visual continuity",
    description: "Follow shared covers and titles between pages, then animate a local card with a custom travel path.",
    source: "examples/shared_transition/main.cpp",
    documentation: "/docs/guides/animation/",
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
    slug: "visual_effects",
    title: "Visual effects",
    eyebrow: "Retained presentation",
    description: "Explore shared presentation effects with the platform-neutral graphics pipeline.",
    source: "examples/visual_effects/main.cpp",
    documentation: "/docs/guides/graphics/",
  },
  {
    slug: "streaming_text",
    title: "Streaming text",
    eyebrow: "Rich content and selection",
    description: "A conversation-style interface with incremental content and logical text selection across virtualized blocks.",
    source: "examples/streaming_text/main.cpp",
    documentation: "/docs/components/selection-area/",
  },
  {
    slug: "custom_editor",
    title: "Custom editor",
    eyebrow: "Interactive paragraph layout",
    description: "Edit and format rich text with keyboard and IME input, undo history, and selection geometry built from TextLayout.",
    source: "examples/custom_editor/main.cpp",
    documentation: "/docs/guides/extensions/#build-a-custom-text-editor",
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
    slug: "virtual_table",
    title: "Virtual table",
    eyebrow: "Two-axis virtualization",
    description: "Scroll a million logical cells in two dimensions, jump to the far corner, and change cell density while retaining your position.",
    source: "examples/virtual_table/main.cpp",
    documentation: "/docs/guides/extensions/#virtualize-two-axes",
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
    slug: "dock_layout",
    title: "Docking workspace",
    eyebrow: "Application-owned workspace",
    description: "Rearrange retained editor panels, resize split regions, and keep one controlled docking tree authoritative.",
    source: "examples/dock_layout/main.cpp",
    documentation: "/docs/components/dock-layout/",
  },
  {
    slug: "external_texture",
    title: "ExternalTexture",
    eyebrow: "Live frame publication",
    description: "The browser producer publishes live VideoFrame content into HuxerUI Image composition.",
    source: "examples/external_texture/main.cpp",
    documentation: "/docs/guides/external-texture/",
  },
];

const catalogSlugs = examples.map(({ slug }) => slug).sort();
const configuredSlugs = [...sourceConfig.webExamples].sort();
if (catalogSlugs.length !== configuredSlugs.length || catalogSlugs.some((slug, index) => slug !== configuredSlugs[index])) {
  throw new Error("The example catalog and huxerui-source.json must publish the same Web examples.");
}
