import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { PostMessageAction } from "@/types/events";

/**
 * Declarative handler for a single {@link PostMessageAction}, evaluated by
 * {@link dispatchPostMessageRules}.
 */
export type PostMessageRule = {
  id: string;
  action: PostMessageAction;
  run: (canvas: MarkupCanvas, payload: string | number | boolean | object) => void;
};
