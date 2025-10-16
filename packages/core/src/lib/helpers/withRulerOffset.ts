import { RULER_SIZE } from "../rulers/constants";

export function withRulerOffset<T>(
  canvas: { container: HTMLElement },
  x: number,
  y: number,
  operation: (adjustedX: number, adjustedY: number) => T
): T {
  const hasRulers = canvas.container.querySelector(".canvas-ruler") !== null;
  const adjustedX = hasRulers ? x - RULER_SIZE : x;
  const adjustedY = hasRulers ? y - RULER_SIZE : y;

  return operation(adjustedX, adjustedY);
}
