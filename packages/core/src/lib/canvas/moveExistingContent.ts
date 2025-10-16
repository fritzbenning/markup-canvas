import { TRANSFORM_LAYER_CLASS } from "@/lib/constants";

export function moveExistingContent(existingContent: Element[], contentLayer: HTMLElement, transformLayer: HTMLElement): void {
  existingContent.forEach((child) => {
    if (child !== transformLayer && !child.classList.contains(TRANSFORM_LAYER_CLASS)) {
      contentLayer.appendChild(child);
    }
  });
}
