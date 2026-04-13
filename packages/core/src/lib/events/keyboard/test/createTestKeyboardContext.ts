import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { KeyboardContext, KeyboardScope } from "../types";
import { createKeyboardTestCanvas } from "./createKeyboardTestCanvas";

export function createTestKeyboardContext(overrides: {
  keyboardScope?: KeyboardScope;
  canvas?: MarkupCanvas;
} = {}): KeyboardContext {
  const config = createMarkupCanvasConfig({
    sendKeyboardEventsToParent: false,
    enableAdaptiveSpeed: false,
  });
  return {
    canvas: overrides.canvas ?? createKeyboardTestCanvas(),
    config,
    keyboardScope: overrides.keyboardScope ?? "default",
  };
}
