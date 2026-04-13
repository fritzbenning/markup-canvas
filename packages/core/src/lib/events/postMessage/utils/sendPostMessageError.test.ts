import { afterEach, describe, expect, it, vi } from "vitest";
import { sendPostMessageError } from "./sendPostMessageError";

describe("sendPostMessageError", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("posts a markup-canvas-error envelope to the default origin", () => {
    const winPost = vi.spyOn(window, "postMessage").mockImplementation(() => {});

    sendPostMessageError("myCanvas", "setZoom", "Invalid zoom");

    expect(winPost).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "markup-canvas-error",
        canvasName: "myCanvas",
        action: "setZoom",
        error: "Invalid zoom",
      }),
      "*",
    );
  });
});
