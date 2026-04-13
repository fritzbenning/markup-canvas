import type { MarkupCanvasConfig } from "@/types";

export type ThemeColorKey =
  | "canvasBackgroundColor"
  | "rulerBackgroundColor"
  | "rulerBorderColor"
  | "rulerTextColor"
  | "rulerTickColor"
  | "gridColor";

/**
 * Returns the theme color for `key` from `config`, using `*Dark` variants when `themeMode` is `"dark"`.
 */
export function getThemeValue(config: Required<MarkupCanvasConfig>, key: ThemeColorKey): string {
  if (config.themeMode === "dark") {
    const darkKey = `${key}Dark` as keyof Required<MarkupCanvasConfig>;
    return config[darkKey] as string;
  }
  return config[key as keyof Required<MarkupCanvasConfig>] as string;
}
