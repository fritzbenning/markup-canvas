import type { MarkupCanvas, Transform } from "@markup-canvas/core";

export interface MarkupCanvasRef {
  canvas: MarkupCanvas | null;
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
  resetZoom: () => void;
  panToPoint: (x: number, y: number) => void;
  fitToScreen: () => void;
  centerContent: () => void;
  getTransform: () => Transform;
  getZoom: () => number;
  updateThemeMode: (mode: "light" | "dark") => void;
  toggleRulers: () => void;
  showRulers: () => void;
  hideRulers: () => void;
  areRulersVisible: () => boolean;
  toggleGrid: () => void;
  showGrid: () => void;
  hideGrid: () => void;
  isGridVisible: () => boolean;
}

export interface UseMarkupCanvasOptions {
  onTransformChange?: (transform: Transform) => void;
  onZoomChange?: (zoom: number) => void;
  onPanChange?: (pan: { x: number; y: number }) => void;
  onReady?: (canvas: MarkupCanvas) => void;
}

export interface CanvasEventHandlers {
  onZoom?: (zoom: number) => void;
  onPan?: (pan: { x: number; y: number }) => void;
  onTransform?: (transform: Transform) => void;
  onReady?: (canvas: MarkupCanvas) => void;
}

export interface UseMarkupCanvasReturn {
  /** Core canvas instance once the container has mounted and the canvas was created. */
  canvas: MarkupCanvas | null;
  transform: Transform;
  zoom: number;
  pan: { x: number; y: number };
  isReady: boolean;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  panLeft: (distance?: number) => void;
  panRight: (distance?: number) => void;
  panUp: (distance?: number) => void;
  panDown: (distance?: number) => void;
  panToPoint: (x: number, y: number) => void;
  fitToScreen: () => void;
  centerContent: () => void;
  reset: () => void;
  transitionEnabled: boolean;
  setTransitionMode: (enabled: boolean) => void;
  toggleTransitionMode: () => boolean;
  requireSpaceForMouseDrag: boolean;
  setRequireSpaceForMouseDrag: (enabled: boolean) => void;
  enableClickToZoom: boolean;
  setEnableClickToZoom: (enabled: boolean) => void;
  requireOptionForClickZoom: boolean;
  setRequireOptionForClickZoom: (enabled: boolean) => void;
  themeMode: "light" | "dark";
  updateThemeMode: (mode: "light" | "dark") => void;
  toggleThemeMode: () => "light" | "dark";
  toggleRulers: () => void;
  showRulers: () => void;
  hideRulers: () => void;
  areRulersVisible: () => boolean;
  rulersVisible: boolean;
  toggleGrid: () => void;
  showGrid: () => void;
  hideGrid: () => void;
  isGridVisible: () => boolean;
  gridVisible: boolean;
}
