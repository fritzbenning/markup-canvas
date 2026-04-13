import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import { createCanvasMethodStubs } from "./createCanvasMethodStubs";

/**
 * Like {@link createKeyboardTestCanvas} but includes a focusable container for setup tests.
 */
export function createKeyboardTestCanvasWithContainer(): MarkupCanvas {
  const container = document.createElement("div");
  container.tabIndex = 0;
  return {
    ...createCanvasMethodStubs(),
    container,
  } as unknown as MarkupCanvas;
}
