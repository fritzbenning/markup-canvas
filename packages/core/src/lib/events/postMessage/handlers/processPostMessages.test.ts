import { describe, expect, it, vi } from "vitest";
import { sendPostMessageError } from "@/lib/events/postMessage/utils/sendPostMessageError";
import type { PostMessageAction } from "@/types/events";
import { createPostMessageTestCanvas } from "../test/createPostMessageTestCanvas";
import { processPostMessage } from "./processPostMessages";

vi.mock("@/lib/events/postMessage/utils/sendPostMessageError", () => ({
  sendPostMessageError: vi.fn(),
}));

describe("processPostMessage", () => {
  it("dispatches zoomIn with numeric payload", () => {
    const canvas = createPostMessageTestCanvas();
    processPostMessage(canvas, "zoomIn", 0.1, "testCanvas");
    expect(canvas.zoomIn).toHaveBeenCalledWith(0.1);
  });

  it("dispatches setZoom when payload is valid", () => {
    const canvas = createPostMessageTestCanvas();
    processPostMessage(canvas, "setZoom", 2, "testCanvas");
    expect(canvas.setZoom).toHaveBeenCalledWith(2);
  });

  it("reports invalid setZoom via sendPostMessageError", () => {
    const canvas = createPostMessageTestCanvas();
    vi.mocked(sendPostMessageError).mockClear();
    processPostMessage(canvas, "setZoom", -1, "testCanvas");
    expect(sendPostMessageError).toHaveBeenCalledWith("testCanvas", "setZoom", expect.stringContaining("Invalid zoom"));
  });

  it("reports unknown actions via sendPostMessageError", () => {
    const canvas = createPostMessageTestCanvas();
    vi.mocked(sendPostMessageError).mockClear();
    processPostMessage(canvas, "notAnAction" as unknown as PostMessageAction, {}, "testCanvas");
    expect(sendPostMessageError).toHaveBeenCalledWith(
      "testCanvas",
      "notAnAction",
      expect.stringContaining("Unknown action"),
    );
  });

  it("dispatches panToPoint", () => {
    const canvas = createPostMessageTestCanvas();
    processPostMessage(canvas, "panToPoint", { x: 3, y: 4 }, "testCanvas");
    expect(canvas.panToPoint).toHaveBeenCalledWith(3, 4);
  });

  it("toggles theme when toggleThemeMode is requested", () => {
    const canvas = createPostMessageTestCanvas();
    processPostMessage(canvas, "toggleThemeMode", {}, "testCanvas");
    expect(canvas.updateThemeMode).toHaveBeenCalled();
  });
});
