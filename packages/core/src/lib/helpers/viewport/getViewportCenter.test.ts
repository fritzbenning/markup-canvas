import { afterEach, describe, expect, it, vi } from "vitest";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import { getViewportCenter } from "./getViewportCenter";

describe("getViewportCenter", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns half of bounds width and height", () => {
    const canvas = {
      getBounds: () => ({
        width: 200,
        height: 100,
      }),
    } as unknown as MarkupCanvas;

    expect(getViewportCenter(canvas)).toEqual({ x: 100, y: 50 });
  });

  it("warns and returns zero when getBounds throws", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const err = new Error("bounds");
    const canvas = {
      getBounds: () => {
        throw err;
      },
    } as unknown as MarkupCanvas;

    expect(getViewportCenter(canvas)).toEqual({ x: 0, y: 0 });
    expect(warn).toHaveBeenCalledWith("Failed to calculate viewport center:", err);
  });
});
