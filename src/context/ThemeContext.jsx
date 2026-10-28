import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

// CONTEXT API (1 of 3): theme + wallpaper.
// Before, these lived in App.jsx and were passed down as props.
// Now ANY component (desktop, settings, the site pages) can read them.
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage("nebula-theme", "light");
  const [wallpaper, setWallpaper] = useLocalStorage("nebula-wallpaper", "#232842");

  return (
    <ThemeContext.Provider value={{ theme, setTheme, wallpaper, setWallpaper }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
