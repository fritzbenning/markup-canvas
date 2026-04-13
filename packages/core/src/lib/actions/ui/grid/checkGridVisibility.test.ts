import { describe, expect, it } from "vitest";
import type { RulerSystem } from "@/types/index";
import { checkGridVisibility } from "./checkGridVisibility";

describe("checkGridVisibility", () => {
  it("returns false when rulers are null", () => {
    expect(checkGridVisibility(null)).toBe(false);
  });

  it("delegates to isGridVisible", () => {
    const rulers = {
      isGridVisible: () => true,
    } as unknown as RulerSystem;
    expect(checkGridVisibility(rulers)).toBe(true);
  });
});
