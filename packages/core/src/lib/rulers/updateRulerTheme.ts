import { getThemeValue } from "@/lib/helpers/index.js";
import type { MarkupCanvasConfig } from "@/types/index.js";

export interface RulerThemeUpdater {
  horizontalRuler?: HTMLElement;
  verticalRuler?: HTMLElement;
  cornerBox?: HTMLElement;
  gridOverlay?: HTMLElement;
}

/**
 * Updates all ruler elements with new theme colors
 * @param elements - The ruler elements to update
 * @param config - The canvas config containing theme and color settings
 */
export function updateRulerTheme(elements: RulerThemeUpdater, config: Required<MarkupCanvasConfig>): void {
  // Get theme-aware colors
  const backgroundColor = getThemeValue(config, "rulerBackgroundColor");
  const borderColor = getThemeValue(config, "rulerBorderColor");
  const textColor = getThemeValue(config, "rulerTextColor");
  const gridColor = getThemeValue(config, "gridColor");

  // Update horizontal ruler
  if (elements.horizontalRuler) {
    elements.horizontalRuler.style.background = backgroundColor;
    elements.horizontalRuler.style.borderBottomColor = borderColor;
    elements.horizontalRuler.style.borderRightColor = borderColor;
    elements.horizontalRuler.style.color = textColor;
  }

  // Update vertical ruler
  if (elements.verticalRuler) {
    elements.verticalRuler.style.background = backgroundColor;
    elements.verticalRuler.style.borderRightColor = borderColor;
    elements.verticalRuler.style.borderBottomColor = borderColor;
    elements.verticalRuler.style.color = textColor;
  }

  // Update corner box
  if (elements.cornerBox) {
    elements.cornerBox.style.background = backgroundColor;
    elements.cornerBox.style.borderRightColor = borderColor;
    elements.cornerBox.style.borderBottomColor = borderColor;
    elements.cornerBox.style.color = textColor;
  }

  // Update grid overlay
  if (elements.gridOverlay) {
    elements.gridOverlay.style.backgroundImage = `
      linear-gradient(${gridColor} 1px, transparent 1px),
      linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
    `;
  }
}
