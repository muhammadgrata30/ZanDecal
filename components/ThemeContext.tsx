"use client";

import React, { createContext, useContext, useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isMounted: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
  isMounted: false,
});

function readTheme(): Theme {
  return localStorage.getItem("zan-decal-theme") === "dark" ? "dark" : "light";
}

function subscribeTheme(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener("zan-theme-change", notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener("zan-theme-change", notify);
  };
}

const serverTheme = (): Theme => "light";
const clientMounted = () => true;
const serverMounted = () => false;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, serverTheme);
  const isMounted = useSyncExternalStore(subscribeTheme, clientMounted, serverMounted);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem("zan-decal-theme", newTheme);
    window.dispatchEvent(new Event("zan-theme-change"));
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isMounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
