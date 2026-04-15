import { afterEach, describe, expect, it, vi } from "vitest";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { WindowAPI } from "@/types/index";
import { bindCanvasToWindow } from "./bindCanvasToWindow";
import { cleanupWindowBinding } from "./cleanupWindowBinding";

function createBindWindowTestDouble(name = "bindWindowTest"): { canvas: MarkupCanvas; config: ReturnType<typeof createMarkupCanvasConfig> } {
  const config = createMarkupCanvasConfig({ name });
  const event = { emit: vi.fn(), on: vi.fn(), off: vi.fn() };
  const canvas = {
    config,
    getConfig: vi.fn(() => config),
    updateConfig: vi.fn(),
    updateTransform: vi.fn(),
    reset: vi.fn(),
    transform: { scale: 1.25, translateX: 0, translateY: 0 },
    setZoom: vi.fn(() => true),
    zoomToPoint: vi.fn(() => true),
    zoomIn: vi.fn(() => true),
    zoomOut: vi.fn(() => true),
    resetZoom: vi.fn(() => true),
    fitToScreen: vi.fn(() => true),
    panLeft: vi.fn(() => true),
    panRight: vi.fn(() => true),
    panUp: vi.fn(() => true),
    panDown: vi.fn(() => true),
    panToPoint: vi.fn(() => true),
    centerContent: vi.fn(() => true),
    enableMouseDrag: vi.fn(),
    disableMouseDrag: vi.fn(),
    isMouseDragEnabled: vi.fn(() => true),
    enableKeyboard: vi.fn(),
    disableKeyboard: vi.fn(),
    isKeyboardEnabled: vi.fn(() => true),
    enableTextEditMode: vi.fn(),
    disableTextEditMode: vi.fn(),
    isTextEditModeEnabled: vi.fn(() => false),
    setKeyboardScope: vi.fn(),
    getKeyboardScope: vi.fn(() => "default" as const),
    toggleGrid: vi.fn(() => true),
    showGrid: vi.fn(() => true),
    hideGrid: vi.fn(() => true),
    isGridVisible: vi.fn(() => false),
    toggleRulers: vi.fn(() => true),
    showRulers: vi.fn(() => true),
    hideRulers: vi.fn(() => true),
    areRulersVisible: vi.fn(() => false),
    canvasToContent: vi.fn(),
    getVisibleArea: vi.fn(),
    isPointVisible: vi.fn(() => true),
    getBounds: vi.fn(() => ({ width: 100, height: 100 })),
    updateThemeMode: vi.fn(() => true),
    toggleThemeMode: vi.fn(() => "light" as const),
    updateTransition: vi.fn(() => true),
    toggleTransitionMode: vi.fn(() => true),
    event,
    cleanup: vi.fn(),
    destroy: vi.fn(),
    get isReady() {
      return true;
    },
    get isTransforming() {
      return false;
    },
    visibleBounds: { x: 0, y: 0, width: 10, height: 10 },
  };
  return { canvas: canvas as unknown as MarkupCanvas, config };
}

describe("bindCanvasToWindow", () => {
  afterEach(() => {
    cleanupWindowBinding(createMarkupCanvasConfig({ name: "bindWindowTest" }));
    cleanupWindowBinding(createMarkupCanvasConfig({ name: "customApiName" }));
    cleanupWindowBinding(createMarkupCanvasConfig({}));
  });

  it("assigns a WindowAPI to window[config.name] and registers __markupCanvasInstances", () => {
    const { canvas, config } = createBindWindowTestDouble("bindWindowTest");
    bindCanvasToWindow(canvas, config);

    const w = window as unknown as Record<string, unknown>;
    const api = w.bindWindowTest as WindowAPI;
    expect(api).toBeDefined();
    expect(api.event).toBe(canvas.event);
    expect(api.zoom.current).toBe(1.25);
    expect(api.config.current).toBe(config);

    const instances = w.__markupCanvasInstances as Map<string, WindowAPI>;
    expect(instances.get("bindWindowTest")).toBe(api);
  });

  it("delegates zoom.in to canvas.zoomIn", () => {
    const { canvas, config } = createBindWindowTestDouble("bindWindowTest");
    bindCanvasToWindow(canvas, config);

    const api = (window as unknown as Record<string, WindowAPI>).bindWindowTest;
    api.zoom.in();
    expect(canvas.zoomIn).toHaveBeenCalledOnce();
  });

  it("uses a custom global name when config.name is set", () => {
    const { canvas, config } = createBindWindowTestDouble("customApiName");
    bindCanvasToWindow(canvas, config);

    const w = window as unknown as Record<string, unknown>;
    expect(w.customApiName).toBeDefined();
    expect((w.__markupCanvasInstances as Map<string, unknown>).get("customApiName")).toBe(w.customApiName);
  });
});
