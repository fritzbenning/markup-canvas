import type { MarkupCanvasConfig } from "@/types";

export function withFeatureEnabled<T>(config: MarkupCanvasConfig, feature: keyof MarkupCanvasConfig, operation: () => T): T | null {
  if (config[feature]) {
    return operation();
  }
  return null;
}
