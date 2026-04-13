import { updateCursor } from "@/lib/events/mouse/cursor/updateCursor";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { MarkupCanvasConfig } from "@/types/index";

/**
 * Handles `keydown` for space-to-pan mode: when `requireSpaceForMouseDrag` is enabled,
 * pressing Space marks the pan modifier as active and refreshes the cursor.
 *
 * @param event - Key event from the global keydown listener.
 * @param canvas - Canvas instance passed through to {@link updateCursor}.
 * @param config - Resolved config; `requireSpaceForMouseDrag` gates behavior.
 * @param isDragEnabled - Whether canvas drag is currently allowed.
 * @param isDragging - Whether a drag is in progress (affects cursor style).
 * @param setters - State setters; `setIsSpacePressed(true)` when Space is pressed under the feature flag.
 *
 * @example
 * ```ts
 * handleKeyDown(event, canvas, config, true, false, {
 *   setIsSpacePressed: (v) => { spacePressed = v; },
 * });
 * ```
 */
export function handleKeyDown(
  event: KeyboardEvent,
  canvas: MarkupCanvas,
  config: Required<MarkupCanvasConfig>,
  isDragEnabled: boolean,
  isDragging: boolean,
  setters: {
    setIsSpacePressed: (value: boolean) => void;
  },
): void {
  if (config.requireSpaceForMouseDrag && event.key === " ") {
    setters.setIsSpacePressed(true);
    updateCursor(canvas, config, isDragEnabled, true, isDragging);
  }
}
