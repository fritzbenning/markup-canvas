import { describe, expect, it, vi } from "vitest";
import type { RulerSystem } from "@/types/index";
import { checkRulersVisibility } from "./checkRulersVisibility";
import { hideRulers } from "./hideRulers";
import { showRulers } from "./showRulers";
import { toggleRulers } from "./toggleRulers";

describe("rulers actions", () => {
  it("checkRulersVisibility is false without horizontal ruler", () => {
    expect(checkRulersVisibility(null)).toBe(false);
    expect(checkRulersVisibility({ horizontalRuler: null } as unknown as RulerSystem)).toBe(false);
  });

  it("checkRulersVisibility reads horizontal ruler display", () => {
    const horizontalRuler = document.createElement("div");
    horizontalRuler.style.display = "block";
    const rulers = { horizontalRuler } as unknown as RulerSystem;
    expect(checkRulersVisibility(rulers)).toBe(true);
    horizontalRuler.style.display = "none";
    expect(checkRulersVisibility(rulers)).toBe(false);
  });

  it("hideRulers and showRulers return false when rulers are null", () => {
    expect(hideRulers(null)).toBe(false);
    expect(showRulers(null)).toBe(false);
  });

  it("hideRulers and showRulers delegate when rulers exist", () => {
    const hide = vi.fn();
    const show = vi.fn();
    const rulers = { hide, show } as unknown as RulerSystem;
    expect(hideRulers(rulers)).toBe(true);
    expect(showRulers(rulers)).toBe(true);
    expect(hide).toHaveBeenCalled();
    expect(show).toHaveBeenCalled();
  });

  it("toggleRulers hides when visible", () => {
    const hide = vi.fn();
    const show = vi.fn();
    const rulers = { hide, show } as unknown as RulerSystem;
    const getVis = vi.fn(() => true);
    expect(toggleRulers(rulers, getVis)).toBe(true);
    expect(hide).toHaveBeenCalled();
    expect(show).not.toHaveBeenCalled();
  });

  it("toggleRulers shows when hidden", () => {
    const hide = vi.fn();
    const show = vi.fn();
    const rulers = { hide, show } as unknown as RulerSystem;
    const getVis = vi.fn(() => false);
    expect(toggleRulers(rulers, getVis)).toBe(true);
    expect(show).toHaveBeenCalled();
    expect(hide).not.toHaveBeenCalled();
  });
});
