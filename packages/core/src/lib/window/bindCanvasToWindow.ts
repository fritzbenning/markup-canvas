import type { MarkupCanvas } from "@/lib/MarkupCanvas.js";
import type { MarkupCanvasConfig, WindowAPI } from "@/types/index.js";

export function bindCanvasToWindow(canvas: MarkupCanvas, config: Required<MarkupCanvasConfig>): void {
  if (typeof window === "undefined") {
    return;
  }

  const canvasName = config.name || "markupCanvas";
  const windowObj = window as unknown as Record<string, unknown>;

  const api: WindowAPI = {
    config: {
      get current() {
        return canvas.config;
      },
      get: canvas.getConfig.bind(canvas),
      update: canvas.updateConfig.bind(canvas),
    },
    // Transform group
    transform: {
      update: canvas.updateTransform.bind(canvas),
      reset: canvas.reset.bind(canvas),
    },

    // Zoom group
    zoom: {
      set: canvas.setZoom.bind(canvas),
      toPoint: canvas.zoomToPoint.bind(canvas),
      in: canvas.zoomIn.bind(canvas),
      out: canvas.zoomOut.bind(canvas),
      reset: canvas.resetZoom.bind(canvas),
      resetToCenter: canvas.resetViewToCenter.bind(canvas),
      fitToScreen: canvas.fitToScreen.bind(canvas),
    },

    // Pan group
    pan: {
      left: canvas.panLeft.bind(canvas),
      right: canvas.panRight.bind(canvas),
      up: canvas.panUp.bind(canvas),
      down: canvas.panDown.bind(canvas),
      toPoint: canvas.scrollToPoint.bind(canvas),
      toCenter: canvas.centerContent.bind(canvas),
    },

    // Mouse drag group
    mouseDrag: {
      enable: canvas.enableMouseDrag.bind(canvas),
      disable: canvas.disableMouseDrag.bind(canvas),
      isEnabled: canvas.isMouseDragEnabled.bind(canvas),
    },

    // Grid group
    grid: {
      toggle: canvas.toggleGrid.bind(canvas),
      show: canvas.showGrid.bind(canvas),
      hide: canvas.hideGrid.bind(canvas),
      isVisible: canvas.isGridVisible.bind(canvas),
    },

    // Ruler group
    rulers: {
      toggle: canvas.toggleRulers.bind(canvas),
      show: canvas.showRulers.bind(canvas),
      hide: canvas.hideRulers.bind(canvas),
      isVisible: canvas.areRulersVisible.bind(canvas),
    },

    // Utility group
    canvas: {
      canvasToContent: canvas.canvasToContent.bind(canvas),
      getVisibleArea: canvas.getVisibleArea.bind(canvas),
      isPointVisible: canvas.isPointVisible.bind(canvas),
      getBounds: canvas.getBounds.bind(canvas),
    },

    theme: {
      get current() {
        return canvas.config.themeMode;
      },
      update: canvas.updateThemeMode.bind(canvas),
      toggle: canvas.toggleThemeMode.bind(canvas),
    },

    transition: {
      get current() {
        return canvas.config.enableTransition;
      },
      set: canvas.updateTransition.bind(canvas),
      toggle: canvas.toggleTransitionMode.bind(canvas),
    },

    // Event group
    event: canvas.event,

    // Lifecycle group
    lifecycle: {
      cleanup: canvas.cleanup.bind(canvas),
      destroy: canvas.destroy.bind(canvas),
    },

    // Properties/State group
    state: {
      get isReady() {
        return canvas.isReady;
      },
      get isTransforming() {
        return canvas.isTransforming;
      },
      get visibleBounds() {
        return canvas.visibleBounds;
      },
      get transform() {
        return canvas.transform;
      },
    },
  };

  // Bind public API to window
  windowObj[canvasName] = api;

  // Track all instances
  if (!windowObj.__markupCanvasInstances) {
    windowObj.__markupCanvasInstances = new Map();
  }
  (windowObj.__markupCanvasInstances as unknown as Map<string, unknown>).set(canvasName, api);
}
