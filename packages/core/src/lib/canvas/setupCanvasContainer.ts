import { checkContainerDimensions } from "@/lib/canvas/checkContainerDimensions";
import { CANVAS_CONTAINER_CLASS } from "@/lib/constants";
import { withTheme } from "@/lib/helpers/index.js";
import type { MarkupCanvasConfig } from "@/types/index.js";

export function setupCanvasContainer(container: HTMLElement, config?: Required<MarkupCanvasConfig>): void {
  const currentPosition = getComputedStyle(container).position;
  if (currentPosition === "static") {
    container.style.position = "relative";
  }
  container.style.overflow = "hidden";
  container.style.cursor = "grab";
  container.style.overscrollBehavior = "none";

  // Apply canvas background color
  if (config) {
    const backgroundColor = withTheme(config, config.canvasBackgroundColor, config.canvasBackgroundColorDark);
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
