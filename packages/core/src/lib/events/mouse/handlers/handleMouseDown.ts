import { updateCursor } from "@/lib/events/mouse/cursor/updateCursor";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { MarkupCanvasConfig } from "@/types/index";

/**
 * Records left-button press metadata for click-vs-drag detection and, when drag is allowed,
 * prepares pan state (button, last position) and refreshes the cursor before movement starts dragging.
 *
 * @param event - `mousedown` on the canvas container.
 * @param canvas - Canvas instance.
 * @param config - Resolved config (`enableLeftDrag`, `enableMiddleDrag`, `requireSpaceForMouseDrag`).
 * @param isDragEnabled - Whether drag is globally enabled (e.g. not disabled via API).
 * @param isSpacePressed - Space held when space is required for drag.
 * @param setters - Mutable drag / click-tracking state.
 *
 * @example
 * ```ts
 * handleMouseDown(event, canvas, config, true, true, setters);
 * ```
 */
export function handleMouseDown(
  event: MouseEvent,
  canvas: MarkupCanvas,
  config: Required<MarkupCanvasConfig>,
  isDragEnabled: boolean,
  isSpacePressed: boolean,
  setters: {
    setMouseDownTime: (value: number) => void;
    setMouseDownX: (value: number) => void;
    setMouseDownY: (value: number) => void;
    setHasDragged: (value: boolean) => void;
    setIsDragging: (value: boolean) => void;
    setDragButton: (value: number) => void;
    setLastMouseX: (value: number) => void;
    setLastMouseY: (value: number) => void;
  },
): void {
  const isLeftButton = event.button === 0;
  const isMiddleButton = event.button === 1;

  if (isLeftButton) {
    setters.setMouseDownTime(Date.now());
    setters.setMouseDownX(event.clientX);
    setters.setMouseDownY(event.clientY);
    setters.setHasDragged(false);
  }

  if (!isDragEnabled) return;

  // Check if drag is allowed based on configuration
  const canDrag = config.requireSpaceForMouseDrag ? isSpacePressed : true;

  if (canDrag && ((isLeftButton && config.enableLeftDrag) || (isMiddleButton && config.enableMiddleDrag))) {
    event.preventDefault();
    // Don't set isDragging to true yet - wait for mouse move
    setters.setDragButton(event.button);
    setters.setLastMouseX(event.clientX);
    setters.setLastMouseY(event.clientY);

    updateCursor(canvas, config, isDragEnabled, isSpacePressed, false); // ← Changed to false
  }
}
