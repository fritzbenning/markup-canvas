import { describe, expect, it } from "vitest";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import { cleanupWindowBinding } from "./cleanupWindowBinding";

describe("cleanupWindowBinding", () => {
  it("removes window[canvasName] and the __markupCanvasInstances entry", () => {
    const config = createMarkupCanvasConfig({ name: "toRemove" });
    const w = window as unknown as Record<string, unknown>;
    w.toRemove = { stub: true };
    if (!w.__markupCanvasInstances) {
      w.__markupCanvasInstances = new Map<string, unknown>();
    }
    (w.__markupCanvasInstances as Map<string, unknown>).set("toRemove", w.toRemove);

    cleanupWindowBinding(config);

    expect(w.toRemove).toBeUndefined();
    expect((w.__markupCanvasInstances as Map<string, unknown>).has("toRemove")).toBe(false);
  });

  it("uses the default global key when name is the default", () => {
    const config = createMarkupCanvasConfig({});
    const w = window as unknown as Record<string, unknown>;
    w.markupCanvas = {};
    if (!w.__markupCanvasInstances) {
      w.__markupCanvasInstances = new Map<string, unknown>();
    }
    (w.__markupCanvasInstances as Map<string, unknown>).set("markupCanvas", {});

    cleanupWindowBinding(config);

    expect(w.markupCanvas).toBeUndefined();
    expect((w.__markupCanvasInstances as Map<string, unknown>).has("markupCanvas")).toBe(false);
  });
});
