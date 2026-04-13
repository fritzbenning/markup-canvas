import type { Canvas, MarkupCanvasConfig, Transform } from "@/types/index";

/** Keyboard / discrete pan directions. */
export type PanDirection = "up" | "down" | "left" | "right";

/**
 * Pans the view along one axis by {@link MarkupCanvasConfig.keyboardPanStep}.
 *
 * @param direction - Which way to move the content relative to the viewport.
 * @param canvas - Current canvas state (read for existing translation).
 * @param config - Resolved configuration.
 * @param updateTransform - Applies the new translation.
 * @returns Whether `updateTransform` reported success.
 */
export function pan(
  direction: PanDirection,
  canvas: Canvas,
  config: Required<MarkupCanvasConfig>,
  updateTransform: (newTransform: Partial<Transform>) => boolean
): boolean {
  const panDistance = config.keyboardPanStep;
  const { translateX, translateY } = canvas.transform;

  let newTransform: Partial<Transform>;

  switch (direction) {
    case "up":
      newTransform = { translateY: translateY + panDistance };
      break;
    case "down":
      newTransform = { translateY: translateY - panDistance };
      break;
    case "left":
      newTransform = { translateX: translateX + panDistance };
      break;
    case "right":
      newTransform = { translateX: translateX - panDistance };
      break;
  }

  return updateTransform(newTransform);
}
