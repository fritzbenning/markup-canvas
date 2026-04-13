import type { MarkupCanvasConfig, RulerElements } from "@/types/index";
import { createCornerBox } from "./createCornerBox";
import { createGridOverlay } from "./createGridOverlay";
import { createHorizontalRuler } from "./createHorizontalRuler";
import { createVerticalRuler } from "./createVerticalRuler";

export function createRulerElements(container: HTMLElement, config: Required<MarkupCanvasConfig>): RulerElements {
  const horizontalRuler = createHorizontalRuler(config);
  const verticalRuler = createVerticalRuler(config);
  const cornerBox = createCornerBox(config);
  const gridOverlay = config.enableGrid ? createGridOverlay(config) : undefined;

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
