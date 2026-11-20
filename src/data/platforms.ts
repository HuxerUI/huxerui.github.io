export interface Platform {
  name: string;
  status: "Supported" | "Planned";
  stack: string;
  detail: string;
}

export const platforms: Platform[] = [
  {
    name: "Windows",
    status: "Supported",
    stack: "Win32 · D3D11 · Direct2D · DirectWrite",
    detail: "Native window, rendering, text, IME, accessibility, files, HTTP, PlatformView, and ExternalTexture integration.",
  },
  {
    name: "macOS",
    status: "Supported",
    stack: "AppKit · CoreGraphics · CoreText",
    detail: "AppKit lifecycle, native text input, accessibility, platform services, and application-defined chrome.",
  },
  {
    name: "Linux",
    status: "Supported",
    stack: "GTK 4 · Pango · Cairo/GSK",
    detail: "GTK window/input integration, Pango text, GSK texture composition, platform services, files, and libsoup HTTP.",
  },
  {
    name: "Web",
    status: "Supported",
    stack: "Emscripten · WebAssembly · Canvas 2D",
    detail: "ES module sessions, browser input and IME, URL routing, resources, storage, and DOM PlatformViews.",
  },
  {
    name: "Android",
    status: "Supported",
    stack: "View · Canvas · StaticLayout · InputConnection",
    detail: "Native host View, Canvas renderer, IME, accessibility, resources, PlatformView, and system integration.",
  },
  {
    name: "iOS",
    status: "Supported",
    stack: "UIKit · CoreGraphics · CoreText · UITextInput",
    detail: "UIKit lifecycle, touch and text services, accessibility, files, PlatformView, and ExternalTexture integration.",
  },
  {
    name: "OHOS",
    status: "Planned",
    stack: "",
    detail: "Planned backend.",
  },
];
