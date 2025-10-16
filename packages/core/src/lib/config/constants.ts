import type { MarkupCanvasConfig } from "@/types";

export const DEFAULT_CONFIG: Required<MarkupCanvasConfig> = {
  // Canvas dimensions
  width: 8000,
  height: 8000,
  enableAcceleration: true,

  // Interaction controls
  enableZoom: true,
  enablePan: true,
  enableTouch: true,
  enableKeyboard: true,
  limitKeyboardEventsToCanvas: false,

  // Zoom behavior
  zoomSpeed: 1.5,
  minZoom: 0.05,
  maxZoom: 80,
  enableTransition: true,
  transitionDuration: 0.2,
  enableAdaptiveSpeed: true,

  // Pan behavior
  enableLeftDrag: true,
  enableMiddleDrag: true,
  requireSpaceForMouseDrag: false,

  // Keyboard behavior
  keyboardPanStep: 50,
  keyboardFastMultiplier: 20,
  keyboardZoomStep: 0.2,

  // Click-to-zoom
  enableClickToZoom: true,
  clickZoomLevel: 1.0,
  requireOptionForClickZoom: false,

  // Visual elements
  enableRulers: true,
  enableGrid: true,
  gridColor: "rgba(0, 123, 255, 0.1)",

  // Ruler styling
  rulerBackgroundColor: "rgba(255, 255, 255, 0.95)",
  rulerBorderColor: "#ddd",
  rulerTextColor: "#666",
  rulerMajorTickColor: "#999",
  rulerMinorTickColor: "#ccc",
  rulerFontSize: 10,
  rulerFontFamily: "Monaco, Menlo, monospace",
  rulerUnits: "px",

  // Callbacks
  onTransformUpdate: () => {},
};
