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
  enableGrid: false,
  showRulers: true,
  showGrid: false,
  rulerFontSize: 9,
  rulerFontFamily: "Monaco, Menlo, monospace",
  rulerUnits: "px",
  rulerSize: 20,

  // Canvas styling
  canvasBackgroundColor: "rgba(250, 250, 250, 1)",
  canvasBackgroundColorDark: "rgba(40, 40, 40, 1)",

  // Ruler styling (light theme)
  rulerBackgroundColor: "rgba(255, 255, 255, 0.95)",
  rulerBorderColor: "rgba(240, 240, 240, 1)",
  rulerTextColor: "rgba(102, 102, 102, 1)",
  rulerTickColor: "rgba(204, 204, 204, 1)",
  gridColor: "rgba(232, 86, 193, 0.5)",

  // Ruler styling (dark theme)
  rulerBackgroundColorDark: "rgba(30, 30, 30, 0.95)",
  rulerBorderColorDark: "rgba(68, 68, 68, 1)",
  rulerTextColorDark: "rgba(170, 170, 170, 1)",
  rulerTickColorDark: "rgba(104, 104, 104, 1)",
  gridColorDark: "rgba(232, 86, 193, 0.5)",

  // Theme
  themeMode: "light",

  // Callbacks
  onTransformUpdate: () => {},
};
