import type { MarkupCanvasConfig } from "./config";

export interface Transform {
  scale: number;
  translateX: number;
  translateY: number;
}

export interface CanvasOptions {
  width?: number;
  height?: number;
  enableAcceleration?: boolean;
  enableEventHandling?: boolean;
  onTransformUpdate?: (transform: Transform) => void;
}

export interface CanvasBounds {
  width: number;
  height: number;
  contentWidth: number;
  contentHeight: number;
  scale: number;
  translateX: number;
  translateY: number;
  visibleArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  scaledContentWidth: number;
  scaledContentHeight: number;
  canPanLeft: boolean;
  canPanRight: boolean;
  canPanUp: boolean;
  canPanDown: boolean;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

export interface BaseCanvas {
  container: HTMLElement;
  transformLayer: HTMLElement;
  contentLayer: HTMLElement;
  config: Required<MarkupCanvasConfig>;
  transform: Transform;
  getBounds: () => CanvasBounds;
  updateTransform: (newTransform: Partial<Transform>) => boolean;
  reset: () => boolean;
  handleResize: () => boolean;
  setZoom: (zoomLevel: number) => boolean;
  canvasToContent: (x: number, y: number) => { x: number; y: number };
  zoomToPoint: (x: number, y: number, targetScale: number) => boolean;
  resetView: () => boolean;
  fitToScreen: () => boolean;
}

// Legacy Canvas interface - kept for backwards compatibility with other parts of the codebase
export interface Canvas extends BaseCanvas {
  cleanup?: () => void;
  // Exposed control functions for custom keyboard implementation
  panLeft: (distance?: number) => boolean;
  panRight: (distance?: number) => boolean;
  panUp: (distance?: number) => boolean;
  panDown: (distance?: number) => boolean;
  zoomIn: (factor?: number) => boolean;
  zoomOut: (factor?: number) => boolean;
  resetZoom: (duration?: number) => boolean;
  resetViewToCenter: () => boolean;
  // Mouse drag control functions
  enableMouseDrag: () => boolean;
  disableMouseDrag: () => boolean;
  isMouseDragEnabled: () => boolean;
  // Grid control functions
  toggleGrid?: () => boolean;
  showGrid?: () => boolean;
  hideGrid?: () => boolean;
  isGridVisible?: () => boolean;
  // Ruler control functions
  toggleRulers?: () => boolean;
  showRulers?: () => boolean;
  hideRulers?: () => boolean;
  areRulersVisible?: () => boolean;
  // Additional utility functions
  centerContent: () => boolean;
  fitToScreen: () => boolean;
  getVisibleArea: () => { x: number; y: number; width: number; height: number };
  isPointVisible: (x: number, y: number) => boolean;
  scrollToPoint: (x: number, y: number, duration?: number) => boolean;
}
