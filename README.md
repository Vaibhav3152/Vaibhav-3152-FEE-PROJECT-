# Nebula OS

A small browser based desktop, built with React and plain CSS. No frameworks
beyond React itself, no keyboard shortcuts — everything is done with mouse
clicks, just like a very simple operating system running inside a browser
tab.

## Apps

- **Notes** — write and save notes, stored in `localStorage`
- **Settings** — switch between light/dark theme and pick a wallpaper color
- **Terminal** — a small pretend command line (`help`, `date`, `whoami`, `echo`, `open <app name>`, `clear`)
- **Calculator** — basic add/subtract/multiply/divide calculator
- **Help** — a short guide to using Nebula OS

## Getting started

Install the dependencies:

```
npm install
```

Start the dev server:

```
npm run dev
```

Then open the address it prints (usually `http://localhost:5173`) in your
browser.

## How it's put together

- `src/App.jsx` — keeps the list of windows in state (position, size,
  minimized/maximized) and the theme/wallpaper settings, and passes
  everything down as props
- `src/components/Desktop.jsx` — the icons you double-click to open an app
- `src/components/Window.jsx` — the draggable window frame (title bar,
  minimize/maximize/close buttons)
- `src/components/Taskbar.jsx` — shows the open windows along the bottom
- `src/apps/` — each app is its own component (`NotesApp.jsx`,
  `SettingsApp.jsx`, `TerminalApp.jsx`, `CalculatorApp.jsx`, `HelpApp.jsx`)
- `src/hooks/useLocalStorage.js` — a small custom hook that works like
  `useState` but also remembers the value in `localStorage`

Window dragging is done with plain `mousedown` / `mousemove` / `mouseup`
listeners — no extra libraries. Minimizing hides the window and adds it to
the taskbar; maximizing just makes it fill the screen. There are no keyboard
shortcuts anywhere in the app on purpose.
