import type { EventEmitter } from "@/lib/events/EventEmitter.js";
import type { Canvas, MarkupCanvasEvents } from "@/types/index.js";

export function emitTransformEvents(listen: EventEmitter<MarkupCanvasEvents>, canvas: Canvas): void {
  const transform = canvas.transform;
  listen.emit("transform", transform);
  listen.emit("zoom", transform.scale);
  listen.emit("pan", { x: transform.translateX, y: transform.translateY });
}
