import { describe, expect, it, vi } from "vitest";
import { DEFAULT_CONFIG } from "@/lib/config/constants";
import type { Canvas, Transform } from "@/types/index";
import { pan } from "./pan";

function makeCanvas(transform: Transform): Canvas {
  return {
    container: document.createElement("div"),
    transformLayer: document.createElement("div"),
    contentLayer: document.createElement("div"),
    transform,
  };
}

describe("pan", () => {
  const config = { ...DEFAULT_CONFIG, keyboardPanStep: 40 };

  it("left increases translateX by keyboardPanStep", () => {
    const canvas = makeCanvas({ scale: 1, translateX: 5, translateY: 0 });
    const update = vi.fn(() => true);
    pan("left", canvas, config, update);
    expect(update).toHaveBeenCalledWith({ translateX: 45 });
  });

  it("right decreases translateX by keyboardPanStep", () => {
    const canvas = makeCanvas({ scale: 1, translateX: 100, translateY: 0 });
    const update = vi.fn(() => true);
    pan("right", canvas, config, update);
    expect(update).toHaveBeenCalledWith({ translateX: 60 });
  });

  it("up increases translateY by keyboardPanStep", () => {
    const canvas = makeCanvas({ scale: 1, translateX: 0, translateY: 10 });
    const update = vi.fn(() => true);
    pan("up", canvas, config, update);
    expect(update).toHaveBeenCalledWith({ translateY: 50 });
  });

  it("down decreases translateY by keyboardPanStep", () => {
    const canvas = makeCanvas({ scale: 1, translateX: 0, translateY: 100 });
    const update = vi.fn(() => true);
    pan("down", canvas, config, update);
    expect(update).toHaveBeenCalledWith({ translateY: 60 });
  });

  it("propagates the boolean from updateTransform", () => {
    const canvas = makeCanvas({ scale: 1, translateX: 0, translateY: 0 });
    const update = vi.fn(() => false);
    expect(pan("up", canvas, config, update)).toBe(false);
  });
});
