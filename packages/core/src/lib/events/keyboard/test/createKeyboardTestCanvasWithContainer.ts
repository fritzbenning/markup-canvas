import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { MarkupCanvasConfig } from "@/types/index";
import { createCanvasMethodStubs } from "./createCanvasMethodStubs";

/**
 * Like {@link createKeyboardTestCanvas} but includes a focusable container for setup tests.
 */
export function createKeyboardTestCanvasWithContainer(options: MarkupCanvasConfig = {}): MarkupCanvas {
  const container = document.createElement("div");
  container.tabIndex = 0;
  const config = createMarkupCanvasConfig(options);

  return {
    ...createCanvasMethodStubs(),
    container,
    config,
  } as unknown as MarkupCanvas;
}
