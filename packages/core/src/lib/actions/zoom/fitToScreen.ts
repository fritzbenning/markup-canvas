import { getCanvasBounds } from "@/lib/canvas";
import { ZOOM_FIT_PADDING } from "@/lib/constants";
import { withClampedZoom } from "@/lib/helpers";
import { updateTransform } from "@/lib/transform/updateTransform";
import { withTransition } from "@/lib/transition/index";
import type { Canvas, MarkupCanvasConfig } from "@/types/index";

/**
 * Fits the configured content dimensions into the current viewport area and centers it, respecting zoom clamps
 * and optional CSS transition wrapping.
 *
 * @param canvas - Canvas whose transform is updated.
 * @param transformLayer - Layer element used for transition styling.
 * @param config - Resolved configuration (content size, zoom limits, transitions).
 * @returns Whether {@link updateTransform} reported success inside the transition callback.
 */
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
