import { describe, expect, it } from "vitest";
import type { Canvas } from "@/types/index";
import { updateTransform } from "./updateTransform";

describe("updateTransform", () => {
  it("merges partial transform and applies matrix to the transform layer", () => {
    const transformLayer = document.createElement("div");
    const canvas: Canvas = {
      container: document.createElement("div"),
      transformLayer,
      contentLayer: document.createElement("div"),
      transform: { scale: 1, translateX: 0, translateY: 0 },
    };

    const ok = updateTransform(canvas, { scale: 2, translateX: 10 });
    expect(ok).toBe(true);
    expect(canvas.transform).toEqual({ scale: 2, translateX: 10, translateY: 0 });
    expect(transformLayer.style.transform).toContain("matrix");
  });
});
