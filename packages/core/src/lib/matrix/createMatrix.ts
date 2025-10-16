export function createMatrix(scale: number, translateX: number, translateY: number): DOMMatrix {
  return new DOMMatrix([scale, 0, 0, scale, translateX, translateY]);
}
