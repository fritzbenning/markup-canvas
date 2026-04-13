import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "@/lib/config/constants";
import { withFeatureEnabled } from "./withFeatureEnabled";

describe("withFeatureEnabled", () => {
  it("returns the operation result when the feature flag is truthy", () => {
    const config = { ...DEFAULT_CONFIG, enableZoom: true };
    const result = withFeatureEnabled(config, "enableZoom", () => 42);
    expect(result).toBe(42);
  });

  it("returns null when the feature flag is falsy", () => {
    const config = { ...DEFAULT_CONFIG, enableZoom: false };
    const result = withFeatureEnabled(config, "enableZoom", () => 42);
    expect(result).toBeNull();
  });
});
