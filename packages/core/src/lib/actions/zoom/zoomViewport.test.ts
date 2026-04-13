import { describe, expect, it, vi } from "vitest";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { CanvasBounds, Transform } from "@/types/index";
import { resetViewToCenter } from "./resetViewToCenter";
import { setZoom } from "./setZoom";
import { zoomIn } from "./zoomIn";
import { zoomOut } from "./zoomOut";

function stubMarkupCanvas(transform: Transform, bounds: { width: number; height: number }): MarkupCanvas {
  return {
    transform,
    getBounds: () =>
      ({
        width: bounds.width,
        height: bounds.height,
      }) as CanvasBounds,
  } as MarkupCanvas;
}

describe("zoomViewport actions", () => {
  const config = createMarkupCanvasConfig({ minZoom: 0.1, maxZoom: 10 });
  const transformLayer = document.createElement("div");

  it("zoomIn calls zoomToPoint with clamped scale about viewport center", () => {
    const canvas = stubMarkupCanvas({ scale: 1, translateX: 0, translateY: 0 }, { width: 200, height: 100 });
    const zoomToPoint = vi.fn(() => true);
    zoomIn(canvas, transformLayer, config, zoomToPoint, 0.5);
    expect(zoomToPoint).toHaveBeenCalledWith(100, 50, expect.closeTo(1.5, 5));
  });

  it("zoomOut calls zoomToPoint with reduced scale", () => {
    const canvas = stubMarkupCanvas({ scale: 2, translateX: 0, translateY: 0 }, { width: 400, height: 200 });
    const zoomToPoint = vi.fn(() => true);
    zoomOut(canvas, transformLayer, config, zoomToPoint, 0.25);
    expect(zoomToPoint).toHaveBeenCalledWith(200, 100, expect.closeTo(1.5, 5));
  });

  it("setZoom passes absolute scale clamped to limits", () => {
    const canvas = stubMarkupCanvas({ scale: 1, translateX: 0, translateY: 0 }, { width: 100, height: 100 });
    const zoomToPoint = vi.fn(() => true);
    setZoom(canvas, transformLayer, config, zoomToPoint, 4);
    expect(zoomToPoint).toHaveBeenCalledWith(50, 50, 4);
  });

  it("resetViewToCenter targets scale 1 at viewport center", () => {
    const canvas = stubMarkupCanvas(
      { scale: 3, translateX: 10, translateY: 20 },
      { width: 200, height: 100 },
    );
    const zoomToPoint = vi.fn(() => true);
    resetViewToCenter(canvas, transformLayer, config, zoomToPoint);
    expect(zoomToPoint).toHaveBeenCalledWith(100, 50, 1);
  });
});
