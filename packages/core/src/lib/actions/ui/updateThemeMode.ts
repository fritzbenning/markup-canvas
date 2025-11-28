import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig.js";
import type { MarkupCanvasConfig, RulerSystem } from "@/types/index.js";

export function updateThemeMode(
  config: Required<MarkupCanvasConfig>,
  rulers: RulerSystem | null,
  mode: "light" | "dark"
): void {
  const newConfig = {
    ...config,
    themeMode: mode,
  };
  const updatedConfig = createMarkupCanvasConfig(newConfig);

  // Update rulers if they exist
  if (rulers) {
    rulers.updateTheme(updatedConfig);
  }
}
