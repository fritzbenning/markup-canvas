import { withTheme } from "@/lib/helpers/index.js";
import type { MarkupCanvasConfig } from "@/types/index.js";

export interface RulerThemeUpdater {
  horizontalRuler?: HTMLElement;
  verticalRuler?: HTMLElement;
  cornerBox?: HTMLElement;
  gridOverlay?: HTMLElement;
}

export function updateRulerTheme(elements: RulerThemeUpdater, config: Required<MarkupCanvasConfig>): void {
  // Get theme-aware colors
  const backgroundColor = withTheme(config, config.rulerBackgroundColor, config.rulerBackgroundColorDark);
  const borderColor = withTheme(config, config.rulerBorderColor, config.rulerBorderColorDark);
  const textColor = withTheme(config, config.rulerTextColor, config.rulerTextColorDark);
  const gridColor = withTheme(config, config.gridColor, config.gridColorDark);

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
