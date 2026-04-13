import { describe, expect, it } from "vitest";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import type { Canvas } from "@/types/index";
import { zoomToPoint } from "./zoomToPoint";

describe("zoomToPoint", () => {
  it("updates transform toward targetScale around the pivot", () => {
    const config = createMarkupCanvasConfig({ minZoom: 0.1, maxZoom: 10, enableRulers: false });
    const canvas: Canvas = {
      container: document.createElement("div"),
      transformLayer: document.createElement("div"),
      contentLayer: document.createElement("div"),
      transform: { scale: 1, translateX: 0, translateY: 0 },
    };

    const ok = zoomToPoint(canvas, canvas.transformLayer, config, 100, 50, 2);
    expect(ok).toBe(true);
    expect(canvas.transform.scale).toBe(2);
    expect(canvas.transform.translateX).toBeCloseTo(-100, 5);
    expect(canvas.transform.translateY).toBeCloseTo(-50, 5);
    expect(canvas.transformLayer.style.transform).not.toBe("");
  });
});
