import { DEFAULT_CONFIG } from "@/lib/config/constants.js";
import type { MarkupCanvasConfig } from "@/types/index.js";

export function createMarkupCanvasConfig(options: MarkupCanvasConfig = {}): Required<MarkupCanvasConfig> {
  const config: Required<MarkupCanvasConfig> = {
    ...DEFAULT_CONFIG,
    ...options,
  };

  if (typeof config.width !== "number" || config.width <= 0) {
    console.warn("Invalid width, using default");
    config.width = DEFAULT_CONFIG.width;
  }

  if (typeof config.height !== "number" || config.height <= 0) {
    console.warn("Invalid height, using default");
    config.height = DEFAULT_CONFIG.height;
  }

  if (typeof config.zoomSpeed !== "number" || config.zoomSpeed <= 0) {
    console.warn("Invalid zoomSpeed, using default");
    config.zoomSpeed = DEFAULT_CONFIG.zoomSpeed;
  }

  if (typeof config.minZoom !== "number" || config.minZoom <= 0) {
    console.warn("Invalid minZoom, using default");
    config.minZoom = DEFAULT_CONFIG.minZoom;
  }

  if (typeof config.maxZoom !== "number" || config.maxZoom <= config.minZoom) {
    console.warn("Invalid maxZoom, using default");
    config.maxZoom = DEFAULT_CONFIG.maxZoom;
  }

  if (typeof config.keyboardPanStep !== "number" || config.keyboardPanStep <= 0) {
    console.warn("Invalid keyboardPanStep, using default");
    config.keyboardPanStep = DEFAULT_CONFIG.keyboardPanStep;
  }

  if (typeof config.keyboardFastMultiplier !== "number" || config.keyboardFastMultiplier <= 0) {
    console.warn("Invalid keyboardFastMultiplier, using default");
    config.keyboardFastMultiplier = DEFAULT_CONFIG.keyboardFastMultiplier;
  }

  if (typeof config.clickZoomLevel !== "number" || config.clickZoomLevel <= 0) {
    console.warn("Invalid clickZoomLevel, using default");
    config.clickZoomLevel = DEFAULT_CONFIG.clickZoomLevel;
  }

  if (typeof config.rulerFontSize !== "number" || config.rulerFontSize <= 0) {
    console.warn("Invalid rulerFontSize, using default");
    config.rulerFontSize = DEFAULT_CONFIG.rulerFontSize;
  }

  return config;
}
