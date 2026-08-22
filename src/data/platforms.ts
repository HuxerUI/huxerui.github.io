export interface Platform {
  name: string;
  status: "Supported" | "Planned";
  stack: string;
  detail: string;
  code: string;
}

export const platforms: Platform[] = [
  {
    name: "Windows",
    status: "Supported",
    stack: "Win32 · D3D11 · Direct2D · DirectWrite",
    detail: "Native window, rendering, text, IME, accessibility, files, HTTP, PlatformView, and ExternalTexture integration.",
    code: "WIN",
  },
  {
    name: "macOS",
    status: "Supported",
    stack: "AppKit · CoreGraphics · CoreText",
    detail: "AppKit lifecycle, native text input, accessibility, platform services, and application-defined chrome.",
    code: "MAC",
  },
  {
    name: "Linux",
    status: "Supported",
    stack: "X11 · Cairo · EGL/GLES · HarfBuzz",
    detail: "Retained Cairo rendering with damage, XIM composition, platform modules, files, and libsoup HTTP.",
    code: "LNX",
  },
  {
    name: "Web",
    status: "Supported",
    stack: "Emscripten · WebAssembly · Canvas 2D",
    detail: "ES module sessions, browser input and IME, URL routing, resources, storage, and DOM PlatformViews.",
    code: "WEB",
  },
  {
    name: "Android",
    status: "Supported",
    stack: "View · Canvas · StaticLayout · InputConnection",
    detail: "Native host View, Canvas renderer, IME, accessibility, resources, PlatformView, and system integration.",
    code: "AND",
  },
  {
    name: "iOS",
    status: "Supported",
    stack: "UIKit · CoreGraphics · CoreText · UITextInput",
    detail: "UIKit lifecycle, touch and text services, accessibility, files, PlatformView, and ExternalTexture integration.",
    code: "IOS",
  },
  {
    name: "OHOS",
    status: "Planned",
    stack: "Platform adapter planned",
    detail: "The shared Runtime is designed for another adapter, but HuxerUI does not claim an implemented OHOS backend yet.",
    code: "OHO",
  },
];
