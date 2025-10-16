import type { Canvas, MarkupCanvasConfig } from "@/types/index.js";

export function updateCursor(
  canvas: Canvas,
  config: Required<MarkupCanvasConfig>,
  isDragEnabled: boolean,
  isSpacePressed: boolean,
  isDragging: boolean
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
