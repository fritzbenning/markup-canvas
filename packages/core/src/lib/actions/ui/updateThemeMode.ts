import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import type { MarkupCanvasConfig, RulerSystem } from "@/types/index";

/**
 * Rebuilds resolved config with {@link createMarkupCanvasConfig} and applies it to rulers via {@link RulerSystem.updateTheme}.
 *
 * Callers should pass a config that already reflects `mode` if their own state must stay in sync (see {@link MarkupCanvas.updateThemeMode}).
 *
 * @param config - Base configuration; merged with `themeMode: mode` before validation.
 * @param rulers - Ruler system to restyle, or `null`.
 * @param mode - Target color theme.
 */
export function updateThemeMode(
  config: Required<MarkupCanvasConfig>,
  rulers: RulerSystem | null,
  mode: "light" | "dark",
): void {
  const newConfig = {
    ...config,
    themeMode: mode,
  };

  const updatedConfig = createMarkupCanvasConfig(newConfig);

  if (rulers) {
    rulers.updateTheme(updatedConfig);
  }
}
