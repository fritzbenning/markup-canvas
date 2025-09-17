import type { CanvasBounds, Transform } from "./canvas.js";

export interface WheelZoomOptions {
  zoomSpeed?: number;
  fineZoomSpeed?: number;
  smoothTransition?: boolean;
  enableAdaptiveSpeed?: boolean;
}

export interface MouseDragOptions {
  enableLeftDrag?: boolean;
  enableMiddleDrag?: boolean;
  requireSpaceForMouseDrag?: boolean;
  enableClickToZoom?: boolean;
  clickZoomLevel?: number;
  clickZoomDuration?: number;
  requireOptionForClickZoom?: boolean;
}

export interface KeyboardNavigationOptions {
  panStep?: number;
  fastPanMultiplier?: number;
  zoomStep?: number;
  enableAdaptiveSpeed?: boolean;
}

export interface TouchEventsOptions {
  enableSingleTouchPan?: boolean;
  enableMultiTouch?: boolean;
}

export interface GestureInfo {
  isTrackpad: boolean;
  isTrackpadScroll: boolean;
  isTrackpadPinch: boolean;
  isMouseWheel: boolean;
  isZoomGesture: boolean;
  confidence: number;
}

export interface TouchState {
  touches: Touch[];
  lastDistance: number;
  lastCenter: { x: number; y: number };
}

export interface DragState {
  isDragging: boolean;
  lastMouseX: number;
  lastMouseY: number;
  dragButton: number;
  isSpacePressed: boolean;
}

export interface ClickState {
  mouseDownTime: number;
  mouseDownX: number;
  mouseDownY: number;
  hasDragged: boolean;
}

// Canvas interface for events (simplified version)
export interface EventCanvas {
  container: HTMLElement;
  transformLayer: HTMLElement;
  transform: Transform;
  updateTransform: (newTransform: Partial<Transform>) => boolean;
  getBounds?: () => CanvasBounds;
  canvasToContent: (x: number, y: number) => { x: number; y: number };
  resetView?: (duration?: number) => boolean;
  toggleGrid?: () => boolean;
  toggleRulers?: () => boolean;
}
