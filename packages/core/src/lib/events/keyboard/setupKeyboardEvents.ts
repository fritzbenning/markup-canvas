import { sendPostMessage } from "@/lib/events/postMessage/utils/sendPostMessage";
import { withFeatureEnabled } from "@/lib/helpers";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { MarkupCanvasConfig } from "@/types/index";
import { dispatchKeyboardRules } from "./dispatchKeyboardRules";
import type { KeyboardContext, KeyboardScope, SetupKeyboardEventsOptions } from "./types";
import { isCanvasShortcut } from "./utils/isCanvasShortcut";

/**
 * Attaches a `keydown` listener on the document or the canvas container (see
 * `config.bindKeyboardEventsTo`) to handle canvas keyboard shortcuts and optional
 * parent postMessage forwarding.
 *
 * Returns a cleanup function that removes the listener.
 *
 * @param canvas - Markup canvas instance (uses `container` when binding to `"canvas"`).
 * @param config - Fully resolved canvas config.
 * @param options - Optional {@link SetupKeyboardEventsOptions}, e.g. `keyboardScope`.
 * @returns A function that removes the `keydown` listener when called.
 *
 * @example
 * ```ts
 * const remove = setupKeyboardEvents(canvas, config, { keyboardScope: "default" });
 * // later:
 * remove();
 * ```
 */
export function setupKeyboardEvents(
  canvas: MarkupCanvas,
  config: Required<MarkupCanvasConfig>,
  options?: SetupKeyboardEventsOptions,
): () => void {
  const keyboardScope: KeyboardScope = options?.keyboardScope ?? "default";

  function handleKeyDown(event: Event): void {
    if (!(event instanceof KeyboardEvent)) return;

    if (config.bindKeyboardEventsTo === "canvas" && document.activeElement !== canvas.container) return;

    withFeatureEnabled(config, "sendKeyboardEventsToParent", () => {
      if (keyboardScope === "restricted" && !isCanvasShortcut(event)) {
        return;
      }

      const canvasName = config.name || "markupCanvas";

      sendPostMessage(canvasName, "keyboardShortcut", {
        key: event.key,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        code: event.code,
      });
      event.preventDefault();
    });

    if (config.sendKeyboardEventsToParent) {
      return;
    }

    const ctx: KeyboardContext = {
      canvas,
      config,
      keyboardScope,
    };

    if (dispatchKeyboardRules(event, ctx)) {
      event.preventDefault();
    }
  }

  const keyboardTarget = config.bindKeyboardEventsTo === "canvas" ? canvas.container : document;

  keyboardTarget.addEventListener("keydown", handleKeyDown);

  return () => {
    keyboardTarget.removeEventListener("keydown", handleKeyDown);
  };
}
