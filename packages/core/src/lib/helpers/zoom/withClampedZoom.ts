import { clampZoom } from "@/lib/matrix/clampZoom";
import type { MarkupCanvasConfig } from "@/types";

/**
 * Runs `operation` with a `clamp` function that constrains scale using `config.minZoom` / `config.maxZoom`
 * (via {@link clampZoom}).
 */
export function withClampedZoom<T>(
  config: Required<MarkupCanvasConfig>,
  operation: (clamp: (scale: number) => number) => T,
): T {
  const clampFunction = (scale: number) => clampZoom(scale, config);
  return operation(clampFunction);
}
