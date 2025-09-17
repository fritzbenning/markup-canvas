import { EASING, TRANSITION_DURATION } from "../constants";

// Enables smooth transitions on transform layer
export function enableSmoothTransitions(
  element: HTMLElement,
  duration: number = TRANSITION_DURATION,
): boolean {
  try {
    element.style.transition = `transform ${duration}s ${EASING}`;
    return true;
  } catch (error) {
    console.error("Failed to enable smooth transitions:", error);
    return false;
  }
}

// Disables smooth transitions on transform layer for real-time operations
export function disableSmoothTransitions(element: HTMLElement): boolean {
  try {
    element.style.transition = "none";
    return true;
  } catch (error) {
    console.error("Failed to disable smooth transitions:", error);
    return false;
  }
}
