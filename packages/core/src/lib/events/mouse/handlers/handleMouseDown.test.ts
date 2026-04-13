import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import { updateCursor } from "@/lib/events/mouse/cursor/updateCursor";
import { createMouseTestCanvas } from "../test/createMouseTestCanvas";
import { handleMouseDown } from "./handleMouseDown";

vi.mock("@/lib/events/mouse/cursor/updateCursor", () => ({
  updateCursor: vi.fn(),
}));

describe("handleMouseDown", () => {
  beforeEach(() => {
    vi.mocked(updateCursor).mockClear();
  });

  it("records left-button metadata", () => {
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig();
    const setters = {
      setMouseDownTime: vi.fn(),
      setMouseDownX: vi.fn(),
      setMouseDownY: vi.fn(),
      setHasDragged: vi.fn(),
      setIsDragging: vi.fn(),
      setDragButton: vi.fn(),
      setLastMouseX: vi.fn(),
      setLastMouseY: vi.fn(),
    };
    const event = new MouseEvent("mousedown", { button: 0, clientX: 12, clientY: 34, cancelable: true });
    handleMouseDown(event, canvas, config, true, false, setters);
    expect(setters.setMouseDownTime).toHaveBeenCalled();
    expect(setters.setMouseDownX).toHaveBeenCalledWith(12);
    expect(setters.setMouseDownY).toHaveBeenCalledWith(34);
    expect(setters.setHasDragged).toHaveBeenCalledWith(false);
  });

  it("prepares drag and updates cursor for left drag when allowed", () => {
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig({ enableLeftDrag: true, requireSpaceForMouseDrag: false });
    const setters = {
      setMouseDownTime: vi.fn(),
      setMouseDownX: vi.fn(),
      setMouseDownY: vi.fn(),
      setHasDragged: vi.fn(),
      setIsDragging: vi.fn(),
      setDragButton: vi.fn(),
      setLastMouseX: vi.fn(),
      setLastMouseY: vi.fn(),
    };
    const event = new MouseEvent("mousedown", { button: 0, clientX: 5, clientY: 6, cancelable: true });
    handleMouseDown(event, canvas, config, true, false, setters);
    expect(event.defaultPrevented).toBe(true);
    expect(setters.setDragButton).toHaveBeenCalledWith(0);
    expect(setters.setLastMouseX).toHaveBeenCalledWith(5);
    expect(setters.setLastMouseY).toHaveBeenCalledWith(6);
    expect(updateCursor).toHaveBeenCalledWith(canvas, config, true, false, false);
  });
});
