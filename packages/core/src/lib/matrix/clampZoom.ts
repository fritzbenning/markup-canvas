import type { MarkupCanvasConfig } from "@/types/index";

/**
 * Constrains a zoom scale to the configured `[minZoom, maxZoom]` range.
 *
 * @param scale - Proposed scale factor.
 * @param config - Canvas configuration; `minZoom` and `maxZoom` must be set.
 * @returns `scale` clamped between `config.minZoom` and `config.maxZoom`.
 */
export function clampZoom(scale: number, config: Required<MarkupCanvasConfig>): number {
  return Math.max(config.minZoom, Math.min(config.maxZoom, scale));
}
