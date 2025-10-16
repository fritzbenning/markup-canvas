import type { CanvasBounds, Transform } from "./canvas.js";

export interface RulerOptions {
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  majorTickColor?: string;
  minorTickColor?: string;
  fontSize?: number;
  fontFamily?: string;
  showGrid?: boolean;
  gridColor?: string;
  units?: string;
}

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
