import { describe, expect, it } from "vitest";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { CanvasBounds } from "@/types";
import { getVisibleArea } from "./getVisibleArea";

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

describe("getVisibleArea", () => {
  it("returns visibleArea from getBounds", () => {
    const visible = { x: 10, y: 20, width: 300, height: 400 };
    const canvas = {
      getBounds: () => boundsWithVisible(visible),
    } as unknown as MarkupCanvas;

    expect(getVisibleArea(canvas)).toEqual(visible);
  });
});
