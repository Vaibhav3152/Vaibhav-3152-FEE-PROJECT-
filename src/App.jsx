import { useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import Desktop from "./components/Desktop.jsx";
import Taskbar from "./components/Taskbar.jsx";
import Window from "./components/Window.jsx";
import NotesApp from "./apps/NotesApp.jsx";
import SettingsApp from "./apps/SettingsApp.jsx";
import TerminalApp from "./apps/TerminalApp.jsx";
import CalculatorApp from "./apps/CalculatorApp.jsx";
import HelpApp from "./apps/HelpApp.jsx";


const appList = [
  { id: "notes", name: "Notes", icon: "🗒️", width: 420, height: 460 },
  { id: "settings", name: "Settings", icon: "⚙️", width: 380, height: 420 },
  { id: "terminal", name: "Terminal", icon: "🖥️", width: 460, height: 360 },
  { id: "calculator", name: "Calculator", icon: "🧮", width: 260, height: 400 },
  { id: "help", name: "Help", icon: "❓", width: 380, height: 420 },
];

export default function App() {
  const [windows, setWindows] = useState([]);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [openedCount, setOpenedCount] = useState(0);


  const [theme, setTheme] = useLocalStorage("nebula-theme", "light");
  const [wallpaper, setWallpaper] = useLocalStorage("nebula-wallpaper", "#232842");

  const openApp = (appId) => {
    const appInfo = appList.find((app) => app.id === appId);

    if (!appInfo) {
      return false;
    }

    const existingWindow = windows.find((win) => win.appId === appId);

    if (existingWindow) {
      setWindows(
        windows.map((win) =>
          win.id === existingWindow.id
            ? { ...win, isMinimized: false, zIndex: nextZIndex }
            : win
        )
      );
      setNextZIndex(nextZIndex + 1);
      return true;
    }

    const offset = openedCount * 24;

    const newWindow = {
      id: appId + "-" + Date.now(),
      appId: appInfo.id,
      title: appInfo.name,
      icon: appInfo.icon,
      x: 80 + offset,
      y: 60 + offset,
      width: appInfo.width,
      height: appInfo.height,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex,
    };

    setWindows([...windows, newWindow]);
    setNextZIndex(nextZIndex + 1);
    setOpenedCount(openedCount + 1);
    return true;
  };

  const closeWindow = (id) => {
    setWindows(windows.filter((win) => win.id !== id));
  };

  const minimizeWindow = (id) => {
    setWindows(
      windows.map((win) =>
        win.id === id ? { ...win, isMinimized: true } : win
      )
    );
  };

  const maximizeWindow = (id) => {
    setWindows(
      windows.map((win) =>
        win.id === id ? { ...win, isMaximized: !win.isMaximized } : win
      )
    );
  };

  const focusWindow = (id) => {
    setWindows(
      windows.map((win) =>
        win.id === id ? { ...win, zIndex: nextZIndex } : win
      )
    );
    setNextZIndex(nextZIndex + 1);
  };

  const moveWindow = (id, x, y) => {
    setWindows(
      windows.map((win) => (win.id === id ? { ...win, x, y } : win))
    );
  };

  const handleTaskbarClick = (id) => {
    const win = windows.find((w) => w.id === id);

    if (!win) {
      return;
    }

    if (win.isMinimized) {
      setWindows(
        windows.map((w) =>
          w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w
        )
      );
      setNextZIndex(nextZIndex + 1);
    } else {
      minimizeWindow(id);
    }
  };

  // this is used by the terminal's "open" command, it matches
  // by app name so someone can type "open notes" or "open Notes"
  const openAppByName = (typedName) => {
    const match = appList.find(
      (app) => app.name.toLowerCase() === typedName.toLowerCase()
    );

    if (!match) {
      return false;
    }

    return openApp(match.id);
  };

  const renderAppContent = (appId) => {
    if (appId === "notes") {
      return <NotesApp />;
    }
    if (appId === "settings") {
      return (
        <SettingsApp
          theme={theme}
          onThemeChange={setTheme}
          wallpaper={wallpaper}
          onWallpaperChange={setWallpaper}
        />
      );
    }
    if (appId === "terminal") {
      return <TerminalApp onOpenApp={openAppByName} />;
    }
    if (appId === "calculator") {
      return <CalculatorApp />;
    }
    if (appId === "help") {
      return <HelpApp />;
    }
    return null;
  };

  return (
    <div className={"desktop theme-" + theme} style={{ backgroundColor: wallpaper }}>
      <Desktop appList={appList} onOpenApp={openApp} />

      {windows.map((win) => (
        <Window
          key={win.id}
          win={win}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
        >
          {renderAppContent(win.appId)}
        </Window>
      ))}

      <Taskbar openWindows={windows} onTaskbarClick={handleTaskbarClick} />
    </div>
  );
}
