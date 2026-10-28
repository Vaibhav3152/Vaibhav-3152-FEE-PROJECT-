import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "./context/ThemeContext.jsx";
import Desktop from "./components/Desktop.jsx";
import Taskbar from "./components/Taskbar.jsx";
import Window from "./components/Window.jsx";
import AppRoutes from "./AppRoutes.jsx";
import NotesApp from "./apps/NotesApp.jsx";
import SettingsApp from "./apps/SettingsApp.jsx";
import TerminalApp from "./apps/TerminalApp.jsx";
import CalculatorApp from "./apps/CalculatorApp.jsx";
import HelpApp from "./apps/HelpApp.jsx";

// Every app Nebula OS knows about.
//  - apps with a `component` are normal windows (like in Phase 1)
//  - apps with a `route` are React Router pages shown inside a window
const appList = [
  { id: "notes", name: "Notes", icon: "🗒️", width: 420, height: 460, component: NotesApp },
  { id: "settings", name: "Settings", icon: "⚙️", width: 380, height: 420, component: SettingsApp },
  { id: "terminal", name: "Terminal", icon: "🖥️", width: 460, height: 360, component: TerminalApp },
  { id: "calculator", name: "Calculator", icon: "🧮", width: 260, height: 400, component: CalculatorApp },
  { id: "help", name: "Help", icon: "❓", width: 380, height: 420, component: HelpApp },
  { id: "shop", name: "Shop", icon: "🛒", width: 680, height: 500, route: "/shop" },
  { id: "movies", name: "Movies", icon: "🎬", width: 680, height: 500, route: "/movies" },
  { id: "register", name: "Register", icon: "📝", width: 460, height: 520, route: "/register" },
  { id: "dashboard", name: "Dashboard", icon: "📊", width: 680, height: 500, route: "/dashboard" },
];

// does this address belong to this app? ("/shop/cart" belongs to the shop)
function ownsPath(app, pathname) {
  return app.route && (pathname === app.route || pathname.startsWith(app.route + "/"));
}

function topZIndex(windows) {
  return Math.max(0, ...windows.map((win) => win.zIndex)) + 1;
}

function makeWindow(app, windows, path) {
  return {
    id: app.id, // one window per app, so the window id is the app id
    title: app.name,
    icon: app.icon,
    path, // the page this window is showing (route apps only)
    x: 80 + windows.length * 24,
    y: 60 + windows.length * 24,
    width: app.width,
    height: app.height,
    isMinimized: false,
    isMaximized: false,
    zIndex: topZIndex(windows),
  };
}

// HOW ROUTING AND WINDOWS WORK TOGETHER
//  - the address bar always shows the page of the window you are using
//  - when the address changes (link click, back button, typed address),
//    the window that owns that address opens or comes to the front
//  - clicking another window changes the address to that window's page
export default function App() {
  const [windows, setWindows] = useState([]);
  const { theme, wallpaper } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // address -> window
  useEffect(() => {
    const app = appList.find((item) => ownsPath(item, location.pathname));

    if (!app) {
      return;
    }

    setWindows((old) => {
      if (!old.some((win) => win.id === app.id)) {
        return [...old, makeWindow(app, old, location.pathname)];
      }

      return old.map((win) =>
        win.id === app.id
          ? { ...win, path: location.pathname, isMinimized: false, zIndex: topZIndex(old) }
          : win
      );
    });
  }, [location.pathname]);

  const updateWindow = (id, changes) => {
    setWindows((old) => old.map((win) => (win.id === id ? { ...win, ...changes } : win)));
  };

  // window -> address
  const focusWindow = (id) => {
    const win = windows.find((w) => w.id === id);

    if (!win) {
      return;
    }

    setWindows((old) =>
      old.map((w) => (w.id === id ? { ...w, isMinimized: false, zIndex: topZIndex(old) } : w))
    );

    const address = win.path || "/";
    if (address !== location.pathname) {
      navigate(address);
    }
  };

  const openApp = (appId) => {
    const app = appList.find((item) => item.id === appId);

    if (!app) {
      return false;
    }

    if (windows.some((win) => win.id === appId)) {
      focusWindow(appId);
    } else if (app.route) {
      navigate(app.route); // the effect above creates the window
    } else {
      setWindows([...windows, makeWindow(app, windows, "")]);
      if (location.pathname !== "/") {
        navigate("/");
      }
    }

    return true;
  };

  const closeWindow = (id) => {
    setWindows(windows.filter((win) => win.id !== id));

    const app = appList.find((item) => item.id === id);
    if (ownsPath(app, location.pathname)) {
      navigate("/");
    }
  };

  const handleTaskbarClick = (id) => {
    const win = windows.find((w) => w.id === id);

    if (win.isMinimized) {
      focusWindow(id);
    } else {
      updateWindow(id, { isMinimized: true });
    }
  };

  // used by the terminal: "open shop" or "open Notes"
  const openAppByName = (typedName) => {
    const match = appList.find((app) => app.name.toLowerCase() === typedName.toLowerCase());
    return match ? openApp(match.id) : false;
  };

  return (
    <div className={"desktop theme-" + theme} style={{ backgroundColor: wallpaper }}>
      <Desktop appList={appList} onOpenApp={openApp} />

      {windows.map((win) => {
        const app = appList.find((item) => item.id === win.id);
        const AppContent = app.component;

        return (
          <Window
            key={win.id}
            win={win}
            onClose={closeWindow}
            onMinimize={(id) => updateWindow(id, { isMinimized: true })}
            onMaximize={(id) => updateWindow(id, { isMaximized: !win.isMaximized })}
            onFocus={focusWindow}
            onMove={(id, x, y) => updateWindow(id, { x, y })}
          >
            {app.route ? (
              <div className="app">
                <div className="app__main scroll">
                  <AppRoutes path={win.path} />
                </div>
              </div>
            ) : (
              <AppContent onOpenApp={openAppByName} />
            )}
          </Window>
        );
      })}

      <Taskbar openWindows={windows} onTaskbarClick={handleTaskbarClick} />
    </div>
  );
}
