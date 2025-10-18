import type { MarkupCanvasConfig } from "@/types";

type ThemeColorKey =
  | "canvasBackgroundColor"
  | "rulerBackgroundColor"
  | "rulerBorderColor"
  | "rulerTextColor"
  | "rulerTickColor"
  | "gridColor";

export function getThemeValue(config: Required<MarkupCanvasConfig>, key: ThemeColorKey): string {
  if (config.themeMode === "dark") {
    const darkKey = `${key}Dark` as keyof Required<MarkupCanvasConfig>;
    return config[darkKey] as string;
  }
  return config[key as keyof Required<MarkupCanvasConfig>] as string;
}
