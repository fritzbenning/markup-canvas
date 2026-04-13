import { describe, expect, it } from "vitest";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import { createMouseTestCanvas } from "../test/createMouseTestCanvas";
import { updateCursor } from "./updateCursor";

describe("updateCursor", () => {
  it("sets default when drag is disabled", () => {
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig({ requireSpaceForMouseDrag: false });
    updateCursor(canvas, config, false, false, false);
    expect(canvas.container.style.cursor).toBe("default");
  });

  it("uses grab/grabbing when space is not required for drag", () => {
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig({ requireSpaceForMouseDrag: false });
    updateCursor(canvas, config, true, false, false);
    expect(canvas.container.style.cursor).toBe("grab");
    updateCursor(canvas, config, true, false, true);
    expect(canvas.container.style.cursor).toBe("grabbing");
  });

  it("uses default/grab when space is required for drag", () => {
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig({ requireSpaceForMouseDrag: true });
    updateCursor(canvas, config, true, false, false);
    expect(canvas.container.style.cursor).toBe("default");
    updateCursor(canvas, config, true, true, false);
    expect(canvas.container.style.cursor).toBe("grab");
  });
});
