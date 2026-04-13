import { describe, expect, it, vi } from "vitest";
import { updateCursor } from "@/lib/events/mouse/cursor/updateCursor";
import { createMouseTestCanvas } from "@/lib/events/mouse/test/createMouseTestCanvas";
import { resetDragState } from "./resetDragState";

vi.mock("@/lib/events/mouse/cursor/updateCursor", () => ({
  updateCursor: vi.fn(),
}));

describe("resetDragState", () => {
  it("clears drag state and calls updateCursor with isDragging false", () => {
    const canvas = createMouseTestCanvas();
    const setIsDragging = vi.fn();
    const setDragButton = vi.fn();

    resetDragState(canvas, canvas.config, true, false, {
      setIsDragging,
      setDragButton,
    });

    expect(setIsDragging).toHaveBeenCalledWith(false);
    expect(setDragButton).toHaveBeenCalledWith(-1);
    expect(updateCursor).toHaveBeenCalledWith(canvas, canvas.config, true, false, false);
  });
});
