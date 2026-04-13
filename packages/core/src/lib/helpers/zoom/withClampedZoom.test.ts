import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "@/lib/config/constants";
import { withClampedZoom } from "./withClampedZoom";

describe("withClampedZoom", () => {
  it("provides a clamp that enforces min and max zoom from config", () => {
    const config = DEFAULT_CONFIG;
    const result = withClampedZoom(config, (clamp) => ({
      below: clamp(0.001),
      above: clamp(999),
      mid: clamp(1),
    }));
    expect(result.below).toBe(config.minZoom);
    expect(result.above).toBe(config.maxZoom);
    expect(result.mid).toBe(1);
  });
});
