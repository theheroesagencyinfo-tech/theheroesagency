import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "theme-preference";

function getSystemTheme(): Theme {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function getInitialTheme(): { theme: Theme; userSet: boolean } {
  if (typeof window === "undefined") return { theme: "dark", userSet: false };
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return { theme: stored, userSet: true };
  return { theme: getSystemTheme(), userSet: false };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const initial = getInitialTheme();
  const [theme, setThemeState] = useState<Theme>(initial.theme);
  const [userSet, setUserSet] = useState<boolean>(initial.userSet);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
    if (userSet) {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme, userSet]);

  // Listen to OS theme changes when the user hasn't explicitly chosen
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handler = (e: MediaQueryListEvent) => {
      if (!userSet) setThemeState(e.matches ? "light" : "dark");
    };
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, [userSet]);

  const value: ThemeContextValue = {
    theme,
    setTheme: setThemeState,
    toggleTheme: () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
