import type { MarkupCanvasConfig } from "@/types/index.js";

export function sendKeyboardEventToParent(event: KeyboardEvent, config: Required<MarkupCanvasConfig>): void {
  if (typeof window === "undefined" || !window.parent) {
    return;
  }

  const canvasName = config.name || "markupCanvas";

  window.parent.postMessage(
    {
      source: "markup-canvas",
      action: "keyboardShortcut",
      data: {
        key: event.key,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        code: event.code,
      },
      timestamp: Date.now(),
      canvasName,
    },
    "*"
  );
}
