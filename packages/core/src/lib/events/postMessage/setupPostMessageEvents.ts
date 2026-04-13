import { processPostMessage } from "@/lib/events/postMessage/handlers/processPostMessages";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { PostMessageRequest } from "@/types/events";

/**
 * Subscribes to `window` `message` events and routes allowed envelopes to {@link processPostMessage}.
 *
 * Accepts `source` of `"markup-canvas"` or `"application"`, matches `canvasName` to this instance,
 * then dispatches `action` with `data` as payload.
 *
 * @param canvas - Canvas whose `config.name` is matched against incoming messages.
 * @returns Cleanup that removes the `message` listener (no-op if `window` is undefined).
 *
 * @example
 * ```ts
 * const remove = setupPostMessageEvents(canvas);
 * // later:
 * remove();
 * ```
 */
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
