import type { MarkupCanvasConfig } from "@/types";

/**
 * Runs `operation` only if `config[feature]` is truthy; otherwise returns `null`.
 */
export function withFeatureEnabled<T>(
  config: MarkupCanvasConfig,
  feature: keyof MarkupCanvasConfig,
  operation: () => T,
): T | null {
  if (config[feature]) {
    return operation();
  }
  return null;
}
