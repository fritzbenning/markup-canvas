import type { Canvas, Transform } from "@/types/index.js";
import { updateTransform } from "./updateTransform.js";

export function resetTransform(canvas: Canvas): boolean {
  const resetTransformData: Transform = {
    scale: 1.0,
    translateX: 0,
    translateY: 0,
  };
  return updateTransform(canvas, resetTransformData);
}
