import { describe, expect, it } from "vitest";
import { createMatrix } from "./createMatrix";

describe("createMatrix", () => {
  it("builds a uniform scale matrix with translation", () => {
    const m = createMatrix(2, 10, 20);
    expect(m.m11).toBe(2);
    expect(m.m22).toBe(2);
    expect(m.m12).toBe(0);
    expect(m.m21).toBe(0);
    expect(m.m41).toBe(10);
    expect(m.m42).toBe(20);
  });

  it("transforms a point like scale then translate", () => {
    const m = createMatrix(3, 100, 0);
    const p = new DOMPoint(10, 5).matrixTransform(m);
    expect(p.x).toBeCloseTo(130);
    expect(p.y).toBeCloseTo(15);
  });
});
