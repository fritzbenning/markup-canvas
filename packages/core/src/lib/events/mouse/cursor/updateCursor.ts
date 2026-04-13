import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { MarkupCanvasConfig } from "@/types/index";

/**
 * Updates the canvas container’s CSS `cursor` from drag mode: disabled → `default`,
 * space-to-pan → `grab`/`default`, otherwise → `grab`/`grabbing` while dragging.
 *
 * @param canvas - Target canvas (mutates `container.style.cursor`).
 * @param config - Resolved config; `requireSpaceForMouseDrag` selects space-to-pan vs grab/grabbing.
 * @param isDragEnabled - When false, cursor is always `default`.
 * @param isSpacePressed - Space held (only used when `requireSpaceForMouseDrag` is true).
 * @param isDragging - Whether a pan drag is active (used when space mode is off).
 *
 * @example
 * ```ts
 * updateCursor(canvas, config, true, false, false);
 * // container.style.cursor is "grab" or "default" depending on config
 * ```
 */
export function updateCursor(
  canvas: MarkupCanvas,
  config: Required<MarkupCanvasConfig>,
  isDragEnabled: boolean,
  isSpacePressed: boolean,
  isDragging: boolean,
): void {
  if (!isDragEnabled) {
    canvas.container.style.cursor = "default";

    return;
  }

  if (config.requireSpaceForMouseDrag) {
    canvas.container.style.cursor = isSpacePressed ? "grab" : "default";
  } else {
    canvas.container.style.cursor = isDragging ? "grabbing" : "grab";
  }
}
