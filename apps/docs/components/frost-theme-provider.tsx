"use client";

import * as React from "react";
import { Theme } from "frosted-ui";

type Appearance = "light" | "dark";

const AppearanceContext = React.createContext<{
  appearance: Appearance;
  setAppearance: (appearance: Appearance) => void;
} | null>(null);

export function useAppearance() {
  const ctx = React.useContext(AppearanceContext);
  if (!ctx) throw new Error("useAppearance must be used within FrostThemeProvider");
  return ctx;
}

export function FrostThemeProvider({ children }: { children: React.ReactNode }) {
  const [appearance, setAppearance] = React.useState<Appearance>("light");

  React.useEffect(() => {
    const stored = window.localStorage.getItem("frostui-appearance");
    if (stored === "light" || stored === "dark") {
      setAppearance(stored);
    }
  }, []);

  const updateAppearance = React.useCallback((next: Appearance) => {
    setAppearance(next);
    window.localStorage.setItem("frostui-appearance", next);
  }, []);

  return (
    <AppearanceContext.Provider value={{ appearance, setAppearance: updateAppearance }}>
      <Theme
        appearance={appearance}
        accentColor="blue"
        grayColor="gray"
        hasBackground
      >
        {children}
      </Theme>
    </AppearanceContext.Provider>
  );
}
