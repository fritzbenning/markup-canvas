import type { MarkupCanvasConfig } from "@/types/index";

/**
 * Removes the global {@link WindowAPI} installed by {@link bindCanvasToWindow} for this instance:
 * deletes `window[config.name]` (default `"markupCanvas"`) and the matching entry from
 * `window.__markupCanvasInstances` when present.
 *
 * No-ops when `window` is undefined (SSR / non-browser).
 *
 * @param config - Resolved config; `name` must match the binding to remove.
 */
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
