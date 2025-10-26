import type { MarkupCanvas } from "@/lib/MarkupCanvas.js";
import type { PostMessageAction, PostMessageRequest } from "@/types/events";
import { sendPostMessageError } from "./sendError";

export function setupPostMessageEvents(canvas: MarkupCanvas): () => void {
  const handleMessage = (event: MessageEvent): void => {
    const data = event.data as PostMessageRequest;

    if (!["markup-canvas", "application"].includes(data.source)) {
      return;
    }

    console.log("data", event.data);

    const canvasName = canvas.config.name || "markupCanvas";

    if (data.canvasName !== canvasName) {
      console.log("canvasName", data.canvasName, "!==", canvasName);
      return;
    }

    const action = data.action as PostMessageAction;
    const payload = data.data as string | number | boolean | object;

    try {
      // View methods
      if (action === "zoomIn") {
        console.log("zoomIn", payload);
        canvas.zoomIn(payload as number | undefined);
      } else if (action === "zoomOut") {
        canvas.zoomOut(payload as number | undefined);
      } else if (action === "setZoom") {
        const zoomLevel = payload as number;
        if (typeof zoomLevel !== "number" || zoomLevel <= 0) {
          throw new Error(`Invalid zoom level: ${zoomLevel}. Must be a positive number.`);
        }
        canvas.setZoom(zoomLevel);
      } else if (action === "resetZoom") {
        canvas.resetZoom();
      } else if (action === "panLeft") {
        canvas.panLeft(payload as number | undefined);
      } else if (action === "panRight") {
        canvas.panRight(payload as number | undefined);
      } else if (action === "panUp") {
        canvas.panUp(payload as number | undefined);
      } else if (action === "panDown") {
        canvas.panDown(payload as number | undefined);
      } else if (action === "fitToScreen") {
        canvas.fitToScreen();
      } else if (action === "centerContent") {
        canvas.centerContent();
      } else if (action === "panToPoint") {
        canvas.panToPoint((payload as { x: number; y: number }).x, (payload as { x: number; y: number }).y);
      } else if (action === "resetView") {
        canvas.resetView();
      } else if (action === "resetViewToCenter") {
        canvas.resetViewToCenter();
      }
      // Ruler/Grid methods
      else if (action === "toggleRulers") {
        canvas.toggleRulers();
      } else if (action === "showRulers") {
        canvas.showRulers();
      } else if (action === "hideRulers") {
        canvas.hideRulers();
      } else if (action === "toggleGrid") {
        canvas.toggleGrid();
      } else if (action === "showGrid") {
        canvas.showGrid();
      } else if (action === "hideGrid") {
        canvas.hideGrid();
      }
      // Config methods
      else if (action === "updateThemeMode") {
        const mode = payload as "light" | "dark";
        if (mode !== "light" && mode !== "dark") {
          throw new Error(`Invalid theme mode: ${mode}`);
        }
        canvas.updateThemeMode(mode);
      } else if (action === "toggleThemeMode") {
        const currentConfig = canvas.getConfig();
        const newMode = currentConfig.themeMode === "light" ? "dark" : "light";
        canvas.updateThemeMode(newMode);
      }
      // Transition methods
      else if (action === "updateTransition") {
        const enabled = payload as boolean;
        if (typeof enabled !== "boolean") {
          throw new Error(`Invalid transition enabled value: ${enabled}. Must be a boolean.`);
        }
        canvas.updateTransition(enabled);
      } else if (action === "toggleTransitionMode") {
        canvas.toggleTransitionMode();
      } else {
        throw new Error(`Unknown action: ${action}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      sendPostMessageError(canvasName, action, errorMessage);
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("message", handleMessage);
  }

  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("message", handleMessage);
    }
  };
}
