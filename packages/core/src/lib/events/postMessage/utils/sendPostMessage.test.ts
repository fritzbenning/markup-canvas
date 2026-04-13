import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendPostMessage } from "./sendPostMessage";

describe("sendPostMessage", () => {
  const originalParent = window.parent;
  let parentPostMessage: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    parentPostMessage = vi.fn();
    Object.defineProperty(window, "parent", {
      configurable: true,
      value: { postMessage: parentPostMessage },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(window, "parent", {
      configurable: true,
      value: originalParent,
    });
  });

  it("sends a markup-canvas envelope to the parent by default", () => {
    const winPost = vi.spyOn(window, "postMessage").mockImplementation(() => {});

    sendPostMessage("c1", "ready", { x: 1 });

    expect(parentPostMessage).toHaveBeenCalledTimes(1);
    expect(parentPostMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "markup-canvas",
        canvasName: "c1",
        action: "ready",
        data: { x: 1 },
      }),
      "*",
    );
    expect(winPost).not.toHaveBeenCalled();
  });

  it("posts only to window when target is window", () => {
    const winPost = vi.spyOn(window, "postMessage").mockImplementation(() => {});

    sendPostMessage("c", "a", null, { target: "window" });

    expect(winPost).toHaveBeenCalledTimes(1);
    expect(parentPostMessage).not.toHaveBeenCalled();
  });

  it("posts to both window and parent when target is both", () => {
    const winPost = vi.spyOn(window, "postMessage").mockImplementation(() => {});

    sendPostMessage("c", "a", 1, { target: "both" });

    expect(winPost).toHaveBeenCalledTimes(1);
    expect(parentPostMessage).toHaveBeenCalledTimes(1);
  });

  it("respects targetOrigin on parent", () => {
    sendPostMessage("c", "a", {}, { target: "parent", targetOrigin: "https://example.com" });
    expect(parentPostMessage).toHaveBeenCalledWith(expect.any(Object), "https://example.com");
  });
});
