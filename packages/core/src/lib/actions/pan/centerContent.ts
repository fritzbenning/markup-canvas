import type { BaseCanvas, MarkupCanvasConfig, Transform } from "@/types/index.js";

export function centerContent(
  baseCanvas: BaseCanvas,
  _config: Required<MarkupCanvasConfig>,
  updateTransform: (newTransform: Partial<Transform>) => boolean
): boolean {
  const bounds = baseCanvas.getBounds();
  const centerX = (bounds.width - bounds.contentWidth * baseCanvas.transform.scale) / 2;
  const centerY = (bounds.height - bounds.contentHeight * baseCanvas.transform.scale) / 2;

  return updateTransform({
    translateX: centerX,
    translateY: centerY,
  });
}
