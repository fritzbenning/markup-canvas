export function checkContainerDimensions(container: HTMLElement): void {
  const containerRect = container.getBoundingClientRect();
  const computedStyle = getComputedStyle(container);

  if (containerRect.height === 0 && computedStyle.height === "auto") {
    console.error(
      "MarkupCanvas: Container height is 0. Please set a height on your container element using CSS.",
      "Examples: height: 100vh, height: 500px, or use flexbox/grid layout.",
      container,
    );
  }

  if (containerRect.width === 0 && computedStyle.width === "auto") {
    console.error(
      "MarkupCanvas: Container width is 0. Please set a width on your container element using CSS.",
      "Examples: width: 100vw, width: 800px, or use flexbox/grid layout.",
      container,
    );
  }
}
