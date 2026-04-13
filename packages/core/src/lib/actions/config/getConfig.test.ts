import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "@/lib/config/constants";
import { getConfig } from "./getConfig";

describe("getConfig", () => {
  it("returns a shallow copy of the config", () => {
    const input = { ...DEFAULT_CONFIG, name: "test-instance" };
    const out = getConfig(input);
    expect(out).toEqual(input);
    expect(out).not.toBe(input);
  });

  it("does not deep-clone nested objects", () => {
    const input = { ...DEFAULT_CONFIG, initialPan: { x: 1, y: 2 } };
    const out = getConfig(input);
    expect(out.initialPan).toBe(input.initialPan);
  });
});
