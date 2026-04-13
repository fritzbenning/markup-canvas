import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import { createCanvasMethodStubs } from "./createCanvasMethodStubs";

/**
 * Minimal MarkupCanvas double for keyboard rule tests (only methods used by keyboardRules).
 */
export function createKeyboardTestCanvas(): MarkupCanvas {
  return createCanvasMethodStubs() as unknown as MarkupCanvas;
}
