import { updateCursor } from "@/lib/events/mouse/cursor/updateCursor";
import { resetDragState } from "@/lib/events/shared/resetDragState";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { MarkupCanvasConfig } from "@/types/index";

/**
 * Handles `keyup` for space-to-pan mode: releasing Space clears the pan modifier, updates the cursor,
 * and if a drag was active, delegates to {@link resetDragState} to end it cleanly.
 *
 * @param event - Key event from the global keyup listener.
 * @param canvas - Canvas instance.
 * @param config - Resolved config; `requireSpaceForMouseDrag` gates behavior.
 * @param isDragEnabled - Whether canvas drag is currently allowed.
 * @param isDragging - Whether a drag is in progress when Space is released.
 * @param setters - State setters for space-pressed and drag button state.
 *
 * @example
 * ```ts
 * handleKeyUp(event, canvas, config, true, isDragging, {
 *   setIsSpacePressed: (v) => { spacePressed = v; },
 *   setIsDragging: setDrag,
 *   setDragButton: setButton,
 * });
 * ```
 */
export function handleKeyUp(
  event: KeyboardEvent,
  canvas: MarkupCanvas,
  config: Required<MarkupCanvasConfig>,
  isDragEnabled: boolean,
  isDragging: boolean,
  setters: {
    setIsSpacePressed: (value: boolean) => void;
    setIsDragging: (value: boolean) => void;
    setDragButton: (value: number) => void;
  },
): void {
  if (config.requireSpaceForMouseDrag && event.key === " ") {
    setters.setIsSpacePressed(false);
    updateCursor(canvas, config, isDragEnabled, false, isDragging);
    // Stop dragging if currently dragging
    if (isDragging) {
      resetDragState(canvas, config, isDragEnabled, false, {
        setIsDragging: setters.setIsDragging,
        setDragButton: setters.setDragButton,
      });
    }
  }
}
