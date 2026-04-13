import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMouseTestCanvas } from "@/lib/events/mouse/test/createMouseTestCanvas";
import { applyZoomToCanvas } from "@/lib/transform/applyZoomToCanvas";
import type { TouchState } from "@/types/index";
import { handleTouchMove } from "./handleTouchMove";

vi.mock("@/lib/helpers", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@/lib/helpers")>();
  return {
    ...mod,
    withRAFThrottle: <T extends (...args: unknown[]) => void>(fn: T) =>
      Object.assign((...args: unknown[]) => fn(...args), { cleanup: () => {} }) as T & { cleanup: () => void },
  };
});

vi.mock("@/lib/transform/applyZoomToCanvas", () => ({
  applyZoomToCanvas: vi.fn(),
}));

function touch(clientX: number, clientY: number): Touch {
  return { clientX, clientY } as Touch;
}

function touchList(...items: Touch[]): TouchList {
  return items as unknown as TouchList;
}

describe("handleTouchMove", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls preventDefault", () => {
    const canvas = createMouseTestCanvas();
    const event = {
      preventDefault: vi.fn(),
      touches: touchList(touch(0, 0)),
    } as unknown as TouchEvent;

    const touchState: TouchState = {
      touches: [touch(0, 0)],
      lastDistance: 0,
      lastCenter: { x: 0, y: 0 },
    };

    handleTouchMove(event, canvas, touchState);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("applies single-touch pan delta from previous touches", () => {
    const canvas = createMouseTestCanvas();
    canvas.transform.translateX = 10;
    canvas.transform.translateY = 20;

    const event = {
      preventDefault: vi.fn(),
      touches: touchList(touch(30, 45)),
    } as unknown as TouchEvent;

    const touchState: TouchState = {
      touches: [touch(10, 20)],
      lastDistance: 0,
      lastCenter: { x: 0, y: 0 },
    };

    handleTouchMove(event, canvas, touchState);

    expect(canvas.updateTransform).toHaveBeenCalledWith({
      translateX: 30,
      translateY: 45,
    });
    expect(touchState.touches).toEqual([touch(30, 45)]);
  });

  it("applies pinch zoom when two touches and lastDistance is positive", () => {
    const canvas = createMouseTestCanvas();

    const event = {
      preventDefault: vi.fn(),
      touches: touchList(touch(0, 50), touch(150, 50)),
    } as unknown as TouchEvent;

    const touchState: TouchState = {
      touches: [touch(0, 50), touch(100, 50)],
      lastDistance: 100,
      lastCenter: { x: 50, y: 50 },
    };

    handleTouchMove(event, canvas, touchState);

    expect(applyZoomToCanvas).toHaveBeenCalledWith(canvas, 1.5, 75, 50);
    expect(touchState.lastDistance).toBe(150);
    expect(touchState.lastCenter).toEqual({ x: 75, y: 50 });
  });
});
