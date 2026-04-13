import { describe, expect, it, vi } from "vitest";
import { canvasToContent } from "./canvasToContent";
import { contentToCanvas } from "./contentToCanvas";
import { createMatrix } from "./createMatrix";

describe("canvasToContent", () => {
  it("inverts contentToCanvas for a pan/zoom matrix", () => {
    const matrix = createMatrix(1.5, 40, -30);
    const canvas = contentToCanvas(12, 34, matrix);
    const back = canvasToContent(canvas.x, canvas.y, matrix);
    expect(back.x).toBeCloseTo(12);
    expect(back.y).toBeCloseTo(34);
  });

  it("returns input when matrix lacks inverse", () => {
    const bad = {} as DOMMatrix;
    expect(canvasToContent(8, 9, bad)).toEqual({ x: 8, y: 9 });
  });

  it("falls back to input on inverse/transform failure", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const matrix = createMatrix(1, 0, 0);
    const spy = vi.spyOn(DOMMatrix.prototype, "inverse").mockImplementation(() => {
      throw new Error("no inverse");
    });

    expect(canvasToContent(1, 2, matrix)).toEqual({ x: 1, y: 2 });
    expect(warn).toHaveBeenCalled();

    spy.mockRestore();
    warn.mockRestore();
  });
});
