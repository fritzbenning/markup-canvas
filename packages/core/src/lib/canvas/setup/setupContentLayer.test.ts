import { describe, expect, it } from "vitest";
import { setupContentLayer } from "./setupContentLayer";

describe("setupContentLayer", () => {
  it("sets layout and pointer styles on the content layer", () => {
    const el = document.createElement("div");
    setupContentLayer(el);
    expect(el.style.position).toBe("relative");
    expect(el.style.width).toBe("100%");
    expect(el.style.height).toBe("100%");
    expect(el.style.pointerEvents).toBe("auto");
  });
});
