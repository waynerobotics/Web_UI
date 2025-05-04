// app/layout.js
"use client";

import MainLayout from "@/components/layout/MainLayout";  // ← adjust to where your MainLayout lives
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { createContext, useState, useMemo } from "react";

// Prevent FontAwesome from injecting its CSS automatically
config.autoAddCss = false;

// Color‐mode context (if you still want dark/light toggle)
export const ColorModeContext = createContext({
  mode: "light",
  toggleColorMode: () => {},
});

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [mode, setMode] = useState("light");
  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#3f51b5" },
          secondary: { main: "#f50057" },
        },
        typography: { fontFamily: inter.style.fontFamily },
      }),
    [mode]
  );

  return (
    <html lang="en">
      <body className={inter.className}>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />

            {/* ← Wrap every page in your MainLayout */}
            <MainLayout>{children}</MainLayout>

          </ThemeProvider>
        </ColorModeContext.Provider>
      </body>
    </html>
  );
}
