import type { AddContentOptions, BaseCanvas, Transform } from "../../types/index.js";
import {
  DEFAULT_ANIMATION_DURATION,
  RULER_SIZE,
  TRANSITION_CLEANUP_DELAY,
  ZOOM_FIT_PADDING,
} from "../constants.js";
import { canvasToContent } from "../matrix/coordinate-conversion.js";
import { calculateMatrix } from "../matrix/matrix-calculation.js";
import { clampZoom } from "../matrix/zoom-clamping.js";
import { getZoomToMouseTransform } from "../matrix/zoom-to-mouse.js";
import { applyTransform, disableSmoothTransitions, enableSmoothTransitions } from "../transform/index.js";
import { getCanvasBounds } from "./bounds.js";
import { addContentToCanvas } from "./content.js";

// Creates all the methods that will be attached to a canvas instance
export function createCanvasMethods() {
  return {
    // Utility methods
    getBounds: function (this: BaseCanvas) {
      return getCanvasBounds(this);
    },

    addContent: function (this: BaseCanvas, element: HTMLElement, options?: AddContentOptions) {
      return addContentToCanvas(this, element, options);
    },

    // Transform methods
    updateTransform: function (this: BaseCanvas, newTransform: Partial<Transform>) {
      this.transform = { ...this.transform, ...newTransform };
      const matrix = calculateMatrix(
        this.transform.scale,
        this.transform.translateX,
        this.transform.translateY,
      );
      const result = applyTransform(this.transformLayer, matrix);

      // Call update callback if provided
      if (this.config.onTransformUpdate) {
        this.config.onTransformUpdate(this.transform);
      }

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
      // Update canvas bounds and ensure proper dimensions
      const newRect = this.container.getBoundingClientRect();
      console.log("Canvas resized:", {
        width: newRect.width,
        height: newRect.height,
      });

      // Trigger any necessary updates for the new dimensions
      return true;
    },

    // Set zoom level
    setZoom: function (this: BaseCanvas, zoomLevel: number) {
      const newScale = clampZoom(zoomLevel);
      return this.updateTransform({ scale: newScale });
    },

    // Set interaction mode (placeholder for demo compatibility)
    setInteractionMode: function (this: BaseCanvas, mode: string) {
      console.log("Interaction mode set to:", mode);
      return true;
    },

    // Convert canvas coordinates to content coordinates
    canvasToContent: function (this: BaseCanvas, x: number, y: number) {
      const matrix = calculateMatrix(
        this.transform.scale,
        this.transform.translateX,
        this.transform.translateY,
      );
      return canvasToContent(x, y, matrix);
    },

    // Zoom to a specific point with animation
    zoomToPoint: function (
      this: BaseCanvas,
      x: number,
      y: number,
      targetScale: number,
      duration = DEFAULT_ANIMATION_DURATION,
    ) {
      // Enable smooth transitions for programmatic zoom
      enableSmoothTransitions(this.transformLayer, duration / 1000);

      const newTransform = getZoomToMouseTransform(x, y, this.transform, targetScale / this.transform.scale);

      const result = this.updateTransform(newTransform);

      // Disable transitions after animation completes
      setTimeout(() => {
        if (this.transformLayer) {
          disableSmoothTransitions(this.transformLayer);
        }
      }, duration + TRANSITION_CLEANUP_DELAY);

      return result;
    },

    // Reset view with animation
    resetView: function (this: BaseCanvas, duration = DEFAULT_ANIMATION_DURATION) {
      // Enable smooth transitions for reset
      enableSmoothTransitions(this.transformLayer, duration / 1000);

      const resetTransform: Transform = {
        scale: 1.0,
        translateX: RULER_SIZE * -1,
        translateY: RULER_SIZE * -1,
      };
      const result = this.updateTransform(resetTransform);

      // Disable transitions after animation completes
      setTimeout(() => {
        if (this.transformLayer) {
          disableSmoothTransitions(this.transformLayer);
        }
      }, duration + TRANSITION_CLEANUP_DELAY);

      return result;
    },

    // Zoom to fit content in canvas
    zoomToFitContent: function (this: BaseCanvas, duration = DEFAULT_ANIMATION_DURATION) {
      // Enable smooth transitions for zoom to fit
      enableSmoothTransitions(this.transformLayer, duration / 1000);

      const bounds = this.getBounds();
      const scaleX = bounds.width / this.config.width;
      const scaleY = bounds.height / this.config.height;
      const fitScale = clampZoom(Math.min(scaleX, scaleY) * ZOOM_FIT_PADDING);

      // Center the content
      const scaledWidth = this.config.width * fitScale;
      const scaledHeight = this.config.height * fitScale;
      const centerX = (bounds.width - scaledWidth) / 2;
      const centerY = (bounds.height - scaledHeight) / 2;

      const result = this.updateTransform({
        scale: fitScale,
        translateX: centerX,
        translateY: centerY,
      });

      // Disable transitions after animation completes
      setTimeout(() => {
        if (this.transformLayer) {
          disableSmoothTransitions(this.transformLayer);
        }
      }, duration + TRANSITION_CLEANUP_DELAY);

      return result;
    },
  };
}
