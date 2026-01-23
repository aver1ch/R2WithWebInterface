import { useEffect, useState } from "react";
import { Theme } from "./types";
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({
  children,
  defaultTheme,
  storageKey = "r2-ui-theme",
}: {
  children: React.ReactNode;
  defaultTheme: Theme;
  storageKey?: string;
}) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    let activeTheme = theme;

    if (theme === "system") {
      activeTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    root.classList.add(activeTheme);

    // Устанавливаем CSS переменные в зависимости от темы
    if (activeTheme === "dark") {
      root.style.setProperty("--bg-primary", "#1a1a1a");
      root.style.setProperty("--bg-secondary", "rgba(44, 44, 44, 0.4)");
      root.style.setProperty("--bg-card", "rgba(0, 0, 0, 0.25)");
      root.style.setProperty("--text-primary", "#ffffff");
      root.style.setProperty("--text-secondary", "#e0e0e0");
      root.style.setProperty("--input-text", "rgba(255, 255, 255, 0.3)");
      root.style.setProperty("--border-color", "rgb(255, 255, 255)");
      root.style.setProperty("--shadow-color", "rgba(255, 255, 255, 0.25)");
      root.style.setProperty("--sidebar-color", "#080050");
      root.style.setProperty(
        "--background-gradient",
        "linear-gradient(180deg, #00183a,#000b38)"
      );
      root.style.setProperty("--text-link", "#b3b3b3");
      root.style.setProperty(
        "--button-shadow",
        "0px 11px 6px 0px rgba(255, 255, 255, 0.2)"
      );
      root.style.setProperty(
        "--button-shadow-hover",
        "0px 2px 16px 0px rgba(255, 255, 255, 0.8)"
      );
      root.style.setProperty("--button-border", "1px solid #BD3232");
    } else {
      root.style.setProperty("--bg-primary", "#ffffff");
      root.style.setProperty("--bg-secondary", "rgba(255, 255, 255, 0.9)");
      root.style.setProperty("--bg-card", "rgb(255, 255, 255)");
      root.style.setProperty("--text-primary", "#fff");
      root.style.setProperty("--input-text", "rgba(255, 255, 255, 0.2);");
      root.style.setProperty("--text-secondary", "#4a4a4a");
      root.style.setProperty("--border-color", "rgb(0, 0, 0)");
      root.style.setProperty("--shadow-color", "rgba(0, 0, 0, 0.3)");
      root.style.setProperty("--sidebar-color", "#050036");
      root.style.setProperty(
        "--background-gradient",
        "linear-gradient(180deg, #004eba, #0020a2)"
      );
      root.style.setProperty("--text-link", "#4a4a4a");
      root.style.setProperty(
        "--button-shadow",
        "0px 3px 6px 0px rgba(255, 255, 255, 0.31)"
      );
      root.style.setProperty(
        "--button-shadow-hover",
        "0px 5px 6px 0px rgba(255, 255, 255, 0.6)"
      );
      root.style.setProperty("--button-border", "none");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
    },
  };
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
