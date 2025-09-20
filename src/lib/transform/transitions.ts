import { EASING, TRANSITION_DURATION } from "../constants";
import { rafScheduler, rafTimeout } from "../utils/raf-scheduler.js";

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

// RAF-optimized transition management
export function enableSmoothTransitionsRAF(
  element: HTMLElement,
  duration: number = TRANSITION_DURATION,
): boolean {
  rafScheduler.schedule(() => {
    try {
      element.style.transition = `transform ${duration}s ${EASING}`;
    } catch (error) {
      console.error("Failed to enable smooth transitions:", error);
    }
  });
  return true;
}

export function disableSmoothTransitionsRAF(element: HTMLElement): boolean {
  rafScheduler.schedule(() => {
    try {
      element.style.transition = "none";
    } catch (error) {
      console.error("Failed to disable smooth transitions:", error);
    }
  });
  return true;
}

// RAF-based transition cleanup with precise timing
export function scheduleTransitionCleanup(element: HTMLElement, delay: number): void {
  rafTimeout(() => {
    disableSmoothTransitionsRAF(element);
  }, delay);
}
