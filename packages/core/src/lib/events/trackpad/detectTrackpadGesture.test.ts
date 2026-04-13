import { describe, expect, it } from "vitest";
import { detectTrackpadGesture } from "./detectTrackpadGesture";

/** jsdom’s `WheelEvent` does not always mirror init fields; the implementation only reads a few numeric/boolean props. */
function wheel(props: {
  deltaX: number;
  deltaY: number;
  deltaMode?: number;
  ctrlKey?: boolean;
  metaKey?: boolean;
}): WheelEvent {
  const { deltaX, deltaY, deltaMode = 0, ctrlKey = false, metaKey = false } = props;
  return { deltaX, deltaY, deltaMode, ctrlKey, metaKey } as unknown as WheelEvent;
}

describe("detectTrackpadGesture", () => {
  it("treats typical line-based mouse wheel as not trackpad", () => {
    const event = wheel({ deltaX: 0, deltaY: 120, deltaMode: 1 });
    const g = detectTrackpadGesture(event);
    expect(g.isTrackpad).toBe(false);
    expect(g.isMouseWheel).toBe(true);
    expect(g.isTrackpadScroll).toBe(false);
    expect(g.isTrackpadPinch).toBe(false);
    expect(g.isZoomGesture).toBe(false);
  });

  it("detects trackpad scroll when multiple heuristics align", () => {
    const event = wheel({
      deltaX: 2,
      deltaY: 3.5,
      deltaMode: 0,
    });
    const g = detectTrackpadGesture(event);
    expect(g.isTrackpad).toBe(true);
    expect(g.isMouseWheel).toBe(false);
    expect(g.isTrackpadScroll).toBe(true);
    expect(g.isTrackpadPinch).toBe(false);
    expect(g.isZoomGesture).toBe(false);
  });

  it("treats ctrl+wheel as zoom gesture on trackpad (pinch)", () => {
    const event = wheel({
      deltaX: 2,
      deltaY: 3.5,
      deltaMode: 0,
      ctrlKey: true,
    });
    const g = detectTrackpadGesture(event);
    expect(g.isTrackpad).toBe(true);
    expect(g.isZoomGesture).toBe(true);
    expect(g.isTrackpadPinch).toBe(true);
    expect(g.isTrackpadScroll).toBe(false);
  });

  it("treats meta+wheel as zoom gesture", () => {
    const event = wheel({
      deltaX: 2,
      deltaY: 3.5,
      deltaMode: 0,
      metaKey: true,
    });
    expect(detectTrackpadGesture(event).isZoomGesture).toBe(true);
  });

  it("does not classify as trackpad when fewer than two heuristics match", () => {
    const event = wheel({
      deltaX: 0,
      deltaY: 100,
      deltaMode: 0,
    });
    const g = detectTrackpadGesture(event);
    expect(g.isTrackpad).toBe(false);
    expect(g.isMouseWheel).toBe(true);
  });
});
