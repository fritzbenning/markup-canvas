import type { MarkupCanvasConfig } from "@/types/index";

/**
 * Returns a shallow copy of the resolved canvas configuration.
 *
 * @param config - Fully resolved {@link MarkupCanvasConfig} instance.
 * @returns A new object with the same top-level values as `config`.
 */
export function getConfig(config: Required<MarkupCanvasConfig>): Required<MarkupCanvasConfig> {
  return { ...config };
}
