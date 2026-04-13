import type { EventEmitter } from "@/lib/events/createEventEmitter";
import type { Canvas, MarkupCanvasEvents } from "@/types/index";

/**
 * Emits `transform`, `zoom`, and `pan` on the canvas event bus from the current {@link Canvas.transform}.
 *
 * `zoom` receives `transform.scale`; `pan` receives `{ x: translateX, y: translateY }`. Used after transform updates so subscribers stay in sync.
 *
 * @param listen - Emitter bound to the canvas (e.g. `markupCanvas.event`).
 * @param canvas - Canvas whose `transform` is read.
 */
export function emitTransformEvents(listen: EventEmitter<MarkupCanvasEvents>, canvas: Canvas): void {
  const transform = canvas.transform;

  listen.emit("transform", transform);
  listen.emit("zoom", transform.scale);
  listen.emit("pan", { x: transform.translateX, y: transform.translateY });
}
