import { afterEach, describe, expect, it, vi } from "vitest";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import * as updateTransformModule from "@/lib/transform/updateTransform";
import type { Canvas } from "@/types/index";
import { resetView } from "./resetView";

describe("resetView", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("applies scale 1 and zero translation when rulers are not present", () => {
    const spy = vi.spyOn(updateTransformModule, "updateTransform").mockReturnValue(true);
    const config = createMarkupCanvasConfig({ rulerSize: 20 });
    const container = document.createElement("div");
    const canvas: Canvas = {
      container,
      transformLayer: document.createElement("div"),
      contentLayer: document.createElement("div"),
      transform: { scale: 2, translateX: 99, translateY: 99 },
    };

    const ok = resetView(canvas, canvas.transformLayer, config);
    expect(ok).toBe(true);
    const applied = spy.mock.calls[0][1];
    expect(applied.scale).toBe(1);
    expect(applied.translateX === 0).toBe(true);
    expect(applied.translateY === 0).toBe(true);
  });
});
