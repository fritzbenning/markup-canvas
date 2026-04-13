/**
 * Midpoint between two touches in viewport coordinates (`clientX` / `clientY`), used as the pinch-zoom focal point.
 *
 * @param touch1 - First active touch.
 * @param touch2 - Second active touch.
 * @returns Center `{ x, y }` in CSS pixels relative to the viewport.
 */
export function getTouchCenter(touch1: Touch, touch2: Touch): { x: number; y: number } {
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2,
  };
}
