export function createMatrixString(matrix: DOMMatrix): string {
  return `matrix(${matrix.m11}, ${matrix.m12}, ${matrix.m21}, ${matrix.m22}, ${matrix.m41}, ${matrix.m42})`;
}
