import { describe, expect, it } from "vitest";
import { CONTENT_LAYER_CLASS, TRANSFORM_LAYER_CLASS } from "@/lib/constants";
import { moveExistingContent } from "./moveExistingContent";

describe("moveExistingContent", () => {
  it("moves non-transform children into the content layer", () => {
    const transformLayer = document.createElement("div");
    transformLayer.className = TRANSFORM_LAYER_CLASS;
    const contentLayer = document.createElement("div");
    contentLayer.className = CONTENT_LAYER_CLASS;
    transformLayer.appendChild(contentLayer);

    const orphan = document.createElement("span");
    const snapshot = [transformLayer, orphan];

    moveExistingContent(snapshot, contentLayer, transformLayer);

    expect(contentLayer.contains(orphan)).toBe(true);
  });

  it("does not move the transform layer node itself", () => {
    const transformLayer = document.createElement("div");
    transformLayer.className = TRANSFORM_LAYER_CLASS;
    const contentLayer = document.createElement("div");
    transformLayer.appendChild(contentLayer);

    const snapshot = [transformLayer];

    moveExistingContent(snapshot, contentLayer, transformLayer);

    expect(transformLayer.parentElement).toBeNull();
  });
});
