import { beforeEach, describe, expect, it, vi } from "vitest";
import * as getCanvasBoundsModule from "@/lib/canvas/bounds/getCanvasBounds";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import type { Canvas, CanvasBounds } from "@/types/index";
import { panToPoint } from "./panToPoint";

vi.mock("@/lib/canvas/bounds/getCanvasBounds", () => ({
  getCanvasBounds: vi.fn(),
}));

describe("panToPoint", () => {
  beforeEach(() => {
    vi.mocked(getCanvasBoundsModule.getCanvasBounds).mockReturnValue({
      width: 400,
      height: 300,
      contentWidth: 200,
      contentHeight: 200,
      scale: 1,
      translateX: 0,
      translateY: 0,
      visibleArea: { x: 0, y: 0, width: 200, height: 200 },
      scaledContentWidth: 200,
      scaledContentHeight: 200,
      canPanLeft: false,
      canPanRight: false,
      canPanUp: false,
      canPanDown: false,
      canZoomIn: true,
      canZoomOut: true,
    } satisfies CanvasBounds);
  });

  it("centers the given content point at the viewport center for scale 1", () => {
    const config = createMarkupCanvasConfig({
      width: 200,
      height: 200,
      rulerSize: 20,
    });

    const canvas: Canvas = {
      container: document.createElement("div"),
      transformLayer: document.createElement("div"),
      contentLayer: document.createElement("div"),
      transform: { scale: 1, translateX: 0, translateY: 0 },
    };

    const update = vi.fn(() => true);
    const ok = panToPoint(canvas, config, 50, 60, update, canvas.transformLayer);

    expect(ok).toBe(true);
    expect(update).toHaveBeenCalledWith({
      translateX: 150,
      translateY: 90,
    });
  });

  it("scales the offset when scale is not 1", () => {
    const config = createMarkupCanvasConfig({ width: 200, height: 200, rulerSize: 20 });

    const canvas: Canvas = {
      container: document.createElement("div"),
      transformLayer: document.createElement("div"),
      contentLayer: document.createElement("div"),
      transform: { scale: 2, translateX: 0, translateY: 0 },
    };

    const update = vi.fn(() => true);
    panToPoint(canvas, config, 10, 10, update, canvas.transformLayer);

    expect(update).toHaveBeenCalledWith({
      translateX: 180,
      translateY: 130,
    });
  });
});
