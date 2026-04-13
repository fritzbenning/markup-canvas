import { describe, expect, it, vi } from "vitest";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import { resetDragState } from "@/lib/events/shared/resetDragState";
import { createMouseTestCanvas } from "../test/createMouseTestCanvas";
import { handleMouseLeave } from "./handleMouseLeave";

vi.mock("@/lib/events/shared/resetDragState", () => ({
  resetDragState: vi.fn(),
}));

describe("handleMouseLeave", () => {
  it("calls resetDragState when dragging", () => {
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig();
    const setters = {
      setIsDragging: vi.fn(),
      setDragButton: vi.fn(),
    };
    handleMouseLeave(canvas, config, true, false, true, setters);
    expect(resetDragState).toHaveBeenCalledWith(canvas, config, true, false, setters);
  });

  it("does nothing when not dragging", () => {
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig();
    vi.mocked(resetDragState).mockClear();
    handleMouseLeave(canvas, config, true, false, false, {
      setIsDragging: vi.fn(),
      setDragButton: vi.fn(),
    });
    expect(resetDragState).not.toHaveBeenCalled();
  });
});
