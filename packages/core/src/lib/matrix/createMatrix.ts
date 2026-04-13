/**
 * Builds a uniform-scale 2D transform matrix (no rotation or skew).
 *
 * @param scale - Scale factor applied equally to both axes.
 * @param translateX - Horizontal translation in CSS pixels after scaling.
 * @param translateY - Vertical translation in CSS pixels after scaling.
 * @returns A new {@link DOMMatrix} with components `[scale, 0, 0, scale, translateX, translateY]`.
 *
 * @example
 * ```ts
 * const m = createMatrix(2, 10, 20);
 * ```
 */
export function createMatrix(scale: number, translateX: number, translateY: number): DOMMatrix {
  return new DOMMatrix([scale, 0, 0, scale, translateX, translateY]);
}
