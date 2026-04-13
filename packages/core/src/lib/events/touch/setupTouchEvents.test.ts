import { describe, expect, it, vi } from "vitest";
import { createMouseTestCanvas } from "@/lib/events/mouse/test/createMouseTestCanvas";
import { setupTouchEvents } from "./setupTouchEvents";

describe("setupTouchEvents", () => {
  it("registers non-passive touch listeners and returns a cleanup that removes them", () => {
    const canvas = createMouseTestCanvas();
    const add = vi.spyOn(canvas.container, "addEventListener");
    const remove = vi.spyOn(canvas.container, "removeEventListener");

    const cleanup = setupTouchEvents(canvas);

    expect(add).toHaveBeenCalledWith("touchstart", expect.any(Function), { passive: false });
    expect(add).toHaveBeenCalledWith("touchmove", expect.any(Function), { passive: false });
    expect(add).toHaveBeenCalledWith("touchend", expect.any(Function), { passive: false });

    const startHandler = add.mock.calls.find((c) => c[0] === "touchstart")?.[1] as (e: Event) => void;
    const moveHandler = add.mock.calls.find((c) => c[0] === "touchmove")?.[1] as (e: Event) => void;
    const endHandler = add.mock.calls.find((c) => c[0] === "touchend")?.[1] as (e: Event) => void;

    cleanup();

    expect(remove).toHaveBeenCalledWith("touchstart", startHandler);
    expect(remove).toHaveBeenCalledWith("touchmove", moveHandler);
    expect(remove).toHaveBeenCalledWith("touchend", endHandler);
  });
});
