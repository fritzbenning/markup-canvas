import { CANVAS_CONTAINER_CLASS } from "@/lib/constants";
import type { MarkupCanvasConfig } from "@/types/index";
import { checkContainerDimensions } from "../utils";

/**
 * Prepares the outer canvas element: positioning, overflow, focusability, optional theme background, and container class.
 * Runs {@link checkContainerDimensions} to surface common sizing mistakes.
 *
 * @param container - Root element for the canvas.
 * @param config - When provided, sets `background-color` from light/dark canvas colors.
 */
export function setupCanvasContainer(container: HTMLElement, config?: Required<MarkupCanvasConfig>): void {
  const currentPosition = getComputedStyle(container).position;
  if (currentPosition === "static") {
    container.style.position = "relative";
  }
  container.style.overflow = "hidden";
  container.style.cursor = "grab";
  container.style.overscrollBehavior = "none";

  // Apply canvas background color using light-dark() CSS function
  if (config) {
    const backgroundColor = `light-dark(${config.canvasBackgroundColor}, ${config.canvasBackgroundColorDark})`;
    container.style.backgroundColor = backgroundColor;
  }

  if (!container.hasAttribute("tabindex")) {
    container.setAttribute("tabindex", "0");
  }

  checkContainerDimensions(container);

  if (!container.classList.contains(CANVAS_CONTAINER_CLASS)) {
    container.classList.add(CANVAS_CONTAINER_CLASS);
  }
}
