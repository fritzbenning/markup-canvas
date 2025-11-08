import type { MarkupCanvas } from "@/lib/MarkupCanvas.js";
import type { PostMessageAction } from "@/types/events";
import { sendPostMessageError } from "./sendPostMessageError";

export function processPostMessage(
  canvas: MarkupCanvas,
  action: PostMessageAction,
  payload: string | number | boolean | object,
  canvasName: string
): void {
  try {
    // View methods
    switch (action) {
      case "zoomIn":
        canvas.zoomIn(payload as number | undefined);
        break;
      case "zoomOut":
        canvas.zoomOut(payload as number | undefined);
        break;
      case "setZoom": {
        const zoomLevel = payload as number;
        if (typeof zoomLevel !== "number" || zoomLevel <= 0) {
          throw new Error(`Invalid zoom level: ${zoomLevel}. Must be a positive number.`);
        }
        canvas.setZoom(zoomLevel);
        break;
      }
      case "resetZoom":
        canvas.resetZoom();
        break;
      case "panLeft":
        canvas.panLeft(payload as number | undefined);
        break;
      case "panRight":
        canvas.panRight(payload as number | undefined);
        break;
      case "panUp":
        canvas.panUp(payload as number | undefined);
        break;
      case "panDown":
        canvas.panDown(payload as number | undefined);
        break;
      case "fitToScreen":
        canvas.fitToScreen();
        break;
      case "centerContent":
        canvas.centerContent();
        break;
      case "panToPoint": {
        const point = payload as { x: number; y: number };
        canvas.panToPoint(point.x, point.y);
        break;
      }
      case "resetView":
        canvas.resetView();
        break;
      case "resetViewToCenter":
        canvas.resetViewToCenter();
        break;
      case "resetToInitial":
        canvas.resetToInitial();
        break;
      // Ruler/Grid methods
      case "toggleRulers":
        canvas.toggleRulers();
        break;
      case "showRulers":
        canvas.showRulers();
        break;
      case "hideRulers":
        canvas.hideRulers();
        break;
      case "toggleGrid":
        canvas.toggleGrid();
        break;
      case "showGrid":
        canvas.showGrid();
        break;
      case "hideGrid":
        canvas.hideGrid();
        break;
      // Config methods
      case "updateThemeMode": {
        const mode = payload as "light" | "dark";
        if (mode !== "light" && mode !== "dark") {
          throw new Error(`Invalid theme mode: ${mode}`);
        }
        canvas.updateThemeMode(mode);
        break;
      }
      case "toggleThemeMode": {
        const currentConfig = canvas.getConfig();
        const newMode = currentConfig.themeMode === "light" ? "dark" : "light";
        canvas.updateThemeMode(newMode);
        break;
      }
      // Transition methods
      case "updateTransition": {
        const enabled = payload as boolean;
        if (typeof enabled !== "boolean") {
          throw new Error(`Invalid transition enabled value: ${enabled}. Must be a boolean.`);
        }
        canvas.updateTransition(enabled);
        break;
      }
      case "toggleTransitionMode":
        canvas.toggleTransitionMode();
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendPostMessageError(canvasName, action, errorMessage);
  }
}
