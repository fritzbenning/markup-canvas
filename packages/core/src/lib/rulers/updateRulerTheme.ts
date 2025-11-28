import type { MarkupCanvasConfig } from "@/types/index.js";

export interface RulerThemeUpdater {
  horizontalRuler?: HTMLElement;
  verticalRuler?: HTMLElement;
  cornerBox?: HTMLElement;
  gridOverlay?: HTMLElement;
}

export function updateRulerTheme(elements: RulerThemeUpdater, config: Required<MarkupCanvasConfig>): void {
  // Create theme-aware colors using light-dark() CSS function
  const backgroundColor = `light-dark(${config.rulerBackgroundColor}, ${config.rulerBackgroundColorDark})`;
  const borderColor = `light-dark(${config.rulerBorderColor}, ${config.rulerBorderColorDark})`;
  const textColor = `light-dark(${config.rulerTextColor}, ${config.rulerTextColorDark})`;
  const tickColor = `light-dark(${config.rulerTickColor}, ${config.rulerTickColorDark})`;
  const gridColor = `light-dark(${config.gridColor}, ${config.gridColorDark})`;

  // Update horizontal ruler with CSS variables
  if (elements.horizontalRuler) {
    elements.horizontalRuler.style.setProperty("--ruler-background-color", backgroundColor);
    elements.horizontalRuler.style.setProperty("--ruler-border-color", borderColor);
    elements.horizontalRuler.style.setProperty("--ruler-text-color", textColor);
    elements.horizontalRuler.style.setProperty("--ruler-tick-color", tickColor);
    elements.horizontalRuler.style.colorScheme = config.themeMode;
  }

  // Update vertical ruler with CSS variables
  if (elements.verticalRuler) {
    elements.verticalRuler.style.setProperty("--ruler-background-color", backgroundColor);
    elements.verticalRuler.style.setProperty("--ruler-border-color", borderColor);
    elements.verticalRuler.style.setProperty("--ruler-text-color", textColor);
    elements.verticalRuler.style.setProperty("--ruler-tick-color", tickColor);
    elements.verticalRuler.style.colorScheme = config.themeMode;
  }

  // Update corner box with CSS variables
  if (elements.cornerBox) {
    elements.cornerBox.style.setProperty("--ruler-background-color", backgroundColor);
    elements.cornerBox.style.setProperty("--ruler-border-color", borderColor);
    elements.cornerBox.style.setProperty("--ruler-text-color", textColor);
    elements.cornerBox.style.colorScheme = config.themeMode;
  }

  // Update grid overlay with CSS variables
  if (elements.gridOverlay) {
    elements.gridOverlay.style.setProperty("--grid-color", gridColor);
    elements.gridOverlay.style.colorScheme = config.themeMode;
  }
}
