import type { Transform, RulerCanvas as Canvas } from "../../types/index.js";

// Set up event listeners for ruler updates
export function setupEventListeners(canvas: Canvas, updateCallback: () => void): () => void {
  // Listen for canvas transform updates
  const originalUpdateTransform = canvas.updateTransform;
  canvas.updateTransform = function (newTransform: Partial<Transform>): boolean {
    const result = originalUpdateTransform.call(this, newTransform);
    updateCallback();
    return result;
  };

  // Listen for window resize
  const resizeHandler = (): void => {
    setTimeout(updateCallback, 100);
  };
  window.addEventListener("resize", resizeHandler);

  // Return cleanup function
  return () => {
    window.removeEventListener("resize", resizeHandler);
    canvas.updateTransform = originalUpdateTransform;
  };
}
