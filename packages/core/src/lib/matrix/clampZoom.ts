import type { MarkupCanvasConfig } from "@/types/index.js";

export function clampZoom(scale: number, config: Required<MarkupCanvasConfig>): number {
  return Math.max(config.minZoom, Math.min(config.maxZoom, scale));
}
