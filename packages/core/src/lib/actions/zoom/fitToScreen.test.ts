import { afterEach, describe, expect, it, vi } from "vitest";
import * as updateTransformModule from "@/lib/transform/updateTransform";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import { ZOOM_FIT_PADDING } from "@/lib/constants";
import type { Canvas } from "@/types/index";
import { fitToScreen } from "./fitToScreen";

describe("fitToScreen", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function mockRect(container: HTMLElement, width: number, height: number) {
    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      width,
      height,
      top: 0,
      left: 0,
      right: width,
      bottom: height,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
  }

  it("computes fit scale and centers content for the current viewport", () => {
    const spy = vi.spyOn(updateTransformModule, "updateTransform").mockReturnValue(true);
    const container = document.createElement("div");
    mockRect(container, 800, 600);
    const config = createMarkupCanvasConfig({
      width: 1000,
      height: 500,
      enableRulers: false,
      rulerSize: 20,
    });
    const transformLayer = document.createElement("div");
    const canvas: Canvas = {
      container,
      transformLayer,
      contentLayer: document.createElement("div"),
      transform: { scale: 1, translateX: 0, translateY: 0 },
    };

    const ok = fitToScreen(canvas, transformLayer, config);
    expect(ok).toBe(true);

    const scaleX = 800 / 1000;
    const scaleY = 600 / 500;
    const fitScale = Math.min(scaleX, scaleY) * ZOOM_FIT_PADDING;
    const scaledWidth = 1000 * fitScale;
    const scaledHeight = 500 * fitScale;
    const centerX = (800 - scaledWidth) / 2;
    const centerY = (600 - scaledHeight) / 2;

    expect(spy).toHaveBeenCalledWith(canvas, {
      scale: fitScale,
      translateX: centerX,
      translateY: centerY,
    });
  });
});
