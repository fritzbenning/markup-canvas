import { afterEach, describe, expect, it, vi } from "vitest";
import * as updateTransformModule from "@/lib/transform/updateTransform";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import type { Canvas } from "@/types/index";
import { resetToIdentityTransform, resetTransform } from "./resetTransform";

describe("resetToIdentityTransform", () => {
  it("sets identity scale and zero translation", () => {
    const canvas: Canvas = {
      container: document.createElement("div"),
      transformLayer: document.createElement("div"),
      contentLayer: document.createElement("div"),
      transform: { scale: 3, translateX: 9, translateY: 7 },
    };

    const ok = resetToIdentityTransform(canvas);
    expect(ok).toBe(true);
    expect(canvas.transform).toEqual({ scale: 1, translateX: 0, translateY: 0 });
  });
});

describe("resetTransform", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("applies initial zoom and pan with ruler offset when no ruler elements exist", () => {
    const spy = vi.spyOn(updateTransformModule, "updateTransform").mockReturnValue(true);
    const config = createMarkupCanvasConfig({
      initialZoom: 1.25,
      initialPan: { x: 4, y: 6 },
      rulerSize: 16,
    });
    const container = document.createElement("div");
    const canvas: Canvas = {
      container,
      transformLayer: document.createElement("div"),
      contentLayer: document.createElement("div"),
      transform: { scale: 1, translateX: 0, translateY: 0 },
    };

    const ok = resetTransform(canvas, canvas.transformLayer, config);
    expect(ok).toBe(true);
    expect(spy).toHaveBeenCalledWith(canvas, {
      scale: 1.25,
      translateX: 4,
      translateY: 6,
    });
  });
});
