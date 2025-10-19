import type { Canvas } from "@/types/index.js";

export function getViewportCenter(canvas: Canvas): { x: number; y: number } {
  try {
    const bounds = canvas.getBounds();
    return {
      x: bounds.width / 2,
      y: bounds.height / 2,
    };
  } catch (error) {
    console.warn("Failed to calculate viewport center:", error);
    return { x: 0, y: 0 };
  }
}
