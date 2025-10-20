import { updateTransform } from "@/lib/actions/transform/updateTransform.js";
import { getCanvasBounds } from "@/lib/canvas/getCanvasBounds.js";
import { ZOOM_FIT_PADDING } from "@/lib/constants.js";
import { withClampedZoom } from "@/lib/helpers/index.js";
import { withTransition } from "@/lib/transition/index.js";
import type { Canvas, MarkupCanvasConfig } from "@/types/index.js";

export function fitToScreen(canvas: Canvas, transformLayer: HTMLElement, config: Required<MarkupCanvasConfig>): boolean {
  return withTransition(transformLayer, config, () => {
    const bounds = getCanvasBounds(canvas, config);
    const scaleX = bounds.width / config.width;
    const scaleY = bounds.height / config.height;
    const fitScale = withClampedZoom(config, (clamp) => clamp(Math.min(scaleX, scaleY) * ZOOM_FIT_PADDING));

    // Center the content
    const scaledWidth = config.width * fitScale;
    const scaledHeight = config.height * fitScale;
    const centerX = (bounds.width - scaledWidth) / 2;
    const centerY = (bounds.height - scaledHeight) / 2;

    return updateTransform(canvas, {
      scale: fitScale,
      translateX: centerX,
      translateY: centerY,
    });
  });
}
