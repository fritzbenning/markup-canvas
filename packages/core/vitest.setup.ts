/**
 * happy-dom does not implement {@link DOMPoint#matrixTransform}; core matrix tests rely on it.
 * Runs once before all test files via Vitest `setupFiles`.
 */
const proto = DOMPoint.prototype as DOMPoint & { matrixTransform?: (m: DOMMatrix) => DOMPoint };
if (typeof proto.matrixTransform !== "function") {
  proto.matrixTransform = function (matrix: DOMMatrix): DOMPoint {
    const { x, y } = this;
    return new DOMPoint(
      matrix.m11 * x + matrix.m21 * y + matrix.m41,
      matrix.m12 * x + matrix.m22 * y + matrix.m42,
    );
  };
}
