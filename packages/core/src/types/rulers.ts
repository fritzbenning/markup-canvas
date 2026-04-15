import type { CanvasBounds, Transform } from "./canvas";
import type { MarkupCanvasConfig } from "./config";

/**
 * Aggregate API for the ruler UI: horizontal and vertical scales, corner chrome,
 * optional grid overlay, and lifecycle/theming hooks used by {@link MarkupCanvas}.
 */
export interface RulerSystem {
  /** Top horizontal ruler element. */
  horizontalRuler: HTMLElement;
  /** Left vertical ruler element. */
  verticalRuler: HTMLElement;
  /** Square at the top-left intersection of the two rulers. */
  cornerBox: HTMLElement;
  /** Optional layer drawn above content for the alignment grid (when enabled). */
  gridOverlay?: HTMLElement;
  /** Recomputes tick positions and ruler content from the current transform and bounds. */
  update: () => void;
  /** Applies theme tokens from a resolved canvas config (light/dark ruler colors, etc.). */
  updateTheme: (config: Required<MarkupCanvasConfig>) => void;
  /** Shows ruler elements (visibility / display). */
  show: () => void;
  /** Hides ruler elements. */
  hide: () => void;
  /** Shows the grid overlay if present; returns whether the grid is visible after the call. */
  showGrid: () => boolean;
  /** Hides the grid overlay if present; returns whether the grid is visible after the call. */
  hideGrid: () => boolean;
  /** Whether the grid overlay is currently visible. */
  isGridVisible: () => boolean;
  /** Toggles grid visibility; returns the new visibility state. */
  toggleGrid: () => boolean;
  /** Detaches listeners and removes ruler-owned DOM where applicable. */
  destroy: () => void;
}

/**
 * Minimal event bus surface the ruler subsystem needs to subscribe to transform changes.
 * Kept narrow so rulers don't depend on the full {@link MarkupCanvasEvents} shape.
 */
export interface RulerTransformEmitter {
  on(event: "transform", handler: (data: Transform) => void): void;
  off(event: "transform", handler: (data: Transform) => void): void;
}

/**
 * Minimal canvas surface the ruler subsystem needs: container, optional transform layer,
 * current {@link Transform}, and accessors to update the view and read {@link CanvasBounds}.
 *
 * This is intentionally smaller than the full {@link Canvas} type so ruler code does not
 * depend on content layers or unrelated APIs.
 */
export interface RulerCanvas {
  /** Root element that hosts the canvas (and typically the rulers). */
  container: HTMLElement;
  /** Layer that receives CSS transforms; used for layout relative to the view. */
  transformLayer?: HTMLElement;
  /** Current pan/zoom state shared with the main canvas. */
  transform: Transform;
  /** Applies a partial transform update; returns whether the update was applied. */
  updateTransform: (newTransform: Partial<Transform>) => boolean;
  /** Latest measured bounds (viewport, content, pan/zoom limits). */
  getBounds: () => CanvasBounds;
  /**
   * Optional event emitter for transform notifications. When present, rulers subscribe
   * to the `"transform"` event instead of monkey-patching `updateTransform`.
   */
  event?: RulerTransformEmitter;
}

/**
 * DOM nodes that make up the ruler chrome (and optional grid), without behavior.
 * Used where only structure is required, e.g. setup or tests.
 */
export interface RulerElements {
  horizontalRuler: HTMLElement;
  verticalRuler: HTMLElement;
  cornerBox: HTMLElement;
  gridOverlay?: HTMLElement;
}
