import { updateCursor } from "@/lib/events/mouse/cursor/updateCursor";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { MarkupCanvasConfig } from "@/types/index";

/**
 * Ends an active pan drag: clears drag flags and refreshes the container cursor so it no longer shows “grabbing”.
 *
 * @param canvas - Target canvas (passed through to {@link updateCursor} for `container.style.cursor`).
 * @param config - Resolved config; same semantics as {@link updateCursor}.
 * @param isDragEnabled - Whether mouse drag panning is allowed (cursor rules).
 * @param isSpacePressed - Space held when using space-to-pan mode.
 * @param setters - Updates local drag state (`isDragging` → `false`, `dragButton` → `-1`).
 */
export function resetDragState(
  canvas: MarkupCanvas,
  config: Required<MarkupCanvasConfig>,
  isDragEnabled: boolean,
  isSpacePressed: boolean,
  setters: {
    setIsDragging: (value: boolean) => void;
    setDragButton: (value: number) => void;
  }
): void {
  setters.setIsDragging(false);
  setters.setDragButton(-1);

  updateCursor(canvas, config, isDragEnabled, isSpacePressed, false);
}
