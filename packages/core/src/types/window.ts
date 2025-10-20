import type { EventEmitter } from "@/lib/events/EventEmitter.js";
import type { CanvasBounds, Transform } from "./canvas.js";
import type { MarkupCanvasConfig } from "./config.js";
import type { MarkupCanvasEvents } from "./events.js";

export interface WindowAPI {
  transform: {
    update: (transform: Transform) => void;
    reset: () => void;
  };
  zoom: {
    set: (zoomLevel: number) => void;
    toPoint: (x: number, y: number, zoomLevel: number) => void;
    in: (factor?: number) => void;
    out: (factor?: number) => void;
    reset: () => void;
    resetView: () => void;
    resetViewToCenter: () => void;
  };
  pan: {
    left: (distance?: number) => void;
    right: (distance?: number) => void;
    up: (distance?: number) => void;
    down: (distance?: number) => void;
    toPoint: (x: number, y: number) => void;
    center: () => void;
    fitToScreen: () => void;
  };
  mouseDrag: {
    enable: () => void;
    disable: () => void;
    isEnabled: () => boolean;
  };
  grid: {
    toggle: () => void;
    show: () => void;
    hide: () => void;
    isVisible: () => boolean;
  };
  rulers: {
    toggle: () => void;
    show: () => void;
    hide: () => void;
    isVisible: () => boolean;
  };
  utils: {
    canvasToContent: (x: number, y: number) => { x: number; y: number };
    getVisibleArea: () => { x: number; y: number; width: number; height: number };
    isPointVisible: (x: number, y: number) => boolean;
    getBounds: () => CanvasBounds;
    getConfig: () => MarkupCanvasConfig;
    updateConfig: (config: Partial<MarkupCanvasConfig>) => void;
    updateThemeMode: (mode: "light" | "dark") => void;
  };
  event: EventEmitter<MarkupCanvasEvents>;
  lifecycle: {
    cleanup: () => void;
    destroy: () => void;
  };
  state: {
    readonly isReady: boolean;
    readonly isTransforming: boolean;
    readonly visibleBounds: Record<string, unknown>;
    readonly transform: Transform;
  };
  readonly config: MarkupCanvasConfig;
}
