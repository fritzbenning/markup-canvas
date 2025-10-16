import { resetDragState } from "@/lib/events/utils/resetDragState.js";
import { updateCursor } from "@/lib/events/utils/updateCursor.js";
import type { Canvas, MarkupCanvasConfig } from "@/types/index.js";

export function handleKeyUp(
  event: KeyboardEvent,
  canvas: Canvas,
  config: Required<MarkupCanvasConfig>,
  isDragEnabled: boolean,
  isDragging: boolean,
  setters: {
    setIsSpacePressed: (value: boolean) => void;
    setIsDragging: (value: boolean) => void;
    setDragButton: (value: number) => void;
  }
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
