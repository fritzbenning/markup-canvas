import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_CONFIG } from "@/lib/config/constants";
import { createMarkupCanvasConfig } from "./createMarkupCanvasConfig";

describe("createMarkupCanvasConfig", () => {
  it("returns config equal to DEFAULT_CONFIG when called with no arguments", () => {
    expect(createMarkupCanvasConfig()).toEqual(DEFAULT_CONFIG);
  });

  it("merges partial options onto defaults", () => {
    const out = createMarkupCanvasConfig({ name: "editor", width: 1920 });
    expect(out.name).toBe("editor");
    expect(out.width).toBe(1920);
    expect(out.height).toBe(DEFAULT_CONFIG.height);
  });

  describe("invalid numeric fields fall back to defaults", () => {
    let warn: ReturnType<typeof vi.spyOn<typeof console, "warn">>;

    beforeEach(() => {
      warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
      warn.mockRestore();
    });

    it.each([
      ["width", -1],
      ["width", 0],
      ["height", -10],
      ["zoomSpeed", 0],
      ["minZoom", 0],
      ["keyboardPanStep", -1],
      ["keyboardFastMultiplier", 0],
      ["clickZoomLevel", 0],
      ["rulerFontSize", -1],
      ["rulerSize", 0],
    ] as const)("resets invalid %s=%s", (key, bad) => {
      const out = createMarkupCanvasConfig({ [key]: bad } as Record<string, number>);
      expect(out[key]).toBe(DEFAULT_CONFIG[key]);
      expect(warn).toHaveBeenCalled();
    });

    it("resets width when not a number", () => {
      const out = createMarkupCanvasConfig({ width: "wide" as unknown as number });
      expect(out.width).toBe(DEFAULT_CONFIG.width);
      expect(warn).toHaveBeenCalled();
    });

    it("resets maxZoom when not a number", () => {
      const out = createMarkupCanvasConfig({ maxZoom: null as unknown as number });
      expect(out.maxZoom).toBe(DEFAULT_CONFIG.maxZoom);
      expect(warn).toHaveBeenCalled();
    });

    it("resets maxZoom when it is less than or equal to minZoom", () => {
      const out = createMarkupCanvasConfig({ minZoom: 0.5, maxZoom: 0.5 });
      expect(out.minZoom).toBe(0.5);
      expect(out.maxZoom).toBe(DEFAULT_CONFIG.maxZoom);
      expect(warn).toHaveBeenCalled();
    });
  });
});
