/**
 * Hardware acceleration utilities
 */

import { HARDWARE_ACCELERATION_TRANSFORM } from "./constants.js";

/**
 * Enables hardware acceleration hints on an element
 */
export function enableHardwareAcceleration(element: HTMLElement): boolean {
	try {
		// Set CSS properties for hardware acceleration
		element.style.transform =
			element.style.transform || HARDWARE_ACCELERATION_TRANSFORM;
		element.style.backfaceVisibility = "hidden";
		return true;
	} catch (error) {
		console.error("Failed to enable hardware acceleration:", error);
		return false;
	}
}
