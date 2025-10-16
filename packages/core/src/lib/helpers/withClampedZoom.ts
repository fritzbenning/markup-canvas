import { clampZoom } from "@/lib/matrix/clampZoom.js";
import type { MarkupCanvasConfig } from "@/types";

export function withClampedZoom<T>(config: Required<MarkupCanvasConfig>, operation: (clamp: (scale: number) => number) => T): T {
  const clampFunction = (scale: number) => clampZoom(scale, config);
  return operation(clampFunction);
}
