import type { MarkupCanvas } from "@/lib/MarkupCanvas.js";
import type { PostMessageRequest } from "@/types/events";
import { processPostMessage } from "./processPostMessages";

export function setupPostMessageEvents(canvas: MarkupCanvas): () => void {
  const handleMessage = (event: MessageEvent): void => {
    const data = event.data as PostMessageRequest;

    if (!["markup-canvas", "application"].includes(data.source)) {
      return;
    }

    const canvasName = canvas.config.name || "markupCanvas";

    if (data.canvasName !== canvasName) {
      return;
    }

    const action = data.action;
    const payload = data.data as string | number | boolean | object;

    processPostMessage(canvas, action, payload, canvasName);
  };

  if (typeof window !== "undefined") {
    window.addEventListener("message", handleMessage);
  }

  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("message", handleMessage);
    }
  };
}
