import { describe, expect, it } from "vitest";
import { postMessageRules } from "./postMessageRules";

describe("postMessageRules", () => {
  it("uses unique rule ids", () => {
    const ids = postMessageRules.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses unique actions", () => {
    const actions = postMessageRules.map((r) => r.action);
    expect(new Set(actions).size).toBe(actions.length);
  });

  it("defines a run function for every rule", () => {
    for (const rule of postMessageRules) {
      expect(typeof rule.run).toBe("function");
    }
  });
});
