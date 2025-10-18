import { getThemeValue } from "@/lib/helpers/index.js";
import type { MarkupCanvasConfig } from "@/types/index.js";

export interface RulerThemeUpdater {
  horizontalRuler?: HTMLElement;
  verticalRuler?: HTMLElement;
  cornerBox?: HTMLElement;
  gridOverlay?: HTMLElement;
}

export function updateRulerTheme(elements: RulerThemeUpdater, config: Required<MarkupCanvasConfig>): void {
  // Get theme-aware colors
  const backgroundColor = getThemeValue(config, "rulerBackgroundColor");
  const borderColor = getThemeValue(config, "rulerBorderColor");
  const textColor = getThemeValue(config, "rulerTextColor");
  const tickColor = getThemeValue(config, "rulerTickColor");
  const gridColor = getThemeValue(config, "gridColor");

  // Update horizontal ruler with CSS variables
  if (elements.horizontalRuler) {
    elements.horizontalRuler.style.setProperty("--ruler-background-color", backgroundColor);
    elements.horizontalRuler.style.setProperty("--ruler-border-color", borderColor);
    elements.horizontalRuler.style.setProperty("--ruler-text-color", textColor);
    elements.horizontalRuler.style.setProperty("--ruler-tick-color", tickColor);
  }

  // Update vertical ruler with CSS variables
  if (elements.verticalRuler) {
    elements.verticalRuler.style.setProperty("--ruler-background-color", backgroundColor);
    elements.verticalRuler.style.setProperty("--ruler-border-color", borderColor);
    elements.verticalRuler.style.setProperty("--ruler-text-color", textColor);
    elements.verticalRuler.style.setProperty("--ruler-tick-color", tickColor);
  }

  // Update corner box with CSS variables
  if (elements.cornerBox) {
    elements.cornerBox.style.setProperty("--ruler-background-color", backgroundColor);
    elements.cornerBox.style.setProperty("--ruler-border-color", borderColor);
    elements.cornerBox.style.setProperty("--ruler-text-color", textColor);
  }

  // Update grid overlay with CSS variables
  if (elements.gridOverlay) {
    elements.gridOverlay.style.setProperty("--grid-color", gridColor);
  }
}
