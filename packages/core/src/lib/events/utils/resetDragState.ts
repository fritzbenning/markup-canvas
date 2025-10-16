import { updateCursor } from "@/lib/events/utils/updateCursor.js";
import type { Canvas, MarkupCanvasConfig } from "@/types/index.js";

export function resetDragState(
  canvas: Canvas,
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
