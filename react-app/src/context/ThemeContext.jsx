import { useMemo } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useLocalStorage from "../hooks/useLocalStorage";
import { ThemeContext } from "./themeContext";

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", false);

  function toggleTheme() {
    setDarkMode((prev) => !prev);
  }

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
