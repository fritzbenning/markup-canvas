import type { MarkupCanvas as CoreMarkupCanvas, Transform } from "@markup-canvas/core";

export interface MarkupCanvasRef {
  canvas: CoreMarkupCanvas | null;
  zoomIn: (factor?: number) => void;
  zoomOut: (factor?: number) => void;
  resetZoom: () => void;
  panTo: (x: number, y: number) => void;
  fitToContent: () => void;
  centerContent: () => void;
  getTransform: () => Transform;
  getZoom: () => number;
  updateThemeMode: (mode: "light" | "dark") => void;
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
