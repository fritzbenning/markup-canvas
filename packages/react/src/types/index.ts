import type { MarkupCanvas as CoreMarkupCanvas, Transform, WindowAPI } from "@markup-canvas/core";

export interface MarkupCanvasRef {
  canvas: CoreMarkupCanvas | null;
  zoomIn: (factor?: number) => void;
  zoomOut: (factor?: number) => void;
  resetZoom: () => void;
  panToPoint: (x: number, y: number) => void;
  fitToContent: () => void;
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
  onReady?: (canvas: CoreMarkupCanvas) => void;
}

export interface CanvasEventHandlers {
  onZoom?: (zoom: number) => void;
  onPan?: (pan: { x: number; y: number }) => void;
  onTransform?: (transform: Transform) => void;
  onReady?: (canvas: CoreMarkupCanvas) => void;
}

export interface UseMarkupCanvasReturn {
  canvas: WindowAPI | null;
  transform: Transform;
  zoom: number;
  pan: { x: number; y: number };
  isReady: boolean;
  zoomIn: (factor?: number) => void;
  zoomOut: (factor?: number) => void;
  resetZoom: () => void;
  panLeft: (distance?: number) => void;
  panRight: (distance?: number) => void;
  panUp: (distance?: number) => void;
  panDown: (distance?: number) => void;
  panToPoint: (x: number, y: number) => void;
  fitToContent: () => void;
  centerContent: () => void;
  resetView: () => void;
  setTransitionMode: (enabled: boolean) => void;
  toggleTransitionMode: () => boolean;
  themeMode: "light" | "dark";
  updateThemeMode: (mode: "light" | "dark") => void;
  toggleThemeMode: () => "light" | "dark";
  toggleRulers: () => void;
  showRulers: () => void;
  hideRulers: () => void;
  areRulersVisible: () => boolean;
  showRulersState: boolean;
  toggleGrid: () => void;
  showGrid: () => void;
  hideGrid: () => void;
  isGridVisible: () => boolean;
  showGridState: boolean;
}
