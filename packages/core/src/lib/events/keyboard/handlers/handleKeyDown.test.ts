import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import { updateCursor } from "@/lib/events/mouse/cursor/updateCursor";
import { handleKeyDown } from "./handleKeyDown";

vi.mock("@/lib/events/mouse/cursor/updateCursor", () => ({
  updateCursor: vi.fn(),
}));

describe("handleKeyDown", () => {
  const canvas = {} as MarkupCanvas;

  beforeEach(() => {
    vi.mocked(updateCursor).mockClear();
  });

  it("does nothing when requireSpaceForMouseDrag is false", () => {
    const config = createMarkupCanvasConfig({ requireSpaceForMouseDrag: false });
    const setIsSpacePressed = vi.fn();
    handleKeyDown(new KeyboardEvent("keydown", { key: " " }), canvas, config, true, false, {
      setIsSpacePressed,
    });
    expect(setIsSpacePressed).not.toHaveBeenCalled();
    expect(updateCursor).not.toHaveBeenCalled();
  });

  it("sets space pressed and updates cursor when Space is pressed with requireSpaceForMouseDrag", () => {
    const config = createMarkupCanvasConfig({ requireSpaceForMouseDrag: true });
    const setIsSpacePressed = vi.fn();
    handleKeyDown(new KeyboardEvent("keydown", { key: " " }), canvas, config, true, false, {
      setIsSpacePressed,
    });
    expect(setIsSpacePressed).toHaveBeenCalledWith(true);
    expect(updateCursor).toHaveBeenCalledWith(canvas, config, true, true, false);
  });
});
