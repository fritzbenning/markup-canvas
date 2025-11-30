export function enableHardwareAcceleration(element: HTMLElement): boolean {
  try {
    // Set CSS properties for hardware acceleration
    // Use translate3d(0,0,0) instead of translateZ(0) for better Safari compatibility
    element.style.transform = element.style.transform || "translate3d(0, 0, 0)";
    element.style.backfaceVisibility = "hidden";
    element.style.webkitBackfaceVisibility = "hidden";
    return true;
  } catch (error) {
    console.error("Failed to enable hardware acceleration:", error);
    return false;
  }
}
