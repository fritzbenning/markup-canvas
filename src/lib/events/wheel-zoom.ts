/**
 * Wheel zoom functionality for canvas
 */

import { getZoomToMouseTransform } from "../matrix/zoom-to-mouse.js";
import { disableSmoothTransitions, enableSmoothTransitions } from "../transform/index.js";
import type { EventCanvas as Canvas, WheelZoomOptions, Transform } from "../../types/index.js";
import { DEFAULT_WHEEL_ZOOM_CONFIG, TRACKPAD_THRESHOLDS } from "./constants.js";
import { getAdaptiveZoomSpeed } from "./adaptive-speed.js";
import { detectTrackpadGesture } from "./gesture-detection.js";

/**
 * Handles trackpad pan gestures
 */
function handleTrackpadPan(event: WheelEvent, canvas: Canvas): boolean {
  if (!event || !canvas?.updateTransform) {
    return false;
  }

  try {
    // Get current transform
    const currentTransform = canvas.transform;

    // Calculate pan delta based on trackpad scroll
    const panSensitivity = 1.0;
    const deltaX = event.deltaX * panSensitivity;
    const deltaY = event.deltaY * panSensitivity;

    // Apply pan by adjusting translation
    const newTransform: Partial<Transform> = {
      scale: currentTransform.scale,
      translateX: currentTransform.translateX - deltaX,
      translateY: currentTransform.translateY - deltaY,
    };

    // Disable smooth transitions for real-time panning
    disableSmoothTransitions(canvas.transformLayer);

    // Apply the new transform
    return canvas.updateTransform(newTransform);
  } catch (error) {
    console.error("Error handling trackpad pan:", error);
    return false;
  }
}

/**
 * Handles wheel events for zooming
 */
function handleWheel(event: WheelEvent, canvas: Canvas, config: Required<WheelZoomOptions>): boolean {
  // Validate inputs
  if (!event || typeof event.deltaY !== "number") {
    console.warn("Invalid wheel event provided");
    return false;
  }

  if (!canvas?.updateTransform) {
    console.warn("Invalid canvas provided to handleWheelEvent");
    return false;
  }

  try {
    // Prevent default scrolling behavior
    event.preventDefault();

    // Get mouse position relative to canvas
    const rect = canvas.container.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Determine base zoom speed based on modifier keys
    const isCtrlPressed = event.ctrlKey || event.metaKey;
    const baseZoomSpeed = isCtrlPressed ? config.fineZoomSpeed : config.zoomSpeed;

    // Apply display-size adaptive scaling if enabled
    const currentZoomSpeed = config.enableAdaptiveSpeed
      ? getAdaptiveZoomSpeed(canvas, baseZoomSpeed)
      : baseZoomSpeed;

    // Calculate zoom delta based on wheel direction with exponential scaling
    const zoomDirection = event.deltaY < 0 ? 1 : -1;

    // Enhanced trackpad detection using multiple criteria
    const gestureInfo = detectTrackpadGesture(event);

    // Handle different gesture types
    if (gestureInfo.isTrackpadScroll) {
      // Handle trackpad scroll as pan
      return handleTrackpadPan(event, canvas);
    }

    if (!gestureInfo.isZoomGesture) {
      // Not a zoom gesture, ignore
      return false;
    }

    // Adjust zoom speed based on detected gesture type
    let deviceZoomSpeed = currentZoomSpeed;

    if (gestureInfo.isTrackpadPinch) {
      // Trackpad pinch-to-zoom needs slower speed, but still apply adaptive scaling
      const baseTrackpadSpeed = config.zoomSpeed * TRACKPAD_THRESHOLDS.PINCH_SPEED_MULTIPLIER;
      deviceZoomSpeed = config.enableAdaptiveSpeed
        ? getAdaptiveZoomSpeed(canvas, baseTrackpadSpeed)
        : baseTrackpadSpeed;
    } else if (gestureInfo.isMouseWheel) {
      // Mouse wheel uses the already calculated adaptive speed
      deviceZoomSpeed = currentZoomSpeed;
    }

    // Apply confidence-based adjustment for uncertain detections
    if (gestureInfo.confidence < TRACKPAD_THRESHOLDS.CONFIDENCE_THRESHOLD) {
      // Lower confidence, use more conservative speed
      deviceZoomSpeed *= TRACKPAD_THRESHOLDS.LOW_CONFIDENCE_MULTIPLIER;
    }

    // Use exponential zoom for more natural feel
    const zoomMultiplier = zoomDirection > 0 ? 1 + deviceZoomSpeed : 1 / (1 + deviceZoomSpeed);
    const zoomFactor = zoomMultiplier;

    // Get current transform state
    const currentTransform = canvas.transform;

    // Calculate new transform using zoom-to-mouse algorithm
    const newTransform = getZoomToMouseTransform(mouseX, mouseY, currentTransform, zoomFactor);

    // Check if zoom actually changed (might be at bounds)
    if (Math.abs(newTransform.scale - currentTransform.scale) < 0.001) {
      // At zoom bounds, no change needed
      return false;
    }

    // Enable smooth transitions for zoom operations
    enableSmoothTransitions(canvas.transformLayer, 0.15);

    // Apply the new transform with smooth transition
    const result = canvas.updateTransform(newTransform);

    // Disable transitions after a short delay to avoid interfering with subsequent operations
    setTimeout(() => {
      if (canvas.transformLayer) {
        disableSmoothTransitions(canvas.transformLayer);
      }
    }, 200);

    return result;
  } catch (error) {
    console.error("Error handling wheel event:", error);
    return false;
  }
}

/**
 * Sets up wheel zoom functionality for a canvas
 */
export function setupWheelZoom(canvas: Canvas, options: WheelZoomOptions = {}): () => void {
  const config: Required<WheelZoomOptions> = {
    ...DEFAULT_WHEEL_ZOOM_CONFIG,
    ...options,
  };

  const wheelHandler = (event: WheelEvent) => handleWheel(event, canvas, config);

  canvas.container.addEventListener("wheel", wheelHandler, { passive: false });

  return () => {
    canvas.container.removeEventListener("wheel", wheelHandler);
  };
}
