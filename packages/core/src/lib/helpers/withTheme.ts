import type { MarkupCanvasConfig } from "@/types";

export function withTheme<T>(config: Required<MarkupCanvasConfig>, lightValue: T, darkValue: T): T {
  return config.themeMode === "dark" ? darkValue : lightValue;
}
