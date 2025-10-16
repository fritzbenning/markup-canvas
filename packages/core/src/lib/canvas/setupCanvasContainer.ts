import { checkContainerDimensions } from "@/lib/canvas/checkContainerDimensions";
import { CANVAS_CONTAINER_CLASS } from "@/lib/constants";

export function setupCanvasContainer(container: HTMLElement): void {
  const currentPosition = getComputedStyle(container).position;
  if (currentPosition === "static") {
    container.style.position = "relative";
  }
  container.style.overflow = "hidden";
  container.style.cursor = "grab";
  container.style.overscrollBehavior = "none";

  if (!container.hasAttribute("tabindex")) {
    container.setAttribute("tabindex", "0");
  }

  checkContainerDimensions(container);

  if (!container.classList.contains(CANVAS_CONTAINER_CLASS)) {
    container.classList.add(CANVAS_CONTAINER_CLASS);
  }
}
