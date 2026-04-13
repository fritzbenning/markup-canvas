import { describe, expect, it, vi } from "vitest";
import {
  withRulerAdjustment,
  withRulerCheck,
  withRulerOffsetObject,
  withRulerOffsets,
  withRulerSize,
} from "./withRulerCheck";

function containerWithRuler(hasRuler: boolean): HTMLElement {
  const container = document.createElement("div");
  if (hasRuler) {
    const ruler = document.createElement("div");
    ruler.className = "canvas-ruler";
    container.appendChild(ruler);
  }
  return container;
}

describe("withRulerCheck", () => {
  it("passes hasRulers true when .canvas-ruler exists", () => {
    const container = containerWithRuler(true);
    const result = withRulerCheck({ container }, (hasRulers) => hasRulers);
    expect(result).toBe(true);
  });

  it("passes hasRulers false when no ruler element", () => {
    const container = containerWithRuler(false);
    const result = withRulerCheck({ container }, (hasRulers) => hasRulers);
    expect(result).toBe(false);
  });
});

describe("withRulerSize", () => {
  it("passes rulerSize when rulers are shown", () => {
    const container = containerWithRuler(true);
    expect(withRulerSize({ container }, 20, (s) => s)).toBe(20);
  });

  it("passes 0 when rulers are not shown", () => {
    const container = containerWithRuler(false);
    expect(withRulerSize({ container }, 20, (s) => s)).toBe(0);
  });
});

describe("withRulerAdjustment", () => {
  it("subtracts effective ruler size from value", () => {
    const withRuler = containerWithRuler(true);
    expect(withRulerAdjustment({ container: withRuler }, 10, 100)).toBe(90);

    const withoutRuler = containerWithRuler(false);
    expect(withRulerAdjustment({ container: withoutRuler }, 10, 100)).toBe(100);
  });

  it("invokes optional operation with adjusted value", () => {
    const container = containerWithRuler(true);
    const op = vi.fn();
    withRulerAdjustment({ container }, 5, 50, op);
    expect(op).toHaveBeenCalledWith(45);
  });
});

describe("withRulerOffsets", () => {
  it("subtracts effective ruler size from x and y", () => {
    const container = containerWithRuler(true);
    const out = withRulerOffsets({ container }, 8, 100, 200, (x, y) => ({ x, y }));
    expect(out).toEqual({ x: 92, y: 192 });

    const plain = containerWithRuler(false);
    expect(withRulerOffsets({ container: plain }, 8, 100, 200, (x, y) => ({ x, y }))).toEqual({
      x: 100,
      y: 200,
    });
  });
});

describe("withRulerOffsetObject", () => {
  it("returns adjusted coordinates via operation", () => {
    const container = containerWithRuler(true);
    const out = withRulerOffsetObject({ container }, 10, { x: 50, y: 60, label: "a" }, (p) => p);
    expect(out).toEqual({ x: 40, y: 50, label: "a" });
  });
});
