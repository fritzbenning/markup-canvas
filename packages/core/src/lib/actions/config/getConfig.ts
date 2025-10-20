import type { MarkupCanvasConfig } from "@/types/index.js";

export function getConfig(config: Required<MarkupCanvasConfig>): Required<MarkupCanvasConfig> {
  return { ...config };
}
