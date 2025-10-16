import { RULER_SIZE } from "../rulers/constants";

export function withRulerCheck<T>(canvas: { container: HTMLElement }, operation: (hasRulers: boolean) => T): T {
  const hasRulers = canvas.container.querySelector(".canvas-ruler") !== null;
  return operation(hasRulers);
}

export function withRulerSize<T>(canvas: { container: HTMLElement }, operation: (rulerSize: number) => T): T {
  const hasRulers = canvas.container.querySelector(".canvas-ruler") !== null;
  const rulerSize = hasRulers ? RULER_SIZE : 0;
  return operation(rulerSize);
}

export function withRulerAdjustment(
  canvas: { container: HTMLElement },
  value: number,
  operation?: (adjustedValue: number) => void
): number {
  return withRulerSize(canvas, (rulerSize) => {
    const adjusted = value - rulerSize;
    operation?.(adjusted);
    return adjusted;
  });
}

export function withRulerOffsets<T>(
  canvas: { container: HTMLElement },
  x: number,
  y: number,
  operation: (adjustedX: number, adjustedY: number) => T
): T {
  return withRulerSize(canvas, (rulerSize) => {
    const adjustedX = x - rulerSize;
    const adjustedY = y - rulerSize;
    return operation(adjustedX, adjustedY);
  });
}

export function withRulerOffsetObject<T, C extends { x: number; y: number }>(
  canvas: { container: HTMLElement },
  coords: C,
  operation: (adjusted: C) => T
): T {
  return withRulerSize(canvas, (rulerSize) => {
    const adjusted = {
      ...coords,
      x: coords.x - rulerSize,
      y: coords.y - rulerSize,
    } as C;
    return operation(adjusted);
  });
}
