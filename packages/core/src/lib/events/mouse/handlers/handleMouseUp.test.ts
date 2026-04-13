import { describe, expect, it, vi } from "vitest";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import { handleClickToZoom } from "@/lib/events/mouse/handlers/handleClickToZoom";
import { resetDragState } from "@/lib/events/shared/resetDragState";
import { createMouseTestCanvas } from "../test/createMouseTestCanvas";
import { handleMouseUp } from "./handleMouseUp";

vi.mock("@/lib/events/shared/resetDragState", () => ({
  resetDragState: vi.fn(),
}));

vi.mock("@/lib/events/mouse/handlers/handleClickToZoom", () => ({
  handleClickToZoom: vi.fn(),
}));

describe("handleMouseUp", () => {
  it("resets drag state when releasing the active drag button", () => {
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig();
    const setters = {
      setIsDragging: vi.fn(),
      setDragButton: vi.fn(),
      setMouseDownTime: vi.fn(),
      setHasDragged: vi.fn(),
    };
    const event = new MouseEvent("mouseup", { button: 0 });
    handleMouseUp(event, canvas, config, true, false, true, 0, 0, false, setters);
    expect(resetDragState).toHaveBeenCalled();
  });

  it("invokes click-to-zoom for a short left click when enabled", () => {
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig({ enableClickToZoom: true });
    const setters = {
      setIsDragging: vi.fn(),
      setDragButton: vi.fn(),
      setMouseDownTime: vi.fn(),
      setHasDragged: vi.fn(),
    };
    const event = new MouseEvent("mouseup", { button: 0 });
    handleMouseUp(event, canvas, config, true, false, false, -1, Date.now(), false, setters);
    expect(handleClickToZoom).toHaveBeenCalled();
  });

  it("clears click state on left button up", () => {
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig({ enableClickToZoom: false });
    const setters = {
      setIsDragging: vi.fn(),
      setDragButton: vi.fn(),
      setMouseDownTime: vi.fn(),
      setHasDragged: vi.fn(),
    };
    const event = new MouseEvent("mouseup", { button: 0 });
    handleMouseUp(event, canvas, config, true, false, false, -1, 0, false, setters);
    expect(setters.setMouseDownTime).toHaveBeenCalledWith(0);
    expect(setters.setHasDragged).toHaveBeenCalledWith(false);
  });
});
