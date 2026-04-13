import { describe, expect, it } from "vitest";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import { setupTransformLayer } from "./setupTransformLayer";

describe("setupTransformLayer", () => {
  it("positions the layer using ruler inset and content pixel size", () => {
    const el = document.createElement("div");
    const config = createMarkupCanvasConfig({ width: 1200, height: 900, rulerSize: 24 });

    setupTransformLayer(el, config);

    expect(el.style.position).toBe("absolute");
    expect(el.style.top).toBe("24px");
    expect(el.style.left).toBe("24px");
    expect(el.style.width).toBe("1200px");
    expect(el.style.height).toBe("900px");
    expect(el.style.transformOrigin).toBe("0 0");
  });
});
