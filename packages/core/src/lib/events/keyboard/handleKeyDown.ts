import { updateCursor } from "@/lib/events/utils/updateCursor.js";
import type { MarkupCanvas } from "@/lib/MarkupCanvas.js";
import type { MarkupCanvasConfig } from "@/types/index.js";

export function handleKeyDown(
  event: KeyboardEvent,
  canvas: MarkupCanvas,
  config: Required<MarkupCanvasConfig>,
  isDragEnabled: boolean,
  isDragging: boolean,
  setters: {
    setIsSpacePressed: (value: boolean) => void;
  }
): void {
  if (config.requireSpaceForMouseDrag && event.key === " ") {
    setters.setIsSpacePressed(true);
    updateCursor(canvas, config, isDragEnabled, true, isDragging);
  }
}
