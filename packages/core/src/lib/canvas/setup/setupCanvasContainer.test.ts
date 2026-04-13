import { afterEach, describe, expect, it, vi } from "vitest";
import { CANVAS_CONTAINER_CLASS } from "@/lib/constants";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import { setupCanvasContainer } from "./setupCanvasContainer";

describe("setupCanvasContainer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("applies interactive layout defaults and container class when config is omitted", () => {
    const container = document.createElement("div");
    container.style.width = "100px";
    container.style.height = "100px";
    vi.spyOn(window, "getComputedStyle").mockReturnValue({ position: "static" } as CSSStyleDeclaration);

    setupCanvasContainer(container);

    expect(container.style.position).toBe("relative");
    expect(container.style.overflow).toBe("hidden");
    expect(container.style.cursor).toBe("grab");
    expect(container.style.overscrollBehavior).toBe("none");
    expect(container.getAttribute("tabindex")).toBe("0");
    expect(container.classList.contains(CANVAS_CONTAINER_CLASS)).toBe(true);
  });

  it("sets light-dark background when config is provided", () => {
    const container = document.createElement("div");
    container.style.width = "100px";
    container.style.height = "100px";
    vi.spyOn(window, "getComputedStyle").mockReturnValue({ position: "static" } as CSSStyleDeclaration);

    let backgroundAssigned = "";
    const innerStyle = container.style;
    const styleProxy = new Proxy(innerStyle, {
      set(target, prop, value) {
        if (prop === "backgroundColor") {
          backgroundAssigned = String(value);
        }
        return Reflect.set(target, prop, value);
      },
    });
    Object.defineProperty(container, "style", {
      configurable: true,
      get: () => styleProxy,
    });

    const config = createMarkupCanvasConfig({
      canvasBackgroundColor: "rgba(1, 2, 3, 1)",
      canvasBackgroundColorDark: "rgba(4, 5, 6, 1)",
    });

    setupCanvasContainer(container, config);

    expect(backgroundAssigned).toBe("light-dark(rgba(1, 2, 3, 1), rgba(4, 5, 6, 1))");
  });
});
