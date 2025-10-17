import type { MarkupCanvasConfig } from "@/types";

export const EDITOR_PRESET: Required<MarkupCanvasConfig> = {
  // Canvas dimensions
  width: 4000,
  height: 4000,
  enableAcceleration: true,

  // Interaction controls
  enableZoom: true,
  enablePan: true,
  enableTouch: true,
  enableKeyboard: false,
  limitKeyboardEventsToCanvas: false,

  // Zoom behavior
  zoomSpeed: 1.5,
  minZoom: 0.05,
  maxZoom: 80,
  enableTransition: false,
  transitionDuration: 0.2,
  enableAdaptiveSpeed: true,

  // Pan behavior
  enableLeftDrag: true,
  enableMiddleDrag: true,
  requireSpaceForMouseDrag: true,

  // Keyboard behavior
  keyboardPanStep: 50,
  keyboardFastMultiplier: 20,
  keyboardZoomStep: 0.2,

  // Click-to-zoom
  enableClickToZoom: true,
  clickZoomLevel: 1.0,
  requireOptionForClickZoom: true,

  // Visual elements
  enableRulers: true,
  enableGrid: false,
  gridColor: "rgba(0, 123, 255, 0.1)",

  // Ruler styling
  rulerBackgroundColor: "rgba(255, 255, 255, 0.4)",
  rulerBorderColor: "#ddd",
  rulerTextColor: "oklch(70.5% 0.015 286.067)",
  rulerMajorTickColor: "oklch(87.1% 0.006 286.286)",
  rulerMinorTickColor: "oklch(92% 0.004 286.32)",
  rulerFontSize: 9,
  rulerFontFamily: "Monaco, Menlo, monospace",
  rulerUnits: "px",
  rulerSize: 24,

  // Callbacks
  onTransformUpdate: () => {},
};
