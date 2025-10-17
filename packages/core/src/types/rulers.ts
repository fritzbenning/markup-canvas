import type { CanvasBounds, Transform } from "./canvas.js";

export interface RulerSystem {
  horizontalRuler: HTMLElement;
  verticalRuler: HTMLElement;
  cornerBox: HTMLElement;
  gridOverlay?: HTMLElement;
  update: () => void;
  show: () => void;
  hide: () => void;
  toggleGrid: () => void;
  destroy: () => void;
}

// Canvas interface for rulers (simplified version)
export interface RulerCanvas {
  container: HTMLElement;
  transformLayer?: HTMLElement;
  transform: Transform;
  updateTransform: (newTransform: Partial<Transform>) => boolean;
  getBounds: () => CanvasBounds;
}
export interface RulerElements {
  horizontalRuler: HTMLElement;
  verticalRuler: HTMLElement;
  cornerBox: HTMLElement;
  gridOverlay?: HTMLElement;
}
