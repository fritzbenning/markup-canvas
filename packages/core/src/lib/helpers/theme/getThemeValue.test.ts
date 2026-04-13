import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "@/lib/config/constants";
import { getThemeValue } from "./getThemeValue";

describe("getThemeValue", () => {
  it("returns the light theme value when themeMode is light", () => {
    const config = { ...DEFAULT_CONFIG, themeMode: "light" as const };
    expect(getThemeValue(config, "gridColor")).toBe(config.gridColor);
  });

  it("returns the dark theme value when themeMode is dark", () => {
    const config = { ...DEFAULT_CONFIG, themeMode: "dark" as const };
    expect(getThemeValue(config, "gridColor")).toBe(config.gridColorDark);
  });
});
