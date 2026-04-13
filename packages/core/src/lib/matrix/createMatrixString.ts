/**
 * Serializes a {@link DOMMatrix} as a CSS `matrix(...)` transform string for `element.style.transform`.
 *
 * @param matrix - Matrix whose 2D components are read from `m11`–`m22` and translation from `m41`/`m42`.
 * @returns A `matrix(a, b, c, d, e, f)` string suitable for the CSS `transform` property.
 */
export function createMatrixString(matrix: DOMMatrix): string {
  return `matrix(${matrix.m11}, ${matrix.m12}, ${matrix.m21}, ${matrix.m22}, ${matrix.m41}, ${matrix.m42})`;
}
