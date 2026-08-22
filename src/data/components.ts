export interface ComponentGroup {
  name: string;
  description: string;
  items: string[];
  href: string;
}

export const componentGroups: ComponentGroup[] = [
  {
    name: "Controls",
    description: "Controlled, theme-resolved interaction primitives with shared pointer, keyboard, focus, and semantics behavior.",
    items: [
      "Button",
      "IconButton",
      "Checkbox",
      "RadioButton",
      "Switch",
      "Chip",
      "SegmentedButton",
      "Slider",
    ],
    href: "/docs/components/",
  },
  {
    name: "Text and input",
    description: "Text measurement, editable values, validation, selection, IME integration, and submission actions.",
    items: ["Text", "SelectionArea", "TextField", "Validation", "Tooltip"],
    href: "/docs/components/text-field/",
  },
  {
    name: "Layout",
    description: "Constraint-based composition, scrolling, responsive structure, and large-data virtualization.",
    items: ["Row", "Column", "Flow", "Stack", "ScrollView", "VirtualList", "VirtualGrid", "DrawerLayout"],
    href: "/docs/layout/",
  },
  {
    name: "Navigation",
    description: "Destination controls, retained page stacks, typed routes, nested navigation, and browser history.",
    items: ["Tabs", "TopAppBar", "NavigationBar", "NavigationPane", "NavigationStack"],
    href: "/docs/guides/navigation-and-routing/",
  },
  {
    name: "Feedback and presentation",
    description: "Window-level feedback, modal surfaces, anchored content, progress, and layered presentation.",
    items: ["ProgressCircle", "ProgressBar", "Toast", "Dialog", "BottomSheet", "Popup", "Menu"],
    href: "/docs/guides/theme-and-styling/",
  },
  {
    name: "Graphics and media",
    description: "Typed image resources, vector assets, custom paths, retained drawing, and external texture streams.",
    items: ["Image", "Canvas", "Path", "VectorAsset", "ExternalTexture"],
    href: "/docs/guides/graphics/",
  },
];
