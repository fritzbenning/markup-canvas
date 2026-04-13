import { describe, expect, it, vi } from "vitest";
import { resetClickState } from "./resetClickState";

describe("resetClickState", () => {
  it("resets mouse down time and hasDragged", () => {
    const setMouseDownTime = vi.fn();
    const setHasDragged = vi.fn();
    resetClickState({ setMouseDownTime, setHasDragged });
    expect(setMouseDownTime).toHaveBeenCalledWith(0);
    expect(setHasDragged).toHaveBeenCalledWith(false);
  });
});
