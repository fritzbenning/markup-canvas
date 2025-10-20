import { getCanvasBounds } from "@/lib/canvas/getCanvasBounds.js";
import { ZOOM_FIT_PADDING } from "@/lib/constants.js";
import { withClampedZoom, withFeatureEnabled, withRulerSize } from "@/lib/helpers/index.js";
import { canvasToContent } from "@/lib/matrix/canvasToContent.js";
import { createMatrix } from "@/lib/matrix/createMatrix.js";
import { getZoomToMouseTransform } from "@/lib/matrix/getZoomToMouseTransform.js";
import { applyTransform } from "@/lib/transform/index.js";
import { withTransition } from "@/lib/transition/index.js";
import type { BaseCanvas, Transform } from "@/types/index.js";

export function getCanvasMethods() {
  return {
    // Utility methods
    getBounds: function (this: BaseCanvas) {
      return getCanvasBounds(this);
    },

    // Transform methods
    updateTransform: function (this: BaseCanvas, newTransform: Partial<Transform>) {
      this.transform = { ...this.transform, ...newTransform };
      const matrix = createMatrix(this.transform.scale, this.transform.translateX, this.transform.translateY);
      const result = applyTransform(this.transformLayer, matrix);

      withFeatureEnabled(this.config, "onTransformUpdate", () => {
        this.config.onTransformUpdate!(this.transform);
      });

      return result;
    },

    // Reset method
    reset: function (this: BaseCanvas) {
      const resetTransform: Transform = {
        scale: 1.0,
        translateX: 0,
        translateY: 0,
      };
      return this.updateTransform(resetTransform);
    },

    // Handle canvas resize
    handleResize: function (this: BaseCanvas) {
      return true;
    },

    // Set zoom level
    setZoom: function (this: BaseCanvas, zoomLevel: number) {
      const newScale = withClampedZoom(this.config, (clamp) => clamp(zoomLevel));
      return this.updateTransform({ scale: newScale });
    },

    // Convert canvas coordinates to content coordinates
    canvasToContent: function (this: BaseCanvas, x: number, y: number) {
      const matrix = createMatrix(this.transform.scale, this.transform.translateX, this.transform.translateY);
      return canvasToContent(x, y, matrix);
    },

    // Zoom to a specific point with animation
    zoomToPoint: function (this: BaseCanvas, x: number, y: number, targetScale: number) {
      return withTransition(this.transformLayer, this.config, () => {
        const newTransform = getZoomToMouseTransform(x, y, this.transform, targetScale / this.transform.scale, this.config);
        return this.updateTransform(newTransform);
      });
    },

    // Reset view with animation
    resetView: function (this: BaseCanvas) {
      return withTransition(this.transformLayer, this.config, () => {
        return withRulerSize(this, this.config.rulerSize, (rulerSize) => {
          const resetTransform: Transform = {
            scale: 1.0,
            translateX: rulerSize * -1,
            translateY: rulerSize * -1,
          };
          return this.updateTransform(resetTransform);
        });
      });
    },

    // Zoom to fit content in canvas
    fitToScreen: function (this: BaseCanvas) {
      return withTransition(this.transformLayer, this.config, () => {
        const bounds = this.getBounds();
        const scaleX = bounds.width / this.config.width;
        const scaleY = bounds.height / this.config.height;
        const fitScale = withClampedZoom(this.config, (clamp) => clamp(Math.min(scaleX, scaleY) * ZOOM_FIT_PADDING));

        // Center the content
        const scaledWidth = this.config.width * fitScale;
        const scaledHeight = this.config.height * fitScale;
        const centerX = (bounds.width - scaledWidth) / 2;
        const centerY = (bounds.height - scaledHeight) / 2;

        return this.updateTransform({
          scale: fitScale,
          translateX: centerX,
          translateY: centerY,
        });
      });
    },
  };
}
