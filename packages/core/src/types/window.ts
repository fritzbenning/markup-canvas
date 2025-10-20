import type { EventEmitter } from "@/lib/events/EventEmitter.js";
import type { CanvasBounds, Transform } from "./canvas.js";
import type { MarkupCanvasConfig } from "./config.js";
import type { MarkupCanvasEvents } from "./events.js";

export interface WindowAPI {
  config: {
    readonly current: MarkupCanvasConfig;
    readonly get: () => MarkupCanvasConfig;
    readonly update: (config: Partial<MarkupCanvasConfig>) => void;
  };
  transform: {
    readonly update: (transform: Transform) => void;
    readonly reset: () => void;
  };
  zoom: {
    readonly set: (zoomLevel: number) => void;
    readonly toPoint: (x: number, y: number, zoomLevel: number) => void;
    readonly in: (factor?: number) => void;
    readonly out: (factor?: number) => void;
    readonly reset: () => void;
    readonly resetToCenter: () => void;
    readonly fitToScreen: () => void;
  };
  pan: {
    readonly left: (distance?: number) => void;
    readonly right: (distance?: number) => void;
    readonly up: (distance?: number) => void;
    readonly down: (distance?: number) => void;
    readonly toPoint: (x: number, y: number) => void;
    readonly toCenter: () => void;
  };
  mouseDrag: {
    readonly enable: () => void;
    readonly disable: () => void;
    isEnabled: () => boolean;
  };
  grid: {
    readonly toggle: () => void;
    readonly show: () => void;
    readonly hide: () => void;
    readonly isVisible: () => boolean;
  };
  rulers: {
    readonly toggle: () => void;
    readonly show: () => void;
    readonly hide: () => void;
    readonly isVisible: () => boolean;
  };
  canvas: {
    readonly canvasToContent: (x: number, y: number) => { x: number; y: number };
    readonly getVisibleArea: () => { x: number; y: number; width: number; height: number };
    readonly isPointVisible: (x: number, y: number) => boolean;
    readonly getBounds: () => CanvasBounds;
  };
  theme: {
    readonly current: "light" | "dark";
    readonly update: (mode: "light" | "dark") => void;
    readonly toggle: () => "light" | "dark";
  };
  event: EventEmitter<MarkupCanvasEvents>;
  lifecycle: {
    readonly cleanup: () => void;
    readonly destroy: () => void;
  };
  state: {
    readonly isReady: boolean;
    readonly isTransforming: boolean;
    readonly visibleBounds: Record<string, unknown>;
    readonly transform: Transform;
  };
}
