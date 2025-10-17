import type { RulerCanvas as Canvas, MarkupCanvasConfig, RulerSystem } from "@/types/index.js";
import { createRulerElements } from "./createRulerElements.js";
import type { RulerElements } from "./RulerElements.js";
import { setupRulerEvents } from "./setupRulerEvents.js";
import { updateRulers } from "./updateRulers.js";

export function createRulers(canvas: Canvas, config: Required<MarkupCanvasConfig>): RulerSystem | null {
  if (!canvas?.container) {
    console.error("Invalid canvas provided to createRulers");
    return null;
  }

  let elements: RulerElements;
  let cleanupEvents: (() => void) | null = null;
  let isDestroyed = false;

  const rulerOptions = {
    backgroundColor: config.rulerBackgroundColor,
    borderColor: config.rulerBorderColor,
    textColor: config.rulerTextColor,
    majorTickColor: config.rulerMajorTickColor,
    minorTickColor: config.rulerMinorTickColor,
    fontSize: config.rulerFontSize,
    fontFamily: config.rulerFontFamily,
    showGrid: config.enableGrid,
    gridColor: config.gridColor,
    units: config.rulerUnits,
    rulerSize: config.rulerSize,
  };

  const safeUpdate = (): void => {
    if (isDestroyed || !elements.horizontalRuler || !elements.verticalRuler) return;
    updateRulers(canvas, elements.horizontalRuler, elements.verticalRuler, elements.gridOverlay, rulerOptions);
  };

  try {
    elements = createRulerElements(canvas.container, rulerOptions);
    cleanupEvents = setupRulerEvents(canvas, safeUpdate);

    safeUpdate();

    return {
      horizontalRuler: elements.horizontalRuler,
      verticalRuler: elements.verticalRuler,
      cornerBox: elements.cornerBox,
      gridOverlay: elements.gridOverlay,

      update: safeUpdate,

      show: () => {
        if (elements.horizontalRuler) elements.horizontalRuler.style.display = "block";
        if (elements.verticalRuler) elements.verticalRuler.style.display = "block";
        if (elements.cornerBox) elements.cornerBox.style.display = "flex";
        if (elements.gridOverlay) elements.gridOverlay.style.display = "block";
      },

      hide: () => {
        if (elements.horizontalRuler) elements.horizontalRuler.style.display = "none";
        if (elements.verticalRuler) elements.verticalRuler.style.display = "none";
        if (elements.cornerBox) elements.cornerBox.style.display = "none";
        if (elements.gridOverlay) elements.gridOverlay.style.display = "none";
      },

      toggleGrid: () => {
        if (elements.gridOverlay) {
          const isVisible = elements.gridOverlay.style.display !== "none";
          elements.gridOverlay.style.display = isVisible ? "none" : "block";
        }
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
