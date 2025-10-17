import { TRACKPAD_PINCH_SPEED_FACTOR } from "@/lib/events/constants.js";
import { detectTrackpadGesture } from "@/lib/events/trackpad/detectTrackpadGesture.js";
import { getAdaptiveZoomSpeed } from "@/lib/events/utils/getAdaptiveZoomSpeed.js";
import { withRulerOffset } from "@/lib/helpers/index.js";
import { applyZoomToCanvas } from "@/lib/transform/applyZoomToCanvas.js";
import type { Canvas, MarkupCanvasConfig } from "@/types/index.js";

export function handleWheel(event: WheelEvent, canvas: Canvas, config: Required<MarkupCanvasConfig>): boolean {
  if (!event || typeof event.deltaY !== "number") {
    console.warn("Invalid wheel event provided");
    return false;
  }

  if (!canvas?.updateTransform) {
    console.warn("Invalid canvas provided to handleWheelEvent");
    return false;
  }

  try {
    event.preventDefault();

    // Get mouse position
    const rect = canvas.container.getBoundingClientRect();
    const rawMouseX = event.clientX - rect.left;
    const rawMouseY = event.clientY - rect.top;

    // Account for ruler offset
    const { mouseX, mouseY } = withRulerOffset(canvas, rawMouseX, rawMouseY, config.rulerSize, (adjustedX, adjustedY) => ({
      mouseX: adjustedX,
      mouseY: adjustedY,
    }));

    // Use the standard zoom speed
    const baseZoomSpeed = config.zoomSpeed;

    // Simple gesture detection
    const gestureInfo = detectTrackpadGesture(event);

    if (!gestureInfo.isZoomGesture) {
      // Not a zoom gesture, ignore
      return false;
    }

    // Apply display-size adaptive scaling if enabled
    const currentZoomSpeed = config.enableAdaptiveSpeed ? getAdaptiveZoomSpeed(canvas, baseZoomSpeed) : baseZoomSpeed;

    // Simple device-based zoom speed adjustment
    let deviceZoomSpeed = currentZoomSpeed;

    if (gestureInfo.isTrackpadPinch) {
      const baseTrackpadSpeed = config.zoomSpeed * TRACKPAD_PINCH_SPEED_FACTOR;

      deviceZoomSpeed = config.enableAdaptiveSpeed ? getAdaptiveZoomSpeed(canvas, baseTrackpadSpeed) : baseTrackpadSpeed;
    }

    // Calculate zoom delta
    const zoomDirection = event.deltaY < 0 ? 1 : -1;

    // Use exponential zoom for more natural feel
    const rawZoomMultiplier = zoomDirection > 0 ? 1 + deviceZoomSpeed : 1 / (1 + deviceZoomSpeed);

    return applyZoomToCanvas(canvas, rawZoomMultiplier, mouseX, mouseY);
  } catch (error) {
    console.error("Error handling wheel event:", error);
    return false;
  }
}
