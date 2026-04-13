import { describe, expect, it, vi } from "vitest";
import { createMarkupCanvasConfig } from "@/lib/config/createMarkupCanvasConfig";
import type { RulerSystem } from "@/types/index";
import { updateThemeMode } from "./updateThemeMode";

describe("updateThemeMode", () => {
  it("calls rulers.updateTheme with a resolved config when rulers exist", () => {
    const updateTheme = vi.fn();
    const rulers = { updateTheme } as unknown as RulerSystem;
    const config = createMarkupCanvasConfig({ themeMode: "light" });

    updateThemeMode(config, rulers, "dark");

    expect(updateTheme).toHaveBeenCalledTimes(1);
    const passed = updateTheme.mock.calls[0][0] as ReturnType<typeof createMarkupCanvasConfig>;
    expect(passed.themeMode).toBe("dark");
  });

  it("does nothing when rulers are null", () => {
    const config = createMarkupCanvasConfig({ themeMode: "light" });
    expect(() => updateThemeMode(config, null, "dark")).not.toThrow();
  });
});
