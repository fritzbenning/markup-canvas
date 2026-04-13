import { describe, expect, it } from "vitest";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { CanvasBounds } from "@/types";
import { isPointVisible } from "./isPointVisible";

function boundsWithVisible(visibleArea: CanvasBounds["visibleArea"]): CanvasBounds {
  return {
    width: 800,
    height: 600,
    contentWidth: 8000,
    contentHeight: 8000,
    scale: 1,
    translateX: 0,
    translateY: 0,
    visibleArea,
    scaledContentWidth: 8000,
    scaledContentHeight: 8000,
    canPanLeft: false,
    canPanRight: false,
    canPanUp: false,
    canPanDown: false,
    canZoomIn: true,
    canZoomOut: true,
  };
}

describe("isPointVisible", () => {
  it("returns true for points inside the visible rectangle (inclusive edges)", () => {
    const canvas = {
      getBounds: () => boundsWithVisible({ x: 0, y: 0, width: 100, height: 50 }),
    } as unknown as MarkupCanvas;

    expect(isPointVisible(canvas, 0, 0)).toBe(true);
    expect(isPointVisible(canvas, 100, 50)).toBe(true);
    expect(isPointVisible(canvas, 50, 25)).toBe(true);
  });

  it("returns false for points outside the visible rectangle", () => {
    const canvas = {
      getBounds: () => boundsWithVisible({ x: 10, y: 10, width: 20, height: 20 }),
    } as unknown as MarkupCanvas;

    expect(isPointVisible(canvas, 9, 15)).toBe(false);
    expect(isPointVisible(canvas, 31, 15)).toBe(false);
    expect(isPointVisible(canvas, 15, 9)).toBe(false);
    expect(isPointVisible(canvas, 15, 31)).toBe(false);
  });
});
