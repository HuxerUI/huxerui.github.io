export interface Example {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  source: string;
  featured?: boolean;
}

export const examples: Example[] = [
  {
    slug: "ui_gallery",
    title: "UI Gallery",
    eyebrow: "Responsive workspace",
    description: "Controls, layout, motion, themes, and responsive drawer composition in one compact application.",
    source: "examples/ui_gallery/main.cpp",
    featured: true,
  },
  {
    slug: "canvas",
    title: "Canvas",
    eyebrow: "Retained graphics",
    description: "Tabbed effects using paths, transforms, clipping, shadows, and retained animation.",
    source: "examples/canvas/main.cpp",
  },
  {
    slug: "tabs",
    title: "Tabs",
    eyebrow: "Controlled navigation",
    description: "Theme-driven tab policies, disabled destinations, and responsive viewport behavior.",
    source: "examples/tabs/main.cpp",
  },
  {
    slug: "navigation",
    title: "Navigation",
    eyebrow: "Pages and typed routes",
    description: "Factory stacks, typed paths, nested navigation, transitions, and browser URL history.",
    source: "examples/navigation/main.cpp",
  },
  {
    slug: "theme",
    title: "Themes",
    eyebrow: "Material and Flat",
    description: "Theme inheritance, component styles, nested overrides, text fields, and interaction states.",
    source: "examples/theme/main.cpp",
  },
  {
    slug: "image",
    title: "Images and resources",
    eyebrow: "Typed assets",
    description: "Density-aware raster images, compiled SVG vectors, localized strings, and raw resources.",
    source: "examples/image/main.cpp",
  },
  {
    slug: "presentation",
    title: "Presentation",
    eyebrow: "Window-level layers",
    description: "Toast, Dialog, BottomSheet, Popup, Menu, anchored surfaces, and declarative presentation.",
    source: "examples/presentation/main.cpp",
  },
];
