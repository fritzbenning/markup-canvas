import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig.js";
import { getThemeValue } from "@/lib/helpers/index.js";
import type { MarkupCanvasConfig, RulerSystem } from "@/types/index.js";

export function updateThemeMode(
  canvasContainer: HTMLElement,
  config: Required<MarkupCanvasConfig>,
  rulers: RulerSystem | null,
  mode: "light" | "dark"
): void {
  const newConfig = {
    ...config,
    themeMode: mode,
  };
  const updatedConfig = createMarkupCanvasConfig(newConfig);

  // Update canvas background color
  const backgroundColor = getThemeValue(updatedConfig, "canvasBackgroundColor");
  canvasContainer.style.backgroundColor = backgroundColor;

  // Update rulers if they exist
  if (rulers) {
    rulers.updateTheme(updatedConfig);
  }
}
