import { beforeEach, describe, expect, it, vi } from "vitest";
import * as getCanvasBoundsModule from "@/lib/canvas/bounds/getCanvasBounds";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import type { Canvas, CanvasBounds } from "@/types/index";
import { centerContent } from "./centerContent";

vi.mock("@/lib/canvas/bounds/getCanvasBounds", () => ({
  getCanvasBounds: vi.fn(),
}));

describe("centerContent", () => {
  beforeEach(() => {
    vi.mocked(getCanvasBoundsModule.getCanvasBounds).mockReturnValue({
      width: 400,
      height: 300,
      contentWidth: 100,
      contentHeight: 100,
      scale: 1,
      translateX: 0,
      translateY: 0,
      visibleArea: { x: 0, y: 0, width: 100, height: 100 },
      scaledContentWidth: 100,
      scaledContentHeight: 100,
      canPanLeft: false,
      canPanRight: false,
      canPanUp: false,
      canPanDown: false,
      canZoomIn: true,
      canZoomOut: true,
    } satisfies CanvasBounds);
  });

  it("computes translation that centers scaled content in the viewport", () => {
    const config = createMarkupCanvasConfig({
      width: 100,
      height: 100,
      rulerSize: 20,
    });

    const canvas: Canvas = {
      container: document.createElement("div"),
      transformLayer: document.createElement("div"),
      contentLayer: document.createElement("div"),
      transform: { scale: 1, translateX: 0, translateY: 0 },
    };

    const update = vi.fn(() => true);
    const ok = centerContent(canvas, config, update, canvas.transformLayer);

    expect(ok).toBe(true);
    expect(update).toHaveBeenCalledTimes(1);
    const arg = update.mock.calls[0][0];
    expect(arg.translateX).toBeCloseTo(150, 5);
    expect(arg.translateY).toBeCloseTo(100, 5);
  });
});
