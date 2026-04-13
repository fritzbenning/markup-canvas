import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import { updateCursor } from "@/lib/events/mouse/cursor/updateCursor";
import { resetDragState } from "@/lib/events/shared/resetDragState";
import { handleKeyUp } from "./handleKeyUp";

vi.mock("@/lib/events/mouse/cursor/updateCursor", () => ({
  updateCursor: vi.fn(),
}));

vi.mock("@/lib/events/shared/resetDragState", () => ({
  resetDragState: vi.fn(),
}));

describe("handleKeyUp", () => {
  const canvas = {} as MarkupCanvas;

  beforeEach(() => {
    vi.mocked(updateCursor).mockClear();
    vi.mocked(resetDragState).mockClear();
  });

  it("does nothing when requireSpaceForMouseDrag is false", () => {
    const config = createMarkupCanvasConfig({ requireSpaceForMouseDrag: false });
    const setters = {
      setIsSpacePressed: vi.fn(),
      setIsDragging: vi.fn(),
      setDragButton: vi.fn(),
    };
    handleKeyUp(new KeyboardEvent("keyup", { key: " " }), canvas, config, true, false, setters);
    expect(setters.setIsSpacePressed).not.toHaveBeenCalled();
    expect(updateCursor).not.toHaveBeenCalled();
    expect(resetDragState).not.toHaveBeenCalled();
  });

  it("clears space and updates cursor when Space is released", () => {
    const config = createMarkupCanvasConfig({ requireSpaceForMouseDrag: true });
    const setters = {
      setIsSpacePressed: vi.fn(),
      setIsDragging: vi.fn(),
      setDragButton: vi.fn(),
    };
    handleKeyUp(new KeyboardEvent("keyup", { key: " " }), canvas, config, true, false, setters);
    expect(setters.setIsSpacePressed).toHaveBeenCalledWith(false);
    expect(updateCursor).toHaveBeenCalledWith(canvas, config, true, false, false);
    expect(resetDragState).not.toHaveBeenCalled();
  });

  it("resets drag state when Space is released during a drag", () => {
    const config = createMarkupCanvasConfig({ requireSpaceForMouseDrag: true });
    const setters = {
      setIsSpacePressed: vi.fn(),
      setIsDragging: vi.fn(),
      setDragButton: vi.fn(),
    };
    handleKeyUp(new KeyboardEvent("keyup", { key: " " }), canvas, config, true, true, setters);
    expect(resetDragState).toHaveBeenCalledWith(canvas, config, true, false, {
      setIsDragging: setters.setIsDragging,
      setDragButton: setters.setDragButton,
    });
  });
});
