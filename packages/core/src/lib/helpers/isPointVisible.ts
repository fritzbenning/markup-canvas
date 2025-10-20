import type { Canvas } from "@/types/index.js";
import { getVisibleArea } from "./getVisibleArea.js";

export function isPointVisible(canvas: Canvas, x: number, y: number): boolean {
  const visibleArea = getVisibleArea(canvas);
  return x >= visibleArea.x && x <= visibleArea.x + visibleArea.width && y >= visibleArea.y && y <= visibleArea.y + visibleArea.height;
}
