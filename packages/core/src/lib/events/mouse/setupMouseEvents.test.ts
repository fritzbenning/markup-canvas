import { afterEach, describe, expect, it, vi } from "vitest";
import { updateCursor } from "@/lib/events/mouse/cursor/updateCursor";
import { setupMouseEvents } from "./setupMouseEvents";
import { createMouseTestCanvas } from "./test/createMouseTestCanvas";

vi.mock("@/lib/events/mouse/cursor/updateCursor", () => ({
  updateCursor: vi.fn(),
}));

describe("setupMouseEvents", () => {
  afterEach(() => {
    vi.mocked(updateCursor).mockClear();
  });

  it("returns drag controls when withControls is true", () => {
    const canvas = createMouseTestCanvas({ requireSpaceForMouseDrag: false });
    const controls = setupMouseEvents(canvas, canvas.config, true);
    expect(controls.cleanup).toBeTypeOf("function");
    expect(controls.enable()).toBe(true);
    expect(controls.disable()).toBe(true);
    expect(controls.isEnabled()).toBe(false);
    controls.cleanup();
  });

  it("returns only cleanup when withControls is false", () => {
    const canvas = createMouseTestCanvas({ requireSpaceForMouseDrag: false });
    const cleanup = setupMouseEvents(canvas, canvas.config, false);
    expect(cleanup).toBeTypeOf("function");
    cleanup();
  });

  it("calls updateCursor after wiring listeners", () => {
    const canvas = createMouseTestCanvas({ requireSpaceForMouseDrag: false });
    const controls = setupMouseEvents(canvas, canvas.config, true);
    expect(updateCursor).toHaveBeenCalled();
    controls.cleanup();
  });
});
