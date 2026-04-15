import type { PostMessageRule } from "./types";

/**
 * Ordered list of postMessage action rules evaluated by {@link dispatchPostMessageRules}.
 * The rule whose `action` matches the incoming name runs; each action appears at most once.
 */
export const postMessageRules: readonly PostMessageRule[] = [
  {
    id: "zoom-in",
    action: "zoomIn",
    run: (canvas, _payload) => {
      canvas.zoomIn();
    },
  },
  {
    id: "zoom-out",
    action: "zoomOut",
    run: (canvas, _payload) => {
      canvas.zoomOut();
    },
  },
  {
    id: "set-zoom",
    action: "setZoom",
    run: (canvas, payload) => {
      const zoomLevel = payload as number;
      if (typeof zoomLevel !== "number" || zoomLevel <= 0) {
        throw new Error(`Invalid zoom level: ${zoomLevel}. Must be a positive number.`);
      }
      canvas.setZoom(zoomLevel);
    },
  },
  {
    id: "reset-zoom",
    action: "resetZoom",
    run: (canvas) => {
      canvas.resetZoom();
    },
  },
  {
    id: "reset-transform",
    action: "reset",
    run: (canvas) => {
      canvas.reset();
    },
  },
  {
    id: "pan-left",
    action: "panLeft",
    run: (canvas, payload) => {
      canvas.panLeft(payload as number | undefined);
    },
  },
  {
    id: "pan-right",
    action: "panRight",
    run: (canvas, payload) => {
      canvas.panRight(payload as number | undefined);
    },
  },
  {
    id: "pan-up",
    action: "panUp",
    run: (canvas, payload) => {
      canvas.panUp(payload as number | undefined);
    },
  },
  {
    id: "pan-down",
    action: "panDown",
    run: (canvas, payload) => {
      canvas.panDown(payload as number | undefined);
    },
  },
  {
    id: "fit-to-screen",
    action: "fitToScreen",
    run: (canvas) => {
      canvas.fitToScreen();
    },
  },
  {
    id: "center-content",
    action: "centerContent",
    run: (canvas) => {
      canvas.centerContent();
    },
  },
  {
    id: "pan-to-point",
    action: "panToPoint",
    run: (canvas, payload) => {
      const point = payload as { x: number; y: number };
      canvas.panToPoint(point.x, point.y);
    },
  },
  {
    id: "toggle-rulers",
    action: "toggleRulers",
    run: (canvas) => {
      canvas.toggleRulers();
    },
  },
  {
    id: "show-rulers",
    action: "showRulers",
    run: (canvas) => {
      canvas.showRulers();
    },
  },
  {
    id: "hide-rulers",
    action: "hideRulers",
    run: (canvas) => {
      canvas.hideRulers();
    },
  },
  {
    id: "toggle-grid",
    action: "toggleGrid",
    run: (canvas) => {
      canvas.toggleGrid();
    },
  },
  {
    id: "show-grid",
    action: "showGrid",
    run: (canvas) => {
      canvas.showGrid();
    },
  },
  {
    id: "hide-grid",
    action: "hideGrid",
    run: (canvas) => {
      canvas.hideGrid();
    },
  },
  {
    id: "update-theme-mode",
    action: "updateThemeMode",
    run: (canvas, payload) => {
      const mode = payload as "light" | "dark";
      if (mode !== "light" && mode !== "dark") {
        throw new Error(`Invalid theme mode: ${mode}`);
      }
      canvas.updateThemeMode(mode);
    },
  },
  {
    id: "toggle-theme-mode",
    action: "toggleThemeMode",
    run: (canvas) => {
      const currentConfig = canvas.getConfig();
      const newMode = currentConfig.themeMode === "light" ? "dark" : "light";
      canvas.updateThemeMode(newMode);
    },
  },
  {
    id: "update-transition",
    action: "updateTransition",
    run: (canvas, payload) => {
      const enabled = payload as boolean;
      if (typeof enabled !== "boolean") {
        throw new Error(`Invalid transition enabled value: ${enabled}. Must be a boolean.`);
      }
      canvas.updateTransition(enabled);
    },
  },
  {
    id: "toggle-transition-mode",
    action: "toggleTransitionMode",
    run: (canvas) => {
      canvas.toggleTransitionMode();
    },
  },
];
