import { describe, expect, it } from "vitest";
import { withRulerOffset } from "./withRulerOffset";

function containerWithRuler(hasRuler: boolean): HTMLElement {
  const container = document.createElement("div");
  if (hasRuler) {
    const ruler = document.createElement("div");
    ruler.className = "canvas-ruler";
    container.appendChild(ruler);
  }
  return container;
}

describe("withRulerOffset", () => {
  it("subtracts rulerSize from both axes when a ruler is present", () => {
    const container = containerWithRuler(true);
    const out = withRulerOffset({ container }, 100, 200, 10, (x, y) => ({ x, y }));
    expect(out).toEqual({ x: 90, y: 190 });
  });

  it("leaves coordinates unchanged when no ruler", () => {
    const container = containerWithRuler(false);
    const out = withRulerOffset({ container }, 100, 200, 10, (x, y) => ({ x, y }));
    expect(out).toEqual({ x: 100, y: 200 });
  });
});
