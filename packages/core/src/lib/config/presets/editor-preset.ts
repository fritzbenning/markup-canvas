import type { MarkupCanvasConfig } from "@/types";

export const EDITOR_PRESET: MarkupCanvasConfig = {
  // Canvas dimensions
  width: 4000,
  height: 4000,
  enableAcceleration: true,

  // Global Instance Access
  name: "canvas",
  enablePostMessageAPI: true,

  // Interaction controls
  enableZoom: true,
  enablePan: true,
  enableTouch: true,
  enableKeyboard: true,
  bindKeyboardEventsTo: "document",

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
  enableGrid: true,
  showRulers: true,
  showGrid: false,

  rulerFontSize: 9,
  rulerFontFamily: "Monaco, Menlo, monospace",
  rulerUnits: "px",
  rulerSize: 20,

  // Canvas styling
  canvasBackgroundColor: "transparent",
  canvasBackgroundColorDark: "transparent",

  // Ruler styling
  rulerBackgroundColor: "oklch(100% 0 0 / 0.96)",
  rulerBorderColor: "oklch(0.967 0.001 286.375)",
  rulerTextColor: "oklch(70.5% 0.015 286.067)",
  rulerTickColor: "oklch(92% 0.004 286.32)",
  gridColor: "rgba(232, 86, 193, 0.5)",

  // Ruler styling (dark theme)
  rulerBackgroundColorDark: "oklch(27.4% 0.006 286.033)",
  rulerBorderColorDark: "oklch(0.322 0.0095 285.919)",
  rulerTextColorDark: "oklch(55.2% 0.016 285.938)",
  rulerTickColorDark: "oklch(55.2% 0.016 285.938)",
  gridColorDark: "rgba(232, 86, 193, 0.5)",

  // Theme
  themeMode: "light",
};
