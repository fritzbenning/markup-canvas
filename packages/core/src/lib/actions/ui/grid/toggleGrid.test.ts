import { describe, expect, it, vi } from "vitest";
import type { RulerSystem } from "@/types/index";
import { toggleGrid } from "./toggleGrid";

describe("toggleGrid", () => {
  it("returns false when rulers are null", () => {
    expect(toggleGrid(null)).toBe(false);
  });

  it("calls rulers.toggleGrid when present", () => {
    const toggle = vi.fn();
    const rulers = { toggleGrid: toggle } as unknown as RulerSystem;
    expect(toggleGrid(rulers)).toBe(true);
    expect(toggle).toHaveBeenCalled();
  });
});
