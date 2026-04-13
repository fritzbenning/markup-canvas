import { useCallback, useState } from "react";

export type ThemeMode = "light" | "dark";

export function useTheme(initialMode: ThemeMode = "light") {
  const [themeMode, setThemeMode] = useState<ThemeMode>(initialMode);

  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return { themeMode, toggleTheme };
}
