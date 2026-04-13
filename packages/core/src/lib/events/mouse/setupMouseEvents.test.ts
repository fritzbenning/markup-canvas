import { afterEach, describe, expect, it, vi } from "vitest";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import { updateCursor } from "@/lib/events/mouse/cursor/updateCursor";
import { createMouseTestCanvas } from "./test/createMouseTestCanvas";
import { setupMouseEvents } from "./setupMouseEvents";

vi.mock("@/lib/events/mouse/cursor/updateCursor", () => ({
  updateCursor: vi.fn(),
}));

describe("setupMouseEvents", () => {
  afterEach(() => {
    vi.mocked(updateCursor).mockClear();
  });

  it("returns drag controls when withControls is true", () => {
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig({ requireSpaceForMouseDrag: false });
    const controls = setupMouseEvents(canvas, config, true);
    expect(controls.cleanup).toBeTypeOf("function");
    expect(controls.enable()).toBe(true);
    expect(controls.disable()).toBe(true);
    expect(controls.isEnabled()).toBe(false);
    controls.cleanup();
  });

  it("returns only cleanup when withControls is false", () => {
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig({ requireSpaceForMouseDrag: false });
    const cleanup = setupMouseEvents(canvas, config, false);
    expect(cleanup).toBeTypeOf("function");
    cleanup();
  });

  it("calls updateCursor after wiring listeners", () => {
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig({ requireSpaceForMouseDrag: false });
    const controls = setupMouseEvents(canvas, config, true);
    expect(updateCursor).toHaveBeenCalled();
    controls.cleanup();
  });
});
