import { vi } from "vitest";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";

/**
 * Minimal {@link MarkupCanvas} double for postMessage handler tests (methods invoked by {@link processPostMessage}).
 */
export function createPostMessageTestCanvas(name = "testCanvas"): MarkupCanvas {
  const config = createMarkupCanvasConfig({ name });
  return {
    config,
    zoomIn: vi.fn(() => true),
    zoomOut: vi.fn(() => true),
    setZoom: vi.fn(() => true),
    resetZoom: vi.fn(() => true),
    panLeft: vi.fn(() => true),
    panRight: vi.fn(() => true),
    panUp: vi.fn(() => true),
    panDown: vi.fn(() => true),
    fitToScreen: vi.fn(() => true),
    centerContent: vi.fn(() => true),
    panToPoint: vi.fn(() => true),
    reset: vi.fn(() => true),
    toggleRulers: vi.fn(() => true),
    showRulers: vi.fn(() => true),
    hideRulers: vi.fn(() => true),
    toggleGrid: vi.fn(() => true),
    showGrid: vi.fn(() => true),
    hideGrid: vi.fn(() => true),
    getConfig: vi.fn(() => config),
    updateThemeMode: vi.fn(() => true),
    updateTransition: vi.fn(() => true),
    toggleTransitionMode: vi.fn(() => true),
  } as unknown as MarkupCanvas;
}
