/**
 * Euclidean distance between two touches in viewport space. Pinch zoom compares this value frame-to-frame.
 *
 * @param touch1 - First active touch.
 * @param touch2 - Second active touch.
 * @returns Distance in CSS pixels.
 */
export function getTouchDistance(touch1: Touch, touch2: Touch): number {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}
