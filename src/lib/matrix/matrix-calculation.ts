import { DEFAULT_TRANSLATE_X, DEFAULT_TRANSLATE_Y, DEFAULT_ZOOM } from "../constants";

// Calculates a transformation matrix for scale and translation
export function calculateMatrix(scale: number, translateX: number, translateY: number): DOMMatrix {
  // Validate inputs and use fallback values if invalid
  if (typeof scale !== "number" || !Number.isFinite(scale) || scale <= 0) {
    scale = DEFAULT_ZOOM;
  }
  if (typeof translateX !== "number" || !Number.isFinite(translateX)) {
    translateX = DEFAULT_TRANSLATE_X;
  }
  if (typeof translateY !== "number" || !Number.isFinite(translateY)) {
    translateY = DEFAULT_TRANSLATE_Y;
  }

  // Create matrix using proper 2D transformation format
  // DOMMatrix constructor expects [a, b, c, d, e, f] for 2D transforms
  // where: a=scaleX, b=skewY, c=skewX, d=scaleY, e=translateX, f=translateY
  return new DOMMatrix([scale, 0, 0, scale, translateX, translateY]);
}

// Creates a fallback identity matrix for error recovery
export function createIdentityMatrix(): DOMMatrix {
  return new DOMMatrix([1, 0, 0, 1, 0, 0]);
}
