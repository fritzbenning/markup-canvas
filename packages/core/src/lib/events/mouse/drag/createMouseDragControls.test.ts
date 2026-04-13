import { describe, expect, it, vi } from "vitest";
import { createMouseDragControls } from "./createMouseDragControls";

describe("createMouseDragControls", () => {
  it("returns false helpers when dragSetup is null", () => {
    const api = createMouseDragControls(null);
    expect(api.enableMouseDrag()).toBe(false);
    expect(api.disableMouseDrag()).toBe(false);
    expect(api.isMouseDragEnabled()).toBe(false);
  });

  it("delegates to dragSetup when present", () => {
    const dragSetup = {
      cleanup: vi.fn(),
      enable: vi.fn(() => true),
      disable: vi.fn(() => true),
      isEnabled: vi.fn(() => true),
    };
    const api = createMouseDragControls(dragSetup);
    expect(api.enableMouseDrag()).toBe(true);
    expect(api.disableMouseDrag()).toBe(true);
    expect(api.isMouseDragEnabled()).toBe(true);
    expect(dragSetup.enable).toHaveBeenCalledOnce();
    expect(dragSetup.disable).toHaveBeenCalledOnce();
    expect(dragSetup.isEnabled).toHaveBeenCalledOnce();
  });
});
