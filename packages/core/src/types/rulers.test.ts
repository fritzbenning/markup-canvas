import { describe, expect, expectTypeOf, it } from "vitest";
import { getEmptyBounds } from "@/lib/canvas/bounds/getEmptyBounds";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import type { RulerCanvas, RulerElements, RulerSystem } from "./rulers";

describe("RulerElements", () => {
  it("accepts three required HTMLElements and optional grid overlay", () => {
    const elements: RulerElements = {
      horizontalRuler: document.createElement("div"),
      verticalRuler: document.createElement("div"),
      cornerBox: document.createElement("div"),
    };
    expect(elements.horizontalRuler).toBeInstanceOf(HTMLElement);

    const withGrid: RulerElements = {
      ...elements,
      gridOverlay: document.createElement("div"),
    };
    expect(withGrid.gridOverlay).toBeInstanceOf(HTMLElement);
  });
});

describe("RulerCanvas", () => {
  it("implements the contract expected by ruler layout code", () => {
    const canvas: RulerCanvas = {
      container: document.createElement("div"),
      transformLayer: document.createElement("div"),
      transform: { scale: 1, translateX: 0, translateY: 0 },
      updateTransform: () => true,
      getBounds: () => getEmptyBounds(),
    };

    expect(canvas.updateTransform({ scale: 2 })).toBe(true);
    expect(canvas.getBounds().scale).toBe(1);
  });

  it("allows omitting transformLayer", () => {
    const canvas: RulerCanvas = {
      container: document.createElement("div"),
      transform: { scale: 1, translateX: 0, translateY: 0 },
      updateTransform: () => false,
      getBounds: getEmptyBounds,
    };
    expect(canvas.transformLayer).toBeUndefined();
  });
});

describe("RulerSystem", () => {
  it("implements the full ruler/grid control surface", () => {
    let gridVisible = false;
    const system: RulerSystem = {
      horizontalRuler: document.createElement("div"),
      verticalRuler: document.createElement("div"),
      cornerBox: document.createElement("div"),
      update: () => {},
      updateTheme: () => {},
      show: () => {},
      hide: () => {},
      showGrid: () => {
        gridVisible = true;
        return gridVisible;
      },
      hideGrid: () => {
        gridVisible = false;
        return gridVisible;
      },
      isGridVisible: () => gridVisible,
      toggleGrid: () => {
        gridVisible = !gridVisible;
        return gridVisible;
      },
      destroy: () => {},
    };

    system.updateTheme(createMarkupCanvasConfig());
    expect(system.showGrid()).toBe(true);
    expect(system.isGridVisible()).toBe(true);
    expect(system.hideGrid()).toBe(false);
    expect(system.toggleGrid()).toBe(true);
  });

  it("has method signatures matching the type definitions", () => {
    expectTypeOf<RulerSystem["update"]>().toEqualTypeOf<() => void>();
    expectTypeOf<RulerSystem["updateTheme"]>()
      .parameter(0)
      .toEqualTypeOf<ReturnType<typeof createMarkupCanvasConfig>>();
    expectTypeOf<RulerSystem["showGrid"]>().returns.toEqualTypeOf<boolean>();
    expectTypeOf<RulerSystem["hideGrid"]>().returns.toEqualTypeOf<boolean>();
    expectTypeOf<RulerSystem["isGridVisible"]>().returns.toEqualTypeOf<boolean>();
    expectTypeOf<RulerSystem["toggleGrid"]>().returns.toEqualTypeOf<boolean>();
  });
});
