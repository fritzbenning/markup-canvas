import type { MarkupCanvasConfig } from "@/types/index.js";

export function broadcastEvent(event: string, data: unknown, config: Required<MarkupCanvasConfig>): void {
  if (typeof window === "undefined") {
    return;
  }

  // Receivers can get the instance from the window binding
  let broadcastData = data;

  if (event === "ready") {
    broadcastData = { ready: true };
  }

  window.postMessage(
    {
      source: "markup-canvas",
      event,
      data: broadcastData,
      timestamp: Date.now(),
      canvasName: config.name,
    },
    "*"
  );

  if (window.parent) {
    window.parent.postMessage(
      {
        source: "markup-canvas",
        event,
        data: broadcastData,
        timestamp: Date.now(),
        canvasName: config.name,
      },
      "*"
    );
  }
}
