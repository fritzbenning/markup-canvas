import { describe, expect, it } from "vitest";
import { createPostMessageTestCanvas } from "./test/createPostMessageTestCanvas";
import { setupPostMessageEvents } from "./setupPostMessageEvents";

describe("setupPostMessageEvents", () => {
  it("routes matching markup-canvas messages to the canvas", () => {
    const canvas = createPostMessageTestCanvas("myCanvas");
    const cleanup = setupPostMessageEvents(canvas);

    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          source: "markup-canvas",
          canvasName: "myCanvas",
          action: "zoomIn",
          data: 0.2,
        },
      }),
    );

    expect(canvas.zoomIn).toHaveBeenCalledWith(0.2);
    cleanup();
  });

  it("accepts application as source", () => {
    const canvas = createPostMessageTestCanvas("appCanvas");
    const cleanup = setupPostMessageEvents(canvas);

    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          source: "application",
          canvasName: "appCanvas",
          action: "fitToScreen",
          data: {},
        },
      }),
    );

    expect(canvas.fitToScreen).toHaveBeenCalled();
    cleanup();
  });

  it("ignores messages for a different canvas name", () => {
    const canvas = createPostMessageTestCanvas("onlyMe");
    const cleanup = setupPostMessageEvents(canvas);

    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          source: "markup-canvas",
          canvasName: "other",
          action: "zoomIn",
          data: 1,
        },
      }),
    );

    expect(canvas.zoomIn).not.toHaveBeenCalled();
    cleanup();
  });

  it("ignores unknown message sources", () => {
    const canvas = createPostMessageTestCanvas();
    const cleanup = setupPostMessageEvents(canvas);

    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          source: "other-app",
          canvasName: "testCanvas",
          action: "zoomIn",
          data: 1,
        },
      }),
    );

    expect(canvas.zoomIn).not.toHaveBeenCalled();
    cleanup();
  });
});
