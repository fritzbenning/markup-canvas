import { describe, expect, it } from "vitest";
import type { TouchState } from "@/types/index";
import { handleTouchEnd } from "./handleTouchEnd";

function touch(clientX: number, clientY: number): Touch {
  return { clientX, clientY } as Touch;
}

function touchList(...items: Touch[]): TouchList {
  return items as unknown as TouchList;
}

describe("handleTouchEnd", () => {
  it("updates touches from the event", () => {
    const remaining = touch(1, 2);
    const event = {
      touches: touchList(remaining),
    } as unknown as TouchEvent;

    const touchState: TouchState = {
      touches: [touch(9, 9), touch(9, 9)],
      lastDistance: 100,
      lastCenter: { x: 0, y: 0 },
    };

    handleTouchEnd(event, touchState);

    expect(touchState.touches).toEqual([remaining]);
  });

  it("clears lastDistance when fewer than two touches remain", () => {
    const event = {
      touches: touchList(touch(0, 0)),
    } as unknown as TouchEvent;

    const touchState: TouchState = {
      touches: [],
      lastDistance: 80,
      lastCenter: { x: 1, y: 1 },
    };

    handleTouchEnd(event, touchState);

    expect(touchState.lastDistance).toBe(0);
  });

  it("keeps lastDistance when two touches still active", () => {
    const event = {
      touches: touchList(touch(0, 0), touch(10, 0)),
    } as unknown as TouchEvent;

    const touchState: TouchState = {
      touches: [],
      lastDistance: 42,
      lastCenter: { x: 5, y: 0 },
    };

    handleTouchEnd(event, touchState);

    expect(touchState.lastDistance).toBe(42);
  });
});
