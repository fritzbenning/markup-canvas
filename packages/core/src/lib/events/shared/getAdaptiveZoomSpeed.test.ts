import { describe, expect, it, vi } from "vitest";
import { ADAPTIVE_ZOOM_FACTOR, REFERENCE_DISPLAY_AREA } from "@/lib/events/constants";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import { getAdaptiveZoomSpeed } from "./getAdaptiveZoomSpeed";

function canvasWithBounds(getBounds: () => { width: number; height: number }): MarkupCanvas {
  return { getBounds } as unknown as MarkupCanvas;
}

describe("getAdaptiveZoomSpeed", () => {
  it("returns baseSpeed when getBounds is missing", () => {
    const canvas = {} as MarkupCanvas;
    expect(getAdaptiveZoomSpeed(canvas, 12)).toBe(12);
  });

  it("returns baseSpeed when canvas is nullish", () => {
    expect(getAdaptiveZoomSpeed(null as unknown as MarkupCanvas, 7)).toBe(7);
  });

  it("scales speed by display area relative to reference", () => {
    const baseSpeed = 100;
    const canvas = canvasWithBounds(() => ({ width: 960, height: 540 }));
    const displayArea = 960 * 540;
    const factor = (displayArea / REFERENCE_DISPLAY_AREA) ** ADAPTIVE_ZOOM_FACTOR;
    expect(getAdaptiveZoomSpeed(canvas, baseSpeed)).toBeCloseTo(baseSpeed * factor);
  });

  it("returns exactly baseSpeed when bounds match reference display area", () => {
    const baseSpeed = 42;
    const canvas = canvasWithBounds(() => ({
      width: 1920,
      height: 1080,
    }));
    expect(getAdaptiveZoomSpeed(canvas, baseSpeed)).toBe(baseSpeed);
  });

  it("returns baseSpeed and warns when getBounds throws", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const canvas = canvasWithBounds(() => {
      throw new Error("bounds unavailable");
    });
    expect(getAdaptiveZoomSpeed(canvas, 5)).toBe(5);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
