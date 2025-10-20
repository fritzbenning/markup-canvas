import type { MarkupCanvasConfig } from "@/types/index.js";

export function setupGlobalBinding(canvas: { config: Required<MarkupCanvasConfig> }, config: Required<MarkupCanvasConfig>): void {
  if (typeof window === "undefined") {
    return;
  }

  const canvasName = config.name || "markupCanvas";
  const windowObj = window as unknown as Record<string, unknown>;

  // Bind instance to window
  windowObj[canvasName] = canvas;

  // Track all instances
  if (!windowObj.__markupCanvasInstances) {
    windowObj.__markupCanvasInstances = new Map();
  }
  (windowObj.__markupCanvasInstances as unknown as Map<string, unknown>).set(canvasName, canvas);
}
