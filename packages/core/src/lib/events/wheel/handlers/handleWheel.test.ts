import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import { createMouseTestCanvas } from "@/lib/events/mouse/test/createMouseTestCanvas";
import { detectTrackpadGesture } from "@/lib/events/trackpad/detectTrackpadGesture";
import { applyZoomToCanvas } from "@/lib/transform/applyZoomToCanvas";
import { handleWheel } from "./handleWheel";

vi.mock("@/lib/events/trackpad/detectTrackpadGesture", () => ({
  detectTrackpadGesture: vi.fn(),
}));

vi.mock("@/lib/transform/applyZoomToCanvas", () => ({
  applyZoomToCanvas: vi.fn(() => true),
}));

const baseGesture = {
  isTrackpad: false,
  isMouseWheel: true,
  isTrackpadScroll: false,
  isTrackpadPinch: false,
  isZoomGesture: true,
};

function wheel(props: { clientX: number; clientY: number; deltaY: number }): WheelEvent {
  return {
    ...props,
    preventDefault: vi.fn(),
  } as unknown as WheelEvent;
}

describe("handleWheel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(detectTrackpadGesture).mockReturnValue({ ...baseGesture });
  });

  it("warns and returns false when deltaY is not a number", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig({ enableAdaptiveSpeed: false });
    const result = handleWheel({} as WheelEvent, canvas, config);
    expect(result).toBe(false);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("warns and returns false when canvas has no updateTransform", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const canvas = createMouseTestCanvas();
    (canvas as unknown as { updateTransform: undefined }).updateTransform = undefined;
    const config = createMarkupCanvasConfig({ enableAdaptiveSpeed: false });
    const result = handleWheel(wheel({ clientX: 0, clientY: 0, deltaY: -1 }), canvas, config);
    expect(result).toBe(false);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("returns false for non-zoom gestures without calling applyZoomToCanvas", () => {
    vi.mocked(detectTrackpadGesture).mockReturnValue({
      ...baseGesture,
      isZoomGesture: false,
    });
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig({ enableAdaptiveSpeed: false, zoomSpeed: 0.1 });
    const event = wheel({ clientX: 50, clientY: 60, deltaY: -1 });
    const result = handleWheel(event, canvas, config);
    expect(result).toBe(false);
    expect(applyZoomToCanvas).not.toHaveBeenCalled();
  });

  it("applies zoom in toward pointer using config zoom speed", () => {
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig({ enableAdaptiveSpeed: false, zoomSpeed: 0.1 });
    const event = wheel({ clientX: 50, clientY: 40, deltaY: -1 });
    expect(handleWheel(event, canvas, config)).toBe(true);
    expect(applyZoomToCanvas).toHaveBeenCalledWith(canvas, 1.1, 50, 40);
  });

  it("applies zoom out using inverse multiplier when deltaY is positive", () => {
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig({ enableAdaptiveSpeed: false, zoomSpeed: 0.1 });
    const event = wheel({ clientX: 10, clientY: 10, deltaY: 3 });
    handleWheel(event, canvas, config);
    expect(applyZoomToCanvas).toHaveBeenCalledWith(canvas, 1 / 1.1, 10, 10);
  });

  it("uses pinch speed factor when isTrackpadPinch is true", () => {
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig({ enableAdaptiveSpeed: false, zoomSpeed: 0.1 });
    vi.mocked(detectTrackpadGesture).mockReturnValue({
      ...baseGesture,
      isTrackpadPinch: true,
    });
    handleWheel(wheel({ clientX: 0, clientY: 0, deltaY: -1 }), canvas, config);
    expect(applyZoomToCanvas).toHaveBeenCalledWith(canvas, 1.005, 0, 0);
  });

  it("logs and returns false when applyZoomToCanvas throws", () => {
    vi.mocked(applyZoomToCanvas).mockImplementation(() => {
      throw new Error("zoom failed");
    });
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig({ enableAdaptiveSpeed: false });
    const result = handleWheel(wheel({ clientX: 0, clientY: 0, deltaY: -1 }), canvas, config);
    expect(result).toBe(false);
    expect(err).toHaveBeenCalled();
    err.mockRestore();
  });
});
