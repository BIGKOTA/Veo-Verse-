"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

interface ClientThemeProviderProps {
  children: ReactNode;
}

export default function ClientThemeProvider({
  children,
}: ClientThemeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
