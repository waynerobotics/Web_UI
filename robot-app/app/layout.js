"use client";

import React, { useState, useMemo, createContext } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

// Tell Font Awesome to skip adding CSS automatically
config.autoAddCss = false;

// Create a context for color mode
export const ColorModeContext = createContext({
  mode: "light",
  toggleColorMode: () => {},
});

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  // State for light/dark mode
  const [mode, setMode] = useState("light");

  // Memoized context value
  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [mode]
  );

  // Memoized theme that rebuilds on mode change
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#3f51b5" },
          secondary: { main: "#f50057" },
        },
        typography: {
          fontFamily: inter.style.fontFamily,
        },
      }),
    [mode]
  );

  return (
    <html lang="en">
      <body className={inter.className}>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </ColorModeContext.Provider>
      </body>
    </html>
  );
}
