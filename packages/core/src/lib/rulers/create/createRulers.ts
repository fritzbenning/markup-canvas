import type { RulerCanvas as Canvas, MarkupCanvasConfig, RulerSystem } from "@/types/index";
import type { RulerElements } from "@/types/rulers";
import { setupRulerEvents } from "../events/setupRulerEvents";
import { updateRulers } from "../update/updateRulers";
import { updateRulerTheme } from "../update/updateRulerTheme";
import { createRulerElements } from "./createRulerElements";

export function createRulers(canvas: Canvas, config: Required<MarkupCanvasConfig>): RulerSystem | null {
  if (!canvas?.container) {
    console.error("Invalid canvas provided to createRulers");
    return null;
  }

  let elements: RulerElements;
  let cleanupEvents: (() => void) | null = null;
  let isDestroyed = false;

  const safeUpdate = (): void => {
    if (isDestroyed || !elements.horizontalRuler || !elements.verticalRuler) return;
    updateRulers(canvas, elements.horizontalRuler, elements.verticalRuler, elements.gridOverlay, config);
  };

  try {
    elements = createRulerElements(canvas.container, config);
    cleanupEvents = setupRulerEvents(canvas, safeUpdate);

    updateRulerTheme(elements, config);

    safeUpdate();

    const gridDisplayVisible = (): boolean => Boolean(elements.gridOverlay && elements.gridOverlay.style.display !== "none");

    const setGridDisplay = (visible: boolean): void => {
      if (!elements.gridOverlay) return;
      elements.gridOverlay.style.display = visible ? "block" : "none";
    };

    if (!config.showRulers) {
      elements.horizontalRuler.style.display = "none";
      elements.verticalRuler.style.display = "none";
      elements.cornerBox.style.display = "none";
    }
    if (!config.showGrid) {
      setGridDisplay(false);
    }

    return {
      horizontalRuler: elements.horizontalRuler,
      verticalRuler: elements.verticalRuler,
      cornerBox: elements.cornerBox,
      gridOverlay: elements.gridOverlay,

      update: safeUpdate,

      updateTheme: (newConfig: Required<MarkupCanvasConfig>) => {
        if (isDestroyed) return;

        // Update all ruler theme colors
        updateRulerTheme(elements, newConfig);
      },

      show: () => {
        if (elements.horizontalRuler) elements.horizontalRuler.style.display = "block";
        if (elements.verticalRuler) elements.verticalRuler.style.display = "block";
        if (elements.cornerBox) elements.cornerBox.style.display = "flex";
      },

      hide: () => {
        if (elements.horizontalRuler) elements.horizontalRuler.style.display = "none";
        if (elements.verticalRuler) elements.verticalRuler.style.display = "none";
        if (elements.cornerBox) elements.cornerBox.style.display = "none";
        setGridDisplay(false);
      },

      showGrid: (): boolean => {
        if (!elements.gridOverlay) return false;
        setGridDisplay(true);
        return true;
      },

      hideGrid: (): boolean => {
        if (!elements.gridOverlay) return false;
        setGridDisplay(false);
        return true;
      },

      isGridVisible: (): boolean => gridDisplayVisible(),

      toggleGrid: (): boolean => {
        if (!elements.gridOverlay) return false;
        setGridDisplay(!gridDisplayVisible());
        return true;
      },

      destroy: () => {
        isDestroyed = true;
        if (cleanupEvents) {
          cleanupEvents();
        }

        if (elements.horizontalRuler?.parentNode) {
          elements.horizontalRuler.parentNode.removeChild(elements.horizontalRuler);
        }
        if (elements.verticalRuler?.parentNode) {
          elements.verticalRuler.parentNode.removeChild(elements.verticalRuler);
        }
        if (elements.cornerBox?.parentNode) {
          elements.cornerBox.parentNode.removeChild(elements.cornerBox);
        }
        if (elements.gridOverlay?.parentNode) {
          elements.gridOverlay.parentNode.removeChild(elements.gridOverlay);
        }
      },
    };
  } catch (error) {
    console.error("Failed to create rulers:", error);
    return null;
  }
}
