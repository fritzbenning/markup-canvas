import type { MarkupCanvasConfig } from "@/types";

type ThemeColorKey =
  | "canvasBackgroundColor"
  | "rulerBackgroundColor"
  | "rulerBorderColor"
  | "rulerTextColor"
  | "rulerMajorTickColor"
  | "rulerMinorTickColor"
  | "gridColor";

/**
 * Get the appropriate theme color value based on the current theme mode
 * @param config - The canvas configuration
 * @param key - The base color property name (e.g., "canvasBackgroundColor")
 * @returns The color value for the current theme mode
 *
 * @example
 * const bgColor = getThemeValue(config, "canvasBackgroundColor");
 * // If theme is dark, returns config.canvasBackgroundColorDark
 * // If theme is light, returns config.canvasBackgroundColor
 */
export function getThemeValue(config: Required<MarkupCanvasConfig>, key: ThemeColorKey): string {
  if (config.themeMode === "dark") {
    const darkKey = (key + "Dark") as keyof Required<MarkupCanvasConfig>;
    return config[darkKey] as string;
  }
  return config[key as keyof Required<MarkupCanvasConfig>] as string;
}
