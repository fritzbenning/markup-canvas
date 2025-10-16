import { handleClickToZoom } from "@/lib/events/mouse/handleClickToZoom.js";
import { resetClickState } from "@/lib/events/utils/resetClickState.js";
import { resetDragState } from "@/lib/events/utils/resetDragState.js";
import type { Canvas, MarkupCanvasConfig } from "@/types/index.js";

export function handleMouseUp(
  event: MouseEvent,
  canvas: Canvas,
  config: Required<MarkupCanvasConfig>,
  isDragEnabled: boolean,
  isSpacePressed: boolean,
  isDragging: boolean,
  dragButton: number,
  mouseDownTime: number,
  hasDragged: boolean,
  setters: {
    setIsDragging: (value: boolean) => void;
    setDragButton: (value: number) => void;
    setMouseDownTime: (value: number) => void;
    setHasDragged: (value: boolean) => void;
  }
): void {
  if (isDragging && event.button === dragButton) {
    resetDragState(canvas, config, isDragEnabled, isSpacePressed, {
      setIsDragging: setters.setIsDragging,
      setDragButton: setters.setDragButton,
    });
  }

  if (isDragEnabled && event.button === 0 && config.enableClickToZoom && mouseDownTime > 0) {
    handleClickToZoom(event, canvas, config, mouseDownTime, hasDragged, isDragging);
  }

  if (event.button === 0) {
    resetClickState({
      setMouseDownTime: setters.setMouseDownTime,
      setHasDragged: setters.setHasDragged,
    });
  }
}
