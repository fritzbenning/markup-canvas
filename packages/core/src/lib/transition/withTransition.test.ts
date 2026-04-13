import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { withTransition } from "./withTransition";

describe("withTransition", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    window.__markupCanvasTransitionTimeout = undefined;
  });

  it("returns the result of the operation", () => {
    const el = document.createElement("div");
    expect(withTransition(el, { enableTransition: true, transitionDuration: 0.2 }, () => "done")).toBe(
      "done",
    );
  });

  it("disables transition after the debounce delay even when the operation throws", () => {
    const el = document.createElement("div");

    expect(() =>
      withTransition(el, { enableTransition: true, transitionDuration: 0.1 }, () => {
        throw new Error("fail");
      }),
    ).toThrow("fail");

    vi.advanceTimersByTime(100);
    expect(el.style.transition).toBe("none");
  });

  it("still runs the operation when transitions are disabled in config", () => {
    const el = document.createElement("div");
    let ran = false;
    const result = withTransition(el, { enableTransition: false }, () => {
      ran = true;
      return 7;
    });
    expect(ran).toBe(true);
    expect(result).toBe(7);
    expect(el.style.transition).toBe("");
  });
});
