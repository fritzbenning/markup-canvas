import { afterEach, describe, expect, it, vi } from "vitest";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import type { Canvas } from "@/types/index";
import { getCanvasBounds } from "./getCanvasBounds";
import { getEmptyBounds } from "./getEmptyBounds";

describe("getCanvasBounds", () => {
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

  it("derives canvas size from the container rect and config content dimensions", () => {
    const container = document.createElement("div");
    mockRect(container, 800, 600);
    const config = createMarkupCanvasConfig({ width: 1000, height: 500, rulerSize: 20 });
    const canvas: Canvas = {
      container,
      transformLayer: document.createElement("div"),
      contentLayer: document.createElement("div"),
      transform: { scale: 1, translateX: 0, translateY: 0 },
    };

    const bounds = getCanvasBounds(canvas, config);

    expect(bounds.width).toBe(800);
    expect(bounds.height).toBe(600);
    expect(bounds.contentWidth).toBe(1000);
    expect(bounds.contentHeight).toBe(500);
    expect(bounds.scale).toBe(1);
    expect(bounds.scaledContentWidth).toBe(1000);
    expect(bounds.scaledContentHeight).toBe(500);
  });

  it("sets pan affordances from transform and sizes", () => {
    const container = document.createElement("div");
    mockRect(container, 400, 400);
    const config = createMarkupCanvasConfig({ width: 1000, height: 1000 });
    const canvas: Canvas = {
      container,
      transformLayer: document.createElement("div"),
      contentLayer: document.createElement("div"),
      transform: { scale: 1, translateX: -10, translateY: 0 },
    };

    const bounds = getCanvasBounds(canvas, config);

    expect(bounds.canPanLeft).toBe(true);
    expect(bounds.canPanRight).toBe(true);
    expect(bounds.canPanUp).toBe(false);
  });

  it("returns empty bounds when measurement throws", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const container = document.createElement("div");
    vi.spyOn(container, "getBoundingClientRect").mockImplementation(() => {
      throw new Error("layout error");
    });
    const config = createMarkupCanvasConfig();
    const canvas: Canvas = {
      container,
      transformLayer: document.createElement("div"),
      contentLayer: document.createElement("div"),
      transform: { scale: 1, translateX: 0, translateY: 0 },
    };

    const bounds = getCanvasBounds(canvas, config);

    expect(bounds).toEqual(getEmptyBounds());
    expect(error).toHaveBeenCalled();
  });
});
