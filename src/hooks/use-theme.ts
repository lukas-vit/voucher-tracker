import { useEffect, useState } from "react";
import {
  applyTheme,
  getInitialTheme,
  getSystemTheme,
  getStoredTheme,
  storeTheme,
  type Theme,
} from "@/lib/theme";

/**
 * Provides current theme and setter. Persists to localStorage and applies
 * "dark" class on document. Respects system preference when no stored value.
 * Listens to system preference changes when user hasn't set a preference.
 */
export function useTheme(): { theme: Theme; isDark: boolean; setTheme: (t: Theme) => void } {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    applyTheme(theme);
    storeTheme(theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (getStoredTheme() === null) {
        const next = getSystemTheme();
        setThemeState(next);
      }
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const setTheme = (next: Theme) => {
    setThemeState(next);
  };

  return { theme, isDark: theme === "dark", setTheme };
}
