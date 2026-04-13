import { afterEach, describe, expect, it, vi } from "vitest";
import { sendPostMessage } from "@/lib/events/postMessage/utils/sendPostMessage";
import { setupKeyboardEvents } from "./setupKeyboardEvents";
import { createKeyboardTestCanvasWithContainer } from "./test/createKeyboardTestCanvasWithContainer";

vi.mock("@/lib/events/postMessage/utils/sendPostMessage", () => ({
  sendPostMessage: vi.fn(),
}));

describe("setupKeyboardEvents", () => {
  afterEach(() => {
    vi.mocked(sendPostMessage).mockClear();
  });

  it("handles ArrowLeft via document when bindKeyboardEventsTo is document", () => {
    const canvas = createKeyboardTestCanvasWithContainer({
      sendKeyboardEventsToParent: false,
      bindKeyboardEventsTo: "document",
    });
    const cleanup = setupKeyboardEvents(canvas, canvas.config);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    expect(canvas.panLeft).toHaveBeenCalledOnce();
    cleanup();
  });

  it("handles keydown on container when bindKeyboardEventsTo is canvas and container is focused", () => {
    const canvas = createKeyboardTestCanvasWithContainer({
      sendKeyboardEventsToParent: false,
      bindKeyboardEventsTo: "canvas",
    });
    document.body.appendChild(canvas.container);
    const cleanup = setupKeyboardEvents(canvas, canvas.config);
    canvas.container.focus();
    expect(document.activeElement).toBe(canvas.container);
    canvas.container.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(canvas.panRight).toHaveBeenCalledOnce();
    cleanup();
    canvas.container.remove();
  });

  it("ignores keydown on container when canvas is not focused", () => {
    const canvas = createKeyboardTestCanvasWithContainer({
      sendKeyboardEventsToParent: false,
      bindKeyboardEventsTo: "canvas",
    });
    const cleanup = setupKeyboardEvents(canvas, canvas.config);
    canvas.container.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(canvas.panRight).not.toHaveBeenCalled();
    cleanup();
  });

  it("forwards to parent and skips local rules when sendKeyboardEventsToParent is true", () => {
    const canvas = createKeyboardTestCanvasWithContainer({
      sendKeyboardEventsToParent: true,
      name: "testCanvas",
      bindKeyboardEventsTo: "document",
    });
    const cleanup = setupKeyboardEvents(canvas, canvas.config);
    const ev = new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true });
    document.dispatchEvent(ev);
    expect(sendPostMessage).toHaveBeenCalledWith(
      "testCanvas",
      "keyboardShortcut",
      expect.objectContaining({ key: "ArrowLeft" }),
    );
    expect(canvas.panLeft).not.toHaveBeenCalled();
    cleanup();
  });

  it("removes listener when cleanup runs", () => {
    const canvas = createKeyboardTestCanvasWithContainer({
      sendKeyboardEventsToParent: false,
      bindKeyboardEventsTo: "document",
    });
    const cleanup = setupKeyboardEvents(canvas, canvas.config);
    cleanup();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    expect(canvas.panLeft).not.toHaveBeenCalled();
  });
});
