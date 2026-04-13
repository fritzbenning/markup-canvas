import type { MarkupCanvasConfig } from "@markup-canvas/core";

export const CANVAS_NAME = "canvas-1";

/** Shared options for both the `<MarkupCanvas />` and `useMarkupCanvas` examples. */
export const MARKUP_CONFIG = {
  width: 20000,
  height: 15000,
  name: CANVAS_NAME,
  enablePostMessageAPI: true,
  requireSpaceForMouseDrag: true,
  requireOptionForClickZoom: false,
  enableClickToZoom: true,
  enableTransition: false,
  enableRulers: true,
  enableGrid: true,
} satisfies MarkupCanvasConfig;
