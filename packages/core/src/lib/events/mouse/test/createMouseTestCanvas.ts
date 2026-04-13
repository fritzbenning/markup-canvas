import { vi } from "vitest";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { MarkupCanvasConfig } from "@/types/index";

/**
 * Minimal {@link MarkupCanvas} double for mouse event unit tests (container, transform, `updateTransform`, etc.).
 */
export function createMouseTestCanvas(overrides?: MarkupCanvasConfig): MarkupCanvas {
  const container = document.createElement("div");
  Object.defineProperty(container, "getBoundingClientRect", {
    configurable: true,
    value: () => ({
      width: 200,
      height: 150,
      top: 0,
      left: 0,
      right: 200,
      bottom: 150,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }),
  });
  const transformLayer = document.createElement("div");
  const config = createMarkupCanvasConfig(overrides);
  return {
    container,
    transformLayer,
    config,
    transform: {
      translateX: 10,
      translateY: 20,
      scale: 1,
    },
    updateTransform: vi.fn(),
    canvasToContent: vi.fn((x: number, y: number) => ({ x, y })),
  } as unknown as MarkupCanvas;
}
