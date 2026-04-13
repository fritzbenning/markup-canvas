export type SendPostMessageTarget = "parent" | "window" | "both";

export type SendPostMessageOptions = {
  target?: SendPostMessageTarget;
  targetOrigin?: string;
};

/**
 * Sends a typed envelope to the embedding page via `postMessage` so parents or same-window listeners
 * can react to canvas events (e.g. keyboard shortcuts forwarded from the iframe).
 *
 * No-ops when `window` is undefined (SSR / non-browser).
 *
 * @param canvasName - Instance name from config (matches incoming `canvasName` on parent handlers).
 * @param action - Logical channel name (e.g. `"keyboardShortcut"`).
 * @param data - Serializable payload for the action.
 * @param options - `target`: where to post (`parent` default); `targetOrigin` for `postMessage` (default `"*"`).
 *
 * @example
 * ```ts
 * sendPostMessage("myCanvas", "keyboardShortcut", { key: "ArrowLeft" });
 * sendPostMessage("myCanvas", "ready", {}, { target: "both", targetOrigin: "*" });
 * ```
 */
export function sendPostMessage(canvasName: string, action: string, data: unknown, options?: SendPostMessageOptions): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload = {
    source: "markup-canvas" as const,
    action,
    data,
    timestamp: Date.now(),
    canvasName,
  };

  const targetOrigin = options?.targetOrigin ?? "*";
  const target = options?.target ?? "parent";

  if (target === "window" || target === "both") {
    window.postMessage(payload, targetOrigin);
  }

  if (target === "parent" || target === "both") {
    if (!window.parent) {
      return;
    }
    window.parent.postMessage(payload, targetOrigin);
  }
}
