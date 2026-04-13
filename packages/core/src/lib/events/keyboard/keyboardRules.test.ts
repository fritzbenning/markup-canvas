import { describe, expect, it } from "vitest";
import { keyboardRules } from "./keyboardRules";

describe("keyboardRules", () => {
  it("uses unique rule ids", () => {
    const ids = keyboardRules.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("defines a run function for every rule", () => {
    for (const rule of keyboardRules) {
      expect(typeof rule.run).toBe("function");
    }
  });
});
