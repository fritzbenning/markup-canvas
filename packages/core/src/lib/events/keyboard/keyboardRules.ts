import { getAdaptiveZoomSpeed } from "@/lib/events/shared/getAdaptiveZoomSpeed";
import type { KeyboardRule } from "./types";

/**
 * Ordered list of default keyboard shortcut rules evaluated by {@link dispatchKeyboardRules}.
 * The first matching rule whose `run` returns a truthy value wins; rules with `scope: "default"`
 * are skipped in restricted keyboard scope.
 *
 * @example
 * ```ts
 * // Rules are internal; consumers customize behavior via MarkupCanvas API (e.g. pan/zoom).
 * // Matching is done in dispatchKeyboardRules using matchesKeyboardRule.
 * ```
 */
export const keyboardRules: readonly KeyboardRule[] = [
  {
    id: "pan-left",
    scope: "default",
    keys: "ArrowLeft",
    run: (_e, { canvas }) => canvas.panLeft(),
  },
  {
    id: "pan-right",
    scope: "default",
    keys: "ArrowRight",
    run: (_e, { canvas }) => canvas.panRight(),
  },
  {
    id: "pan-up",
    scope: "default",
    keys: "ArrowUp",
    run: (_e, { canvas }) => canvas.panUp(),
  },
  {
    id: "pan-down",
    scope: "default",
    keys: "ArrowDown",
    run: (_e, { canvas }) => canvas.panDown(),
  },
  {
    id: "zoom-in",
    scope: "default",
    keys: ["=", "+"],
    run: (_e, { canvas, config }) => {
      const step = config.enableAdaptiveSpeed ? getAdaptiveZoomSpeed(canvas, config.keyboardZoomStep) : config.keyboardZoomStep;
      return canvas.zoomIn(step);
    },
  },
  {
    id: "zoom-out",
    scope: "default",
    keys: "-",
    run: (_e, { canvas, config }) => {
      const step = config.enableAdaptiveSpeed ? getAdaptiveZoomSpeed(canvas, config.keyboardZoomStep) : config.keyboardZoomStep;

      return canvas.zoomOut(step);
    },
  },
  {
    id: "reset-zoom",
    keys: "0",
    withModifiers: ["meta"],
    withoutModifiers: ["ctrl"],
    run: (_e, { canvas }) => {
      if (canvas.resetZoom) {
        canvas.resetZoom();
      }
      return true;
    },
  },
  {
    id: "reset-transform",
    keys: "0",
    withModifiers: ["ctrl"],
    run: (_e, { canvas }) => {
      if (canvas.reset) {
        canvas.reset();
      }
      return true;
    },
  },
  {
    id: "toggle-grid",
    keys: ["g", "G"],
    withModifiers: ["shift"],
    withoutModifiers: ["ctrl", "meta", "alt"],
    run: (_e, { canvas }) => (canvas.toggleGrid ? canvas.toggleGrid() : false),
  },
  {
    id: "toggle-rulers",
    keys: ["r", "R"],
    withModifiers: ["shift"],
    withoutModifiers: ["meta", "ctrl", "alt"],
    run: (_e, { canvas }) => (canvas.toggleRulers ? canvas.toggleRulers() : false),
  },
];
