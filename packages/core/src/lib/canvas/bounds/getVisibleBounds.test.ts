import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as matrix from "@/lib/matrix";
import { getVisibleBounds } from "./getVisibleBounds";

describe("getVisibleBounds", () => {
  beforeEach(() => {
    vi.spyOn(matrix, "canvasToContent").mockImplementation((canvasX, canvasY, m) => {
      const inv = m.inverse();
      return {
        x: inv.a * canvasX + inv.c * canvasY + inv.e,
        y: inv.b * canvasX + inv.d * canvasY + inv.f,
      };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("maps the full viewport to content space when scale is 1 and origin is aligned", () => {
    const area = getVisibleBounds(400, 300, 1000, 1000, { scale: 1, translateX: 0, translateY: 0 });
    expect(area).toEqual({ x: 0, y: 0, width: 400, height: 300 });
  });

  it("shrinks the visible width when zoomed in", () => {
    const area = getVisibleBounds(400, 300, 1000, 1000, { scale: 2, translateX: 0, translateY: 0 });
    expect(area.x).toBe(0);
    expect(area.y).toBe(0);
    expect(area.width).toBe(200);
    expect(area.height).toBe(150);
  });

  it("clamps visible region to content bounds when the viewport shows only part of the content", () => {
    const area = getVisibleBounds(400, 300, 100, 100, { scale: 1, translateX: -50, translateY: -50 });
    expect(area).toEqual({ x: 50, y: 50, width: 50, height: 50 });
  });
});
