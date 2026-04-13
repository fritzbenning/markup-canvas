import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { PostMessageAction } from "@/types/events";
import { postMessageRules } from "../postMessageRules";

/**
 * Walks the global {@link postMessageRules} list and runs the rule whose `action`
 * matches the requested name.
 *
 * @param canvas - Target canvas instance.
 * @param action - Remote procedure name (zoom, pan, theme, etc.).
 * @param payload - Action argument(s); shape depends on `action`.
 * @throws Error when no rule matches `action` or when a rule rejects `payload`.
 */
export function dispatchPostMessageRules(
  canvas: MarkupCanvas,
  action: PostMessageAction,
  payload: string | number | boolean | object
): void {
  for (const rule of postMessageRules) {
    if (rule.action === action) {
      rule.run(canvas, payload);
      return;
    }
  }
  throw new Error(`Unknown action: ${action}`);
}
