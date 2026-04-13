import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "@/lib/config/constants";
import { DEFAULT_ZOOM, ZOOM_CHANGE_THRESHOLD } from "@/lib/constants";
import { getZoomToMouseTransform } from "./getZoomToMouseTransform";

describe("getZoomToMouseTransform", () => {
  const config = DEFAULT_CONFIG;

  it("zooms toward the cursor so the content point under the mouse stays fixed", () => {
    const next = getZoomToMouseTransform(200, 150, { scale: 1, translateX: 0, translateY: 0 }, 2, config);
    expect(next.scale).toBe(2);
    expect(next.translateX).toBeCloseTo(-200);
    expect(next.translateY).toBeCloseTo(-150);
  });

  it("uses default zoom and ruler offset when currentTransform is undefined and rulers are enabled", () => {
    const rulerSize = config.rulerSize;
    const next = getZoomToMouseTransform(0, 0, undefined, 1, config);
    expect(next.scale).toBe(DEFAULT_ZOOM);
    expect(next.translateX).toBeCloseTo(-rulerSize);
    expect(next.translateY).toBeCloseTo(-rulerSize);
  });

  it("uses zero translation offset when rulers are disabled", () => {
    const cfg = { ...config, enableRulers: false };
    const next = getZoomToMouseTransform(0, 0, undefined, 1, cfg);
    expect(next.translateX).toBe(0);
    expect(next.translateY).toBe(0);
  });

  it("returns the same transform when zoom is clamped to the current scale", () => {
    const atMax = { scale: config.maxZoom, translateX: 0, translateY: 0 };
    const next = getZoomToMouseTransform(100, 100, atMax, 2, config);
    expect(next).toEqual(atMax);
  });

  it("returns early when new scale equals current within threshold", () => {
    const scale = 1 + ZOOM_CHANGE_THRESHOLD / 2;
    const current = { scale, translateX: 5, translateY: 7 };
    const next = getZoomToMouseTransform(0, 0, current, 1, config);
    expect(next).toEqual(current);
  });
});
