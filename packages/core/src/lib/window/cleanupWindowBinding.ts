import type { MarkupCanvasConfig } from "@/types/index.js";

export function cleanupWindowBinding(config: Required<MarkupCanvasConfig>): void {
  if (typeof window === "undefined") {
    return;
  }

  const canvasName = config.name || "markupCanvas";
  const windowObj = window as unknown as Record<string, unknown>;

  delete windowObj[canvasName];
  if (windowObj.__markupCanvasInstances) {
    (windowObj.__markupCanvasInstances as unknown as Map<string, unknown>).delete(canvasName);
  }
}
