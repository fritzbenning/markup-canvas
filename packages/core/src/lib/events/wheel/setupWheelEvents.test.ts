import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMouseTestCanvas } from "@/lib/events/mouse/test/createMouseTestCanvas";
import { detectTrackpadGesture } from "@/lib/events/trackpad/detectTrackpadGesture";
import { handleWheel } from "@/lib/events/wheel/handlers/handleWheel";
import { setupWheelEvents } from "./setupWheelEvents";

const { trackpadPan } = vi.hoisted(() => ({
  trackpadPan: vi.fn(),
}));

vi.mock("@/lib/events/trackpad/createTrackpadPanHandler", () => ({
  createTrackpadPanHandler: vi.fn(() => trackpadPan),
}));

vi.mock("@/lib/events/trackpad/detectTrackpadGesture", () => ({
  detectTrackpadGesture: vi.fn(),
}));

vi.mock("@/lib/events/wheel/handlers/handleWheel", () => ({
  handleWheel: vi.fn(() => false),
}));

describe("setupWheelEvents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers a non-passive wheel listener and cleanup removes it", () => {
    const canvas = createMouseTestCanvas();
    const add = vi.spyOn(canvas.container, "addEventListener");
    const remove = vi.spyOn(canvas.container, "removeEventListener");

    const cleanup = setupWheelEvents(canvas, canvas.config);

    expect(add).toHaveBeenCalledWith("wheel", expect.any(Function), { passive: false });

    const wheelHandler = add.mock.calls.find((c) => c[0] === "wheel")?.[1] as (e: WheelEvent) => void;
    cleanup();
    expect(remove).toHaveBeenCalledWith("wheel", wheelHandler);
  });

  it("routes trackpad scroll to the trackpad pan handler", () => {
    vi.mocked(detectTrackpadGesture).mockReturnValue({
      isTrackpad: true,
      isMouseWheel: false,
      isTrackpadScroll: true,
      isTrackpadPinch: false,
      isZoomGesture: false,
    });

    const canvas = createMouseTestCanvas();
    setupWheelEvents(canvas, canvas.config);

    const event = new WheelEvent("wheel", { deltaX: 1, deltaY: 2, deltaMode: 0 });
    canvas.container.dispatchEvent(event);

    expect(trackpadPan).toHaveBeenCalledWith(event);
    expect(handleWheel).not.toHaveBeenCalled();
  });

  it("delegates to handleWheel when not trackpad scroll", () => {
    vi.mocked(detectTrackpadGesture).mockReturnValue({
      isTrackpad: false,
      isMouseWheel: true,
      isTrackpadScroll: false,
      isTrackpadPinch: false,
      isZoomGesture: true,
    });

    const canvas = createMouseTestCanvas();
    const config = canvas.config;
    setupWheelEvents(canvas, config);

    const event = new WheelEvent("wheel", { deltaY: -1, ctrlKey: true });
    canvas.container.dispatchEvent(event);

    expect(handleWheel).toHaveBeenCalledWith(event, canvas, config);
    expect(trackpadPan).not.toHaveBeenCalled();
  });
});
