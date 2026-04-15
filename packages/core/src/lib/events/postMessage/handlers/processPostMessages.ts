import { sendPostMessageError } from "@/lib/events/postMessage/utils/sendPostMessageError";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { PostMessageAction } from "@/types/events";
import { dispatchPostMessageRules } from "../utils/dispatchPostMessageRules";

/**
 * Dispatches a validated `postMessage` action via {@link dispatchPostMessageRules}
 * to the matching {@link MarkupCanvas} API.
 * On failure, sends an error envelope via {@link sendPostMessageError} (does not rethrow).
 *
 * @param canvas - Target canvas instance.
 * @param action - Remote procedure name (zoom, pan, theme, etc.).
 * @param payload - Action argument(s); shape depends on `action`.
 * @param canvasName - Passed through to error reporting only.
 *
 * @example
 * ```ts
 * processPostMessage(canvas, "zoomIn", undefined, "myCanvas");
 * processPostMessage(canvas, "setZoom", 2, "myCanvas");
 * ```
 */
export function processPostMessage(
  canvas: MarkupCanvas,
  action: PostMessageAction,
  payload: string | number | boolean | object,
  canvasName: string
): void {
  try {
    dispatchPostMessageRules(canvas, action, payload);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendPostMessageError(canvasName, action, errorMessage);
  }
}
