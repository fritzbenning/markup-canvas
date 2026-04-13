import { TRANSFORM_LAYER_CLASS } from "@/lib/constants";

/**
 * Appends prior container children into `contentLayer`, skipping the transform layer and any duplicate transform wrappers.
 *
 * @param existingContent - Snapshot of `container.children` from before layers were ensured.
 * @param contentLayer - Target layer for user markup.
 * @param transformLayer - Transform root; children equal to this node are not moved.
 */
export function moveExistingContent(existingContent: Element[], contentLayer: HTMLElement, transformLayer: HTMLElement): void {
  existingContent.forEach((child) => {
    if (child !== transformLayer && !child.classList.contains(TRANSFORM_LAYER_CLASS)) {
      contentLayer.appendChild(child);
    }
  });
}
