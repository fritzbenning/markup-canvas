import { describe, expect, it, vi } from "vitest";
import type { Canvas, MarkupCanvasEvents } from "@/types/index";
import { createEventEmitter } from "./createEventEmitter";
import { emitTransformEvents } from "./emitTransformEvents";

describe("emitTransformEvents", () => {
  it("emits transform, zoom scale, and pan from canvas.transform", () => {
    const emitter = createEventEmitter<MarkupCanvasEvents>();
    const onTransform = vi.fn();
    const onZoom = vi.fn();
    const onPan = vi.fn();
    emitter.on("transform", onTransform);
    emitter.on("zoom", onZoom);
    emitter.on("pan", onPan);

    const canvas: Canvas = {
      container: document.createElement("div"),
      transformLayer: document.createElement("div"),
      contentLayer: document.createElement("div"),
      transform: { scale: 2, translateX: 10, translateY: 20 },
    };

    emitTransformEvents(emitter, canvas);

    expect(onTransform).toHaveBeenCalledTimes(1);
    expect(onTransform).toHaveBeenCalledWith(canvas.transform);
    expect(onZoom).toHaveBeenCalledWith(2);
    expect(onPan).toHaveBeenCalledWith({ x: 10, y: 20 });
  });
});
