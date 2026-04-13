/**
 * Notifies the parent (or any `message` listener) that a postMessage-driven action failed on the canvas.
 * Uses `source: "markup-canvas-error"` so hosts can distinguish errors from normal `markup-canvas` events.
 *
 * @param canvasName - Canvas instance name (same as in {@link sendPostMessage} envelopes).
 * @param action - The action that was being processed when the error occurred.
 * @param error - Human-readable error string (typically `Error.message`).
 *
 * @example
 * ```ts
 * sendPostMessageError("myCanvas", "setZoom", "Invalid zoom level: -1");
 * ```
 */
export function sendPostMessageError(canvasName: string, action: string, error: string): void {
  window.postMessage(
    {
      source: "markup-canvas-error",
      canvasName,
      action,
      error,
      timestamp: Date.now(),
    },
    "*",
  );
}
