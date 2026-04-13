import { describe, expect, it, vi } from "vitest";
import type { RulerSystem } from "@/types/index";
import { hideGrid } from "./hideGrid";

describe("hideGrid", () => {
  it("returns false when rulers are null", () => {
    expect(hideGrid(null)).toBe(false);
  });

  it("delegates to hideGrid on rulers", () => {
    const hide = vi.fn(() => true);
    const rulers = { hideGrid: hide } as unknown as RulerSystem;
    expect(hideGrid(rulers)).toBe(true);
    expect(hide).toHaveBeenCalled();
  });
});
