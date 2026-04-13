import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "@/lib/config/constants";
import { clampZoom } from "./clampZoom";

describe("clampZoom", () => {
  it("returns the value when within min and max", () => {
    expect(clampZoom(1, DEFAULT_CONFIG)).toBe(1);
    expect(clampZoom(5, DEFAULT_CONFIG)).toBe(5);
  });

  it("clamps below minZoom", () => {
    expect(clampZoom(0.01, DEFAULT_CONFIG)).toBe(DEFAULT_CONFIG.minZoom);
  });

  it("clamps above maxZoom", () => {
    expect(clampZoom(1000, DEFAULT_CONFIG)).toBe(DEFAULT_CONFIG.maxZoom);
  });
});
