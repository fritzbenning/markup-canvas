import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import { createMouseTestCanvas } from "../test/createMouseTestCanvas";
import { handleMouseMove } from "./handleMouseMove";

vi.mock("@/lib/helpers", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@/lib/helpers")>();
  return {
    ...mod,
    withRAFThrottle: <T extends (...args: unknown[]) => void>(fn: T) =>
      Object.assign((...args: unknown[]) => fn(...args), { cleanup: () => {} }) as T & { cleanup: () => void },
  };
});

describe("handleMouseMove", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("applies pan delta when dragging", () => {
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig({ requireSpaceForMouseDrag: false });
    const setters = {
      setHasDragged: vi.fn(),
      setIsDragging: vi.fn(),
      setLastMouseX: vi.fn(),
      setLastMouseY: vi.fn(),
    };
    const event = new MouseEvent("mousemove", { clientX: 15, clientY: 25, cancelable: true, bubbles: true });
    handleMouseMove(event, canvas, config, true, true, false, 0, 0, 0, 10, 20, setters);
    expect(event.defaultPrevented).toBe(true);
    expect(canvas.updateTransform).toHaveBeenCalledWith({
      translateX: 15,
      translateY: 25,
    });
    expect(setters.setLastMouseX).toHaveBeenCalledWith(15);
    expect(setters.setLastMouseY).toHaveBeenCalledWith(25);
  });
});
