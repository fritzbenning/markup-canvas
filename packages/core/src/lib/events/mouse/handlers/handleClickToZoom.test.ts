import { afterEach, describe, expect, it, vi } from "vitest";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import { createMouseTestCanvas } from "../test/createMouseTestCanvas";
import { handleClickToZoom } from "./handleClickToZoom";

describe("handleClickToZoom", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("updates transform for a quick left click without drag", () => {
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig({
      requireOptionForClickZoom: false,
      clickZoomLevel: 2,
    });
    const downTime = 1_000;
    vi.spyOn(Date, "now").mockReturnValue(1_050);

    const event = new MouseEvent("click", {
      clientX: 100,
      clientY: 75,
      altKey: false,
      cancelable: true,
    });

    handleClickToZoom(event, canvas, config, downTime, false, false);

    expect(canvas.updateTransform).toHaveBeenCalled();
    const call = vi.mocked(canvas.updateTransform).mock.calls[0][0];
    expect(call.scale).toBe(2);
    expect(event.defaultPrevented).toBe(true);
  });

  it("does not zoom when option is required but not pressed", () => {
    const canvas = createMouseTestCanvas();
    const config = createMarkupCanvasConfig({
      requireOptionForClickZoom: true,
      clickZoomLevel: 2,
    });
    vi.spyOn(Date, "now").mockReturnValue(1_050);

    const event = new MouseEvent("click", {
      clientX: 100,
      clientY: 75,
      altKey: false,
      cancelable: true,
    });

    handleClickToZoom(event, canvas, config, 1_000, false, false);

    expect(canvas.updateTransform).not.toHaveBeenCalled();
  });
});
