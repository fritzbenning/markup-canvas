import { describe, expect, it } from "vitest";
import { getTouchCenter } from "./getTouchCenter";

function touch(clientX: number, clientY: number): Touch {
  return { clientX, clientY } as Touch;
}

describe("getTouchCenter", () => {
  it("returns the midpoint of two touches in viewport space", () => {
    expect(getTouchCenter(touch(0, 0), touch(20, 40))).toEqual({ x: 10, y: 20 });
  });
});
