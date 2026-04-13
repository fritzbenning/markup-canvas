import { describe, expect, it, vi } from "vitest";
import type { TouchState } from "@/types/index";
import { handleTouchStart } from "./handleTouchStart";

function touch(clientX: number, clientY: number): Touch {
  return { clientX, clientY } as Touch;
}

function touchList(...items: Touch[]): TouchList {
  return items as unknown as TouchList;
}

describe("handleTouchStart", () => {
  it("calls preventDefault and stores touches", () => {
    const t = touch(5, 5);
    const event = {
      preventDefault: vi.fn(),
      touches: touchList(t),
    } as unknown as TouchEvent;

    const touchState: TouchState = {
      touches: [],
      lastDistance: 0,
      lastCenter: { x: 0, y: 0 },
    };

    handleTouchStart(event, touchState);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(touchState.touches).toEqual([t]);
  });

  it("seeds pinch distance and center for two-finger gestures", () => {
    const a = touch(0, 0);
    const b = touch(30, 40);
    const event = {
      preventDefault: vi.fn(),
      touches: touchList(a, b),
    } as unknown as TouchEvent;

    const touchState: TouchState = {
      touches: [],
      lastDistance: 0,
      lastCenter: { x: 0, y: 0 },
    };

    handleTouchStart(event, touchState);

    expect(touchState.lastDistance).toBe(50);
    expect(touchState.lastCenter).toEqual({ x: 15, y: 20 });
  });
});
