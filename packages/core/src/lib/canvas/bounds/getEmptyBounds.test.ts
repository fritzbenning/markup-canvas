import { describe, expect, it } from "vitest";
import { getEmptyBounds } from "./getEmptyBounds";

describe("getEmptyBounds", () => {
  it("returns a zeroed bounds object with conservative interaction flags", () => {
    expect(getEmptyBounds()).toEqual({
      width: 0,
      height: 0,
      contentWidth: 0,
      contentHeight: 0,
      scale: 1,
      translateX: 0,
      translateY: 0,
      visibleArea: { x: 0, y: 0, width: 0, height: 0 },
      scaledContentWidth: 0,
      scaledContentHeight: 0,
      canPanLeft: false,
      canPanRight: false,
      canPanUp: false,
      canPanDown: false,
      canZoomIn: false,
      canZoomOut: false,
    });
  });
});
