import { TRACKPAD_PINCH_SPEED_FACTOR } from "@/lib/events/constants";
import { getAdaptiveZoomSpeed } from "@/lib/events/shared/getAdaptiveZoomSpeed";
import { detectTrackpadGesture } from "@/lib/events/trackpad/detectTrackpadGesture";
import { withRulerOffset } from "@/lib/helpers";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import { applyZoomToCanvas } from "@/lib/transform/applyZoomToCanvas";
import type { MarkupCanvasConfig } from "@/types/index";

/**
 * Handles mouse-wheel and trackpad-pinch zoom when {@link detectTrackpadGesture} reports a zoom gesture (`ctrl`/`meta` + wheel).
 *
 * Maps wheel position into content coordinates with {@link withRulerOffset}, optionally scales speed via {@link getAdaptiveZoomSpeed}, uses a smaller step when pinch-zoom is detected (`isTrackpadPinch`), and applies zoom through {@link applyZoomToCanvas}. Non-zoom wheel events return `false` after `preventDefault` (caller may still want to block default scrolling).
 *
 * @param event - Wheel event (`clientX` / `clientY`, `deltaY`, modifiers).
 * @param canvas - Target canvas; must expose `container`, `transform`, and `updateTransform`.
 * @param config - Resolved config (`zoomSpeed`, `rulerSize`, `enableAdaptiveSpeed`).
 * @returns Result of {@link applyZoomToCanvas} on success, or `false` when input is invalid or the gesture is not a zoom.
 */
export function handleWheel(
  event: WheelEvent,
  canvas: MarkupCanvas,
  config: Required<MarkupCanvasConfig>,
): boolean {
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
    const { mouseX, mouseY } = withRulerOffset(
      canvas,
      rawMouseX,
      rawMouseY,
      config.rulerSize,
      (adjustedX, adjustedY) => ({
        mouseX: adjustedX,
        mouseY: adjustedY,
      }),
    );

    // Use the standard zoom speed
    const baseZoomSpeed = config.zoomSpeed;

    // Simple gesture detection
    const gestureInfo = detectTrackpadGesture(event);

    if (!gestureInfo.isZoomGesture) {
      // Not a zoom gesture, ignore
      return false;
    }

    // Apply display-size adaptive scaling if enabled
    const currentZoomSpeed = config.enableAdaptiveSpeed
      ? getAdaptiveZoomSpeed(canvas, baseZoomSpeed)
      : baseZoomSpeed;

    // Simple device-based zoom speed adjustment
    let deviceZoomSpeed = currentZoomSpeed;

    if (gestureInfo.isTrackpadPinch) {
      const baseTrackpadSpeed = config.zoomSpeed * TRACKPAD_PINCH_SPEED_FACTOR;

      deviceZoomSpeed = config.enableAdaptiveSpeed
        ? getAdaptiveZoomSpeed(canvas, baseTrackpadSpeed)
        : baseTrackpadSpeed;
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
