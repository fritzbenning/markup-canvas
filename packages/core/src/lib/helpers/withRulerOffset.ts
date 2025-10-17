export function withRulerOffset<T>(
  canvas: { container: HTMLElement },
  x: number,
  y: number,
  rulerSize: number,
  operation: (adjustedX: number, adjustedY: number) => T
): T {
  const hasRulers = canvas.container.querySelector(".canvas-ruler") !== null;
  const adjustedX = hasRulers ? x - rulerSize : x;
  const adjustedY = hasRulers ? y - rulerSize : y;

  return operation(adjustedX, adjustedY);
}
