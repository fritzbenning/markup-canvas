export function enableHardwareAcceleration(element: HTMLElement): boolean {
  try {
    // Set CSS properties for hardware acceleration
    element.style.transform = element.style.transform || "translateZ(0)";
    element.style.backfaceVisibility = "hidden";
    return true;
  } catch (error) {
    console.error("Failed to enable hardware acceleration:", error);
    return false;
  }
}
