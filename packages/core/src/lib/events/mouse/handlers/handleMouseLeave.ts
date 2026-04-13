import { resetDragState } from "@/lib/events/shared/resetDragState";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { MarkupCanvasConfig } from "@/types/index";

/**
 * Ends an in-progress pan drag when the pointer leaves the canvas container (e.g. cursor moved off the element while dragging).
 *
 * @param canvas - Canvas instance.
 * @param config - Resolved config.
 * @param isDragEnabled - Whether drag is enabled.
 * @param isSpacePressed - Space held when using space-to-pan mode.
 * @param isDragging - Whether a drag is currently active.
 * @param setters - Drag state setters passed to {@link resetDragState}.
 *
 * @example
 * ```ts
 * handleMouseLeave(canvas, config, true, false, true, setters);
 * ```
 */
export function handleMouseLeave(
  canvas: MarkupCanvas,
  config: Required<MarkupCanvasConfig>,
  isDragEnabled: boolean,
  isSpacePressed: boolean,
  isDragging: boolean,
  setters: {
    setIsDragging: (value: boolean) => void;
    setDragButton: (value: number) => void;
  },
): void {
  if (isDragging) {
    resetDragState(canvas, config, isDragEnabled, isSpacePressed, setters);
  }
}
