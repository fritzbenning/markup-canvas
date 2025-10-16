import type { MarkupCanvas } from "@/lib/MarkupCanvas.js";
import type { Transform } from "@/types/canvas.js";

export interface MarkupCanvasEvents {
  transform: Transform;
  zoom: number;
  pan: { x: number; y: number };
  ready: MarkupCanvas;
  [key: string]: unknown;
}

export interface TouchState {
  touches: Touch[];
  lastDistance: number;
  lastCenter: { x: number; y: number };
}

export interface GestureInfo {
  isTrackpad: boolean;
  isMouseWheel: boolean;
  isTrackpadScroll: boolean;
  isTrackpadPinch: boolean;
  isZoomGesture: boolean;
}

export interface MouseDragControls {
  cleanup: () => void;
  enable: () => boolean;
  disable: () => boolean;
  isEnabled: () => boolean;
}
