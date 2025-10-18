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
  showRulers: true,
  showGrid: false,

  rulerFontSize: 9,
  rulerFontFamily: "Monaco, Menlo, monospace",
  rulerUnits: "px",
  rulerSize: 20,

  // Canvas styling
  canvasBackgroundColor: "oklch(98.5% 0 0)",
  canvasBackgroundColorDark: "oklch(21% 0.006 285.885)",

  // Ruler styling
  rulerBackgroundColor: "oklch(100% 0 0 / 0.4)",
  rulerBorderColor: "oklch(98.5% 0 0)",
  rulerTextColor: "oklch(70.5% 0.015 286.067)",
  rulerTickColor: "oklch(70.5% 0.015 286.067)",
  gridColor: "rgba(232, 86, 193, 0.5)",

  // Ruler styling (dark theme)
  rulerBackgroundColorDark: "oklch(27.4% 0.006 286.033)",
  rulerBorderColorDark: "oklch(37% 0.013 285.805)",
  rulerTextColorDark: "oklch(55.2% 0.016 285.938)",
  rulerTickColorDark: "oklch(55.2% 0.016 285.938)",
  gridColorDark: "rgba(232, 86, 193, 0.5)",

  // Theme
  themeMode: "light",

  // Callbacks
  onTransformUpdate: () => {},
};
