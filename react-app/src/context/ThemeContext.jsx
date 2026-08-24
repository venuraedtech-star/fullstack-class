import { useEffect, useMemo } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useLocalStorage from "../hooks/useLocalStorage";
import { ThemeContext } from "./themeContext";

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", false);

  function toggleTheme() {
    setDarkMode((prev) => !prev);
  }

  // MUI's theme only covers the storefront (Layout.jsx); the Tailwind-styled
  // admin/auth zone reads dark mode from this class instead, via Tailwind's
  // `dark:` variant (configured in index.css).
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const theme = useMemo(
    () => createTheme({ palette: { mode: darkMode ? "dark" : "light" } }),
    [darkMode],
  );

  const value = { darkMode, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
