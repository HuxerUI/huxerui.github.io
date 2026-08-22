import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("src/content/docs");

const components = [
  "bottom-sheet",
  "button",
  "canvas",
  "checkbox",
  "chip",
  "column",
  "dialog",
  "divider",
  "drawer-layout",
  "end-drawer",
  "external-texture",
  "flow",
  "icon-button",
  "image",
  "menu",
  "navigation-bar",
  "navigation-pane",
  "navigation-stack",
  "platform-view",
  "popup",
  "progress-bar",
  "progress-circle",
  "radio-button",
  "row",
  "scope",
  "scroll-view",
  "segmented-button",
  "selection-area",
  "slider",
  "spacer",
  "stack",
  "start-drawer",
  "switch",
  "tabs",
  "text",
  "text-field",
  "toast",
  "tooltip",
  "top-app-bar",
  "virtual-grid",
  "virtual-list",
  "window-title-bar",
];

const umbrellaHeaders = [
  "animation.h",
  "app.h",
  "clipboard.h",
  "color.h",
  "environment.h",
  "event.h",
  "external_texture.h",
  "file.h",
  "geometry.h",
  "http.h",
  "indication.h",
  "layout.h",
  "layer.h",
  "lifecycle.h",
  "modifier.h",
  "navigation.h",
  "paint.h",
  "platform_module.h",
  "platform_view.h",
  "presentation.h",
  "render_scene.h",
  "resource.h",
  "root.h",
  "scroll.h",
  "semantics.h",
  "state.h",
  "task.h",
  "text.h",
  "text_input.h",
  "theme.h",
  "validation.h",
  "vector.h",
  "view.h",
  "virtual_layout.h",
  "window.h",
];

const platformHeaders = [
  "android/external_texture.h",
  "android/jni.h",
  "android/platform_module.h",
  "android/platform_view.h",
  "ios/external_texture.h",
  "ios/platform_view.h",
  "linux/external_texture.h",
  "macos/external_texture.h",
  "macos/platform_view.h",
  "web/external_texture.h",
  "web/navigation.h",
  "web/platform_view.h",
  "windows/external_texture.h",
  "windows/platform_view.h",
];

const failures = [];
for (const component of components) {
  try {
    await access(path.join(root, "components", `${component}.mdx`));
  } catch {
    failures.push(`Missing component page: ${component}`);
  }
}

const referenceIndex = await readFile(path.join(root, "reference", "index.mdx"), "utf8");
for (const header of umbrellaHeaders) {
  if (!referenceIndex.includes(`\`${header}\``)) {
    failures.push(`Umbrella header is not mapped in the reference index: ${header}`);
  }
}

const platformReference = await readFile(path.join(root, "reference", "platform-specific.mdx"), "utf8");
for (const header of platformHeaders) {
  if (!platformReference.includes(`\`<huxerui/${header}>\``)) {
    failures.push(`Platform header is not mapped in the platform reference: ${header}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Verified ${components.length} component pages, ${umbrellaHeaders.length} umbrella headers, and ${platformHeaders.length} platform headers.`
  );
}
