/**
 * CSS transition management functions
 */

import { DEFAULT_TRANSITION_DURATION, SMOOTH_EASING } from "./constants.js";

/**
 * Creates a CSS transition value string
 */
function createTransitionValue(duration: number, easing: string): string {
  return `transform ${duration}s ${easing}`;
}

/**
 * Enables smooth transitions on transform layer
 */
export function enableSmoothTransitions(
  element: HTMLElement,
  duration: number = DEFAULT_TRANSITION_DURATION,
): boolean {
  try {
    const transitionValue = createTransitionValue(duration, SMOOTH_EASING);
    element.style.transition = transitionValue;
    return true;
  } catch (error) {
    console.error("Failed to enable smooth transitions:", error);
    return false;
  }
}

/**
 * Disables smooth transitions on transform layer for real-time operations
 */
export function disableSmoothTransitions(element: HTMLElement): boolean {
  try {
    element.style.transition = "none";
    return true;
  } catch (error) {
    console.error("Failed to disable smooth transitions:", error);
    return false;
  }
}
