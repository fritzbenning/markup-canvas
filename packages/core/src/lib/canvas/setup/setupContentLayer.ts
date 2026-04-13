/**
 * Applies default layout and interaction styles to the inner content layer (full size, relative positioning).
 *
 * @param contentLayer - Element that wraps user-provided markup.
 */
export function setupContentLayer(contentLayer: HTMLElement): void {
  contentLayer.style.position = "relative";
  contentLayer.style.width = "100%";
  contentLayer.style.height = "100%";
  contentLayer.style.pointerEvents = "auto";
}
