import { afterEach, describe, expect, it, vi } from "vitest";
import { checkContainerDimensions } from "./checkContainerDimensions";

describe("checkContainerDimensions", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs when width and height are zero with auto sizing", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const container = document.createElement("div");
    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      width: "auto",
      height: "auto",
    } as CSSStyleDeclaration);

    checkContainerDimensions(container);

    expect(error).toHaveBeenCalled();
    const messages = error.mock.calls.map((c) => c.join(" "));
    expect(messages.some((m) => m.includes("width"))).toBe(true);
    expect(messages.some((m) => m.includes("height"))).toBe(true);
  });

  it("does not log when dimensions are non-zero", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const container = document.createElement("div");
    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    checkContainerDimensions(container);

    expect(error).not.toHaveBeenCalled();
  });
});
