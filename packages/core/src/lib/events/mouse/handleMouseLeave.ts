import { resetDragState } from "@/lib/events/utils/resetDragState.js";
import type { Canvas, MarkupCanvasConfig } from "@/types/index.js";

export function handleMouseLeave(
  canvas: Canvas,
  config: Required<MarkupCanvasConfig>,
  isDragEnabled: boolean,
  isSpacePressed: boolean,
  isDragging: boolean,
  setters: {
    setIsDragging: (value: boolean) => void;
    setDragButton: (value: number) => void;
  }
): void {
  if (isDragging) {
    resetDragState(canvas, config, isDragEnabled, isSpacePressed, setters);
  }
}
