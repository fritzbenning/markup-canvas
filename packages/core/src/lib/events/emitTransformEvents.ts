import type { EventEmitter } from "@/lib/events/EventEmitter.js";
import type { BaseCanvas, MarkupCanvasEvents } from "@/types/index.js";

export function emitTransformEvents(listen: EventEmitter<MarkupCanvasEvents>, baseCanvas: BaseCanvas): void {
  const transform = baseCanvas.transform;
  listen.emit("transform", transform);
  listen.emit("zoom", transform.scale);
  listen.emit("pan", { x: transform.translateX, y: transform.translateY });
}
