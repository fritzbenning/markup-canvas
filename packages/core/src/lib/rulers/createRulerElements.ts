import type { RulerOptions } from "@/types/index.js";
import { createCornerBox } from "./createCornerBox.js";
import { createGridOverlay } from "./createGridOverlay.js";
import { createHorizontalRuler } from "./createHorizontalRuler.js";
import { createVerticalRuler } from "./createVerticalRuler.js";
import type { RulerElements } from "./RulerElements.js";

export function createRulerElements(container: HTMLElement, config: Required<RulerOptions>): RulerElements {
  const horizontalRuler = createHorizontalRuler(config);
  const verticalRuler = createVerticalRuler(config);
  const cornerBox = createCornerBox(config);
  const gridOverlay = config.showGrid ? createGridOverlay(config) : undefined;

  container.appendChild(horizontalRuler);
  container.appendChild(verticalRuler);
  container.appendChild(cornerBox);
  if (gridOverlay) {
    container.appendChild(gridOverlay);
  }

  return {
    horizontalRuler,
    verticalRuler,
    cornerBox,
    gridOverlay,
  };
}
