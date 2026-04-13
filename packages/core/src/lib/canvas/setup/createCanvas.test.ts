import { afterEach, describe, expect, it, vi } from "vitest";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import { CANVAS_CONTAINER_CLASS, CONTENT_LAYER_CLASS, TRANSFORM_LAYER_CLASS } from "@/lib/constants";
import { createCanvas } from "./createCanvas";

describe("createCanvas", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns null when the container cannot host children", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const bad = {} as HTMLElement;
    const config = createMarkupCanvasConfig();

    expect(createCanvas(bad, config)).toBeNull();
    expect(error).toHaveBeenCalled();
  });

  it("creates layers, applies initial transform, and wires the canvas object", () => {
    const container = document.createElement("div");
    container.style.width = "640px";
    container.style.height = "480px";
    const config = createMarkupCanvasConfig({
      width: 1024,
      height: 768,
      initialZoom: 1.5,
      initialPan: { x: 10, y: 20 },
      enableRulers: true,
      rulerSize: 16,
    });

    const canvas = createCanvas(container, config);
    expect(canvas).not.toBeNull();
    if (!canvas) {
      return;
    }

    expect(canvas.container).toBe(container);
    expect(canvas.transformLayer.classList.contains(TRANSFORM_LAYER_CLASS)).toBe(true);
    expect(canvas.contentLayer.classList.contains(CONTENT_LAYER_CLASS)).toBe(true);
    expect(container.classList.contains(CANVAS_CONTAINER_CLASS)).toBe(true);

    const rulerOffset = -16;
    expect(canvas.transform.scale).toBe(1.5);
    expect(canvas.transform.translateX).toBe(10 + rulerOffset);
    expect(canvas.transform.translateY).toBe(20 + rulerOffset);
    expect(canvas.transformLayer.style.transform).toContain("matrix");
  });
});
