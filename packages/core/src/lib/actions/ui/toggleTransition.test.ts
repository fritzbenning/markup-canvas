import { describe, expect, it } from "vitest";
import { toggleTransition } from "./toggleTransition";

describe("toggleTransition", () => {
  it("returns the negated flag", () => {
    expect(toggleTransition(true)).toBe(false);
    expect(toggleTransition(false)).toBe(true);
  });
});
