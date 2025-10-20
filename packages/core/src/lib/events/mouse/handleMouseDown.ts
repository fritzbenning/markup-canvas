import { updateCursor } from "@/lib/events/utils/updateCursor.js";
import type { MarkupCanvas } from "@/lib/MarkupCanvas.js";
import type { MarkupCanvasConfig } from "@/types/index.js";

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
  }
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
