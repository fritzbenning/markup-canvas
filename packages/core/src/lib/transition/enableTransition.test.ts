import { afterEach, describe, expect, it, vi } from "vitest";
import { enableTransition } from "./enableTransition";

describe("enableTransition", () => {
  afterEach(() => {
    window.__markupCanvasTransitionTimeout = undefined;
  });

  it("returns false and does not set transition when enableTransition is false", () => {
    const el = document.createElement("div");
    expect(enableTransition(el, { enableTransition: false })).toBe(false);
    expect(el.style.transition).toBe("");
  });

  it("sets a linear transform transition and returns true when enabled", () => {
    const el = document.createElement("div");
    expect(enableTransition(el, { enableTransition: true, transitionDuration: 0.35 })).toBe(true);
    expect(el.style.transition).toBe("transform 0.35s linear");
  });

  it("clears a pending window transition timeout before applying styles", () => {
    const el = document.createElement("div");
    const clearSpy = vi.spyOn(window, "clearTimeout");
    const pendingId = window.setTimeout(() => {}, 9999);
    window.__markupCanvasTransitionTimeout = pendingId;

    enableTransition(el, { enableTransition: true, transitionDuration: 0.2 });

    expect(clearSpy).toHaveBeenCalledWith(pendingId);
    clearSpy.mockRestore();
  });
});
