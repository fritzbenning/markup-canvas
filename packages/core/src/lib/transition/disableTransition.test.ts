import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FALLBACK_TRANSITION_DURATION } from "@/lib/constants";
import { disableTransition } from "./disableTransition";
import { enableTransition } from "./enableTransition";

describe("disableTransition", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    window.__markupCanvasTransitionTimeout = undefined;
  });

  it("returns false and schedules nothing when enableTransition is false", () => {
    const el = document.createElement("div");
    el.style.transition = "transform 0.2s linear";

    expect(disableTransition(el, { enableTransition: false })).toBe(false);

    vi.runAllTimers();
    expect(el.style.transition).toBe("transform 0.2s linear");
  });

  it("sets transition to none after the configured duration in milliseconds", () => {
    const el = document.createElement("div");
    enableTransition(el, { enableTransition: true, transitionDuration: 0.15 });
    expect(el.style.transition).toContain("transform");

    expect(disableTransition(el, { enableTransition: true, transitionDuration: 0.15 })).toBe(true);

    vi.advanceTimersByTime(150);
    expect(el.style.transition).toBe("none");
  });

  it("uses the fallback duration when transitionDuration is omitted", () => {
    const el = document.createElement("div");
    enableTransition(el, { enableTransition: true, transitionDuration: FALLBACK_TRANSITION_DURATION });

    disableTransition(el, { enableTransition: true });

    vi.advanceTimersByTime(FALLBACK_TRANSITION_DURATION * 1000);
    expect(el.style.transition).toBe("none");
  });
});
