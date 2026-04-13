import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMouseTestCanvas } from "@/lib/events/mouse/test/createMouseTestCanvas";
import { disableTransition } from "@/lib/transition";
import { createTrackpadPanHandler } from "./createTrackpadPanHandler";

vi.mock("@/lib/helpers", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@/lib/helpers")>();
  return {
    ...mod,
    withRAFThrottle: <T extends (...args: unknown[]) => void>(fn: T) =>
      Object.assign((...args: unknown[]) => fn(...args), { cleanup: () => {} }) as T & { cleanup: () => void },
  };
});

vi.mock("@/lib/transition", () => ({
  disableTransition: vi.fn(),
}));

describe("createTrackpadPanHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns false when the first argument is not an event", () => {
    const canvas = createMouseTestCanvas();
    const handler = createTrackpadPanHandler(canvas);
    expect(handler(undefined as unknown as WheelEvent)).toBe(false);
  });

  it("subtracts wheel deltas from translation and disables transition", () => {
    const canvas = createMouseTestCanvas();
    canvas.transform.translateX = 100;
    canvas.transform.translateY = 200;

    const handler = createTrackpadPanHandler(canvas);
    const event = new WheelEvent("wheel", { deltaX: 10, deltaY: 25, deltaMode: 0 });

    vi.mocked(canvas.updateTransform).mockReturnValue(true);

    const result = handler(event);

    expect(disableTransition).toHaveBeenCalledWith(canvas.transformLayer, canvas.config);
    expect(canvas.updateTransform).toHaveBeenCalledWith({
      scale: canvas.transform.scale,
      translateX: 90,
      translateY: 175,
    });
    expect(result).toBe(true);
  });

  it("logs and returns false when updateTransform throws", () => {
    const err = new Error("transform failed");
    const canvas = createMouseTestCanvas();
    vi.mocked(canvas.updateTransform).mockImplementation(() => {
      throw err;
    });
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    const handler = createTrackpadPanHandler(canvas);
    const result = handler(new WheelEvent("wheel", { deltaX: 0, deltaY: 1, deltaMode: 0 }));

    expect(result).toBe(false);
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });
});
