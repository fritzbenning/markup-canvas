import { describe, expect, it } from "vitest";
import { getTouchDistance } from "./getTouchDistance";

function touch(clientX: number, clientY: number): Touch {
  return { clientX, clientY } as Touch;
}

describe("getTouchDistance", () => {
  it("returns Euclidean distance between touches", () => {
    expect(getTouchDistance(touch(0, 0), touch(3, 4))).toBe(5);
  });

  it("is zero when both touches coincide", () => {
    expect(getTouchDistance(touch(10, 10), touch(10, 10))).toBe(0);
  });
});
