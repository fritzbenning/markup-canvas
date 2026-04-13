import { describe, expect, it } from "vitest";
import { CONTENT_LAYER_CLASS, TRANSFORM_LAYER_CLASS } from "@/lib/constants";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import { setupCanvasLayers } from "./setupCanvasLayers";

describe("setupCanvasLayers", () => {
  it("creates transform and content layers and moves prior children into the content layer", () => {
    const container = document.createElement("div");
    const marker = document.createElement("span");
    marker.textContent = "child";
    container.appendChild(marker);

    const config = createMarkupCanvasConfig({ width: 500, height: 400 });
    const { transformLayer, contentLayer } = setupCanvasLayers(container, config);

    expect(transformLayer.classList.contains(TRANSFORM_LAYER_CLASS)).toBe(true);
    expect(contentLayer.classList.contains(CONTENT_LAYER_CLASS)).toBe(true);
    expect(container.contains(transformLayer)).toBe(true);
    expect(transformLayer.contains(contentLayer)).toBe(true);
    expect(contentLayer.contains(marker)).toBe(true);
  });

  it("reuses existing layers when already present", () => {
    const container = document.createElement("div");
    const existingTransform = document.createElement("div");
    existingTransform.className = TRANSFORM_LAYER_CLASS;
    const existingContent = document.createElement("div");
    existingContent.className = CONTENT_LAYER_CLASS;
    existingTransform.appendChild(existingContent);
    container.appendChild(existingTransform);

    const config = createMarkupCanvasConfig({ width: 300, height: 200 });
    const { transformLayer, contentLayer } = setupCanvasLayers(container, config);

    expect(transformLayer).toBe(existingTransform);
    expect(contentLayer).toBe(existingContent);
  });
});
