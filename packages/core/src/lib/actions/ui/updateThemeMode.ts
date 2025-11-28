import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig.js";
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

  // Update color-scheme CSS property
  canvasContainer.style.colorScheme = mode;

  // Update rulers if they exist
  if (rulers) {
    rulers.updateTheme(updatedConfig);
  }
}
