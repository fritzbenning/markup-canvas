export interface Point {
  x: number;
  y: number;
}

export interface ZoomBoundaryResult {
  scale: number;
  clamped: boolean;
  hitBoundary: "min" | "max" | "invalid" | null;
  message: string | null;
}

export interface ZoomBoundaryOptions {
  minZoom?: number;
  maxZoom?: number;
  provideFeedback?: boolean;
  logBoundaryHits?: boolean;
  onBoundaryHit?: (boundary: string, originalScale: number, clampedScale: number) => void;
}
