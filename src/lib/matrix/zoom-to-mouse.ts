import type { Transform } from "../../types/index.js";
import {
  DEFAULT_TRANSLATE_X,
  DEFAULT_TRANSLATE_Y,
  DEFAULT_ZOOM,
  ZOOM_CHANGE_THRESHOLD,
} from "../constants.js";
import { clampZoom } from "./zoom-clamping.js";

// Calculates zoom-to-mouse transformation
export function getZoomToMouseTransform(
  mouseX: number,
  mouseY: number,
  currentTransform: Transform,
  zoomDelta: number,
): Transform {
  // Validate inputs
  if (typeof mouseX !== "number" || !Number.isFinite(mouseX)) mouseX = 0;
  if (typeof mouseY !== "number" || !Number.isFinite(mouseY)) mouseY = 0;
  if (typeof zoomDelta !== "number" || !Number.isFinite(zoomDelta)) zoomDelta = 1.0;

  if (!currentTransform || typeof currentTransform !== "object") {
    currentTransform = {
      scale: DEFAULT_ZOOM,
      translateX: DEFAULT_TRANSLATE_X,
      translateY: DEFAULT_TRANSLATE_Y,
    };
  }

  const { scale: currentScale, translateX: currentTx, translateY: currentTy } = currentTransform;

  // Calculate new zoom
  const newScale = clampZoom(currentScale * zoomDelta);

  // If zoom didn't change (hit bounds), return current transform
  if (Math.abs(newScale - currentScale) < ZOOM_CHANGE_THRESHOLD) {
    return {
      scale: currentScale,
      translateX: currentTx,
      translateY: currentTy,
    };
  }

  // Calculate the point in content space that should remain under the mouse
  // Use direct calculation instead of matrix inversion for better precision
  const contentX = (mouseX - currentTx) / currentScale;
  const contentY = (mouseY - currentTy) / currentScale;

  // Calculate new translation to keep the content point under the mouse
  // Formula: newTranslate = mouse - (content * newScale)
  const newTx = mouseX - contentX * newScale;
  const newTy = mouseY - contentY * newScale;

  return {
    scale: newScale,
    translateX: newTx,
    translateY: newTy,
  };
}
