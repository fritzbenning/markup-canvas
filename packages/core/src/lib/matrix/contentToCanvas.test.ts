import { describe, expect, it, vi } from "vitest";
import { contentToCanvas } from "./contentToCanvas";
import { createMatrix } from "./createMatrix";

describe("contentToCanvas", () => {
  it("maps content coordinates through the transform matrix", () => {
    const matrix = createMatrix(2, 100, 50);
    const out = contentToCanvas(10, 20, matrix);
    expect(out.x).toBeCloseTo(120);
    expect(out.y).toBeCloseTo(90);
  });

  it("returns input when matrix lacks transformPoint", () => {
    const bad = {} as DOMMatrix;
    expect(contentToCanvas(3, 4, bad)).toEqual({ x: 3, y: 4 });
  });

  it("falls back to input on transform failure", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const matrix = createMatrix(1, 0, 0);
    vi.spyOn(DOMPoint.prototype, "matrixTransform").mockImplementation(() => {
      throw new Error("boom");
    });

    expect(contentToCanvas(5, 6, matrix)).toEqual({ x: 5, y: 6 });
    expect(warn).toHaveBeenCalled();

    warn.mockRestore();
  });
});
