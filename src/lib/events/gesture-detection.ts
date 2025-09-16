/**
 * Gesture detection for trackpad and mouse wheel events
 */

import type { GestureInfo } from "../../types/index.js";
import { GESTURE_DETECTION_WEIGHTS, TRACKPAD_THRESHOLDS } from "./constants.js";

/**
 * Detects trackpad gestures vs mouse wheel events
 */
export function detectTrackpadGesture(event: WheelEvent): GestureInfo {
  const result: GestureInfo = {
    isTrackpad: false,
    isTrackpadScroll: false,
    isTrackpadPinch: false,
    isMouseWheel: false,
    isZoomGesture: false,
    confidence: 0,
  };

  // Multiple detection criteria for better accuracy
  const criteria = {
    // Trackpad typically has smaller delta values
    smallDelta: Math.abs(event.deltaY) < TRACKPAD_THRESHOLDS.SMALL_DELTA,
    // Trackpad uses pixel mode (deltaMode === 0)
    pixelMode: event.deltaMode === 0,
    // Trackpad often has fractional values
    fractionalDelta: event.deltaY % 1 !== 0,
    // Pinch gestures always have Ctrl/Cmd modifier
    hasCtrlModifier: event.ctrlKey || event.metaKey,
    // Trackpad scroll often has both X and Y deltas
    hasBothAxes: Math.abs(event.deltaX) > 0 && Math.abs(event.deltaY) > 0,
    // Mouse wheel typically has larger, integer deltas
    largeDelta: Math.abs(event.deltaY) >= TRACKPAD_THRESHOLDS.LARGE_DELTA,
    // Check for wheel delta line mode (mouse wheel characteristic)
    lineMode: event.deltaMode === 1,
  };

  // Calculate trackpad probability
  let trackpadScore = 0;
  if (criteria.smallDelta) trackpadScore += GESTURE_DETECTION_WEIGHTS.SMALL_DELTA;
  if (criteria.pixelMode) trackpadScore += GESTURE_DETECTION_WEIGHTS.PIXEL_MODE;
  if (criteria.fractionalDelta) trackpadScore += GESTURE_DETECTION_WEIGHTS.FRACTIONAL_DELTA;
  if (criteria.hasBothAxes) trackpadScore += GESTURE_DETECTION_WEIGHTS.BOTH_AXES;

  // Calculate mouse wheel probability
  let mouseScore = 0;
  if (criteria.largeDelta) mouseScore += GESTURE_DETECTION_WEIGHTS.LARGE_DELTA;
  if (criteria.lineMode) mouseScore += GESTURE_DETECTION_WEIGHTS.LINE_MODE;
  if (!criteria.hasBothAxes && Math.abs(event.deltaX) < 1)
    mouseScore += GESTURE_DETECTION_WEIGHTS.SINGLE_AXIS;

  // Determine device type
  result.isTrackpad = trackpadScore > mouseScore;
  result.isMouseWheel = mouseScore > trackpadScore;
  result.confidence = Math.max(trackpadScore, mouseScore) / GESTURE_DETECTION_WEIGHTS.MAX_SCORE;

  // Determine gesture type - both trackpad and mouse wheel require Cmd/Ctrl to zoom
  if (result.isTrackpad) {
    if (criteria.hasCtrlModifier) {
      result.isTrackpadPinch = true;
      result.isZoomGesture = true;
    } else {
      result.isTrackpadScroll = true;
      result.isZoomGesture = false;
    }
  } else {
    // Mouse wheel: only zoom with Cmd/Ctrl, otherwise pan
    if (criteria.hasCtrlModifier) {
      result.isZoomGesture = true;
    } else {
      result.isTrackpadScroll = true; // Treat as scroll/pan
      result.isZoomGesture = false;
    }
  }

  return result;
}
