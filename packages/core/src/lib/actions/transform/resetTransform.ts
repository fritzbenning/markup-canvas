import type { BaseCanvas, MarkupCanvasConfig, Transform } from "@/types/index.js";
import { updateTransform } from "./updateTransform.js";

export function resetTransform(baseCanvas: BaseCanvas, config: Required<MarkupCanvasConfig>): boolean {
  const resetTransformData: Transform = {
    scale: 1.0,
    translateX: 0,
    translateY: 0,
  };
  return updateTransform(baseCanvas, config, resetTransformData);
}
