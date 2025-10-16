import { CLICK_THRESHOLDS } from "@/lib/events/constants.js";
import { withRAFThrottle } from "@/lib/helpers/index.js";
import type { Canvas, Transform } from "@/types/index.js";

export function handleMouseMove(
  event: MouseEvent,
  canvas: Canvas,
  isDragEnabled: boolean,
  isDragging: boolean,
  mouseDownTime: number,
  mouseDownX: number,
  mouseDownY: number,
  lastMouseX: number,
  lastMouseY: number,
  setters: {
    setHasDragged: (value: boolean) => void;
    setIsDragging: (value: boolean) => void;
    setLastMouseX: (value: number) => void;
    setLastMouseY: (value: number) => void;
  }
): void {
  if (mouseDownTime > 0) {
    const deltaX = Math.abs(event.clientX - mouseDownX);
    const deltaY = Math.abs(event.clientY - mouseDownY);
    if (deltaX > CLICK_THRESHOLDS.MAX_MOVEMENT || deltaY > CLICK_THRESHOLDS.MAX_MOVEMENT) {
      setters.setHasDragged(true);

      if (!isDragging && isDragEnabled) {
        setters.setIsDragging(true);
      }
    }
  }

  if (!isDragging || !isDragEnabled) return;

  event.preventDefault();

  const handleMouseMoveThrottled = withRAFThrottle((...args: unknown[]) => {
    const moveEvent = args[0] as MouseEvent;
    if (!isDragging || !isDragEnabled) return;

    const deltaX = moveEvent.clientX - lastMouseX;
    const deltaY = moveEvent.clientY - lastMouseY;

    const newTransform: Partial<Transform> = {
      translateX: canvas.transform.translateX + deltaX,
      translateY: canvas.transform.translateY + deltaY,
    };

    canvas.updateTransform(newTransform);

    setters.setLastMouseX(moveEvent.clientX);
    setters.setLastMouseY(moveEvent.clientY);
  });

  handleMouseMoveThrottled(event);
}
