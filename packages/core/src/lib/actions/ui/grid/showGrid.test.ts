import { describe, expect, it } from "vitest";
import { showGrid } from "./showGrid";

describe("showGrid", () => {
  it("returns false when rulers are null", () => {
    expect(showGrid(null)).toBe(false);
  });
});
