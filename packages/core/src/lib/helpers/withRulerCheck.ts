export function withRulerCheck<T>(canvas: { container: HTMLElement }, operation: (hasRulers: boolean) => T): T {
  const hasRulers = canvas.container.querySelector(".canvas-ruler") !== null;
  return operation(hasRulers);
}

export function withRulerSize<T>(canvas: { container: HTMLElement }, rulerSize: number, operation: (rulerSize: number) => T): T {
  const hasRulers = canvas.container.querySelector(".canvas-ruler") !== null;
  const finalRulerSize = hasRulers ? rulerSize : 0;
  return operation(finalRulerSize);
}

export function withRulerAdjustment(
  canvas: { container: HTMLElement },
  rulerSize: number,
  value: number,
  operation?: (adjustedValue: number) => void
): number {
  return withRulerSize(canvas, rulerSize, (rulerSize) => {
    const adjusted = value - rulerSize;
    operation?.(adjusted);
    return adjusted;
  });
}

export function withRulerOffsets<T>(
  canvas: { container: HTMLElement },
  rulerSize: number,
  x: number,
  y: number,
  operation: (adjustedX: number, adjustedY: number) => T
): T {
  return withRulerSize(canvas, rulerSize, (rulerSize) => {
    const adjustedX = x - rulerSize;
    const adjustedY = y - rulerSize;
    return operation(adjustedX, adjustedY);
  });
}

export function withRulerOffsetObject<T, C extends { x: number; y: number }>(
  canvas: { container: HTMLElement },
  rulerSize: number,
  coords: C,
  operation: (adjusted: C) => T
): T {
  return withRulerSize(canvas, rulerSize, (rulerSize) => {
    const adjusted = {
      ...coords,
      x: coords.x - rulerSize,
      y: coords.y - rulerSize,
    } as C;
    return operation(adjusted);
  });
}
