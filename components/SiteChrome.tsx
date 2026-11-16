'use client';

import { createContext, useContext, type ReactNode } from 'react';

/**
 * Menu, branding and footer links, loaded once on the server (root layout)
 * and shared with the client components that show them. A null field means
 * "nothing usable in the database": the component falls back to its built-in
 * defaults, exactly as when it loaded the data itself.
 */
export interface SiteChromeData {
  navItems: Record<string, unknown>[] | null;
  branding: Record<string, unknown> | null;
  footerLinks: Record<string, unknown>[] | null;
}

const SiteChromeContext = createContext<SiteChromeData | null>(null);

export function SiteChromeProvider({ value, children }: { value: SiteChromeData | null; children: ReactNode }) {
  return <SiteChromeContext.Provider value={value}>{children}</SiteChromeContext.Provider>;
}

/** null when the server could not load it (the component then loads it itself). */
export const useSiteChrome = () => useContext(SiteChromeContext);
