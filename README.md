# Nebula OS

<<<<<<< HEAD
A small browser based desktop, built with React and plain CSS. Phase 2 adds React Router
and Zustand, still no keyboard shortcuts — everything is done with mouse
=======
A small browser based desktop, built with React and plain CSS. No frameworks
beyond React itself, no keyboard shortcuts — everything is done with mouse
>>>>>>> 4d9729251176607ff507a67f06a6704be63d7c05
clicks, just like a very simple operating system running inside a browser
tab.

## Apps

- **Notes** — write and save notes, stored in `localStorage`
- **Settings** — switch between light/dark theme and pick a wallpaper color
- **Terminal** — a small pretend command line (`help`, `date`, `whoami`, `echo`, `open <app name>`, `clear`)
- **Calculator** — basic add/subtract/multiply/divide calculator
- **Help** — a short guide to using Nebula OS

<<<<<<< HEAD
## Phase 2 additions

Shop, Movies, Register and Dashboard open in windows like the
other apps and appear in the taskbar. There is no top navbar.

How routing and windows work together:

- the address bar always shows the page of the window you are using
- opening a link, using the back button or typing an address opens the
  window that owns that address
- clicking another window changes the address to that window's page
- each window shows its own page from the route map in `src/AppRoutes.jsx`

| Address | Page |
| --- | --- |
| `/shop`, `/shop/cart` | shopping mini project |
| `/movies` | movie search mini project (OMDb API, free key needed) |
| `/register`, `/register/login` | forms with validation |
| `/dashboard` | protected dashboard with CRUD |
| anything else | 404 page inside the window |

State: **Context API** for theme / toasts / login, **Zustand** for cart,
products and the movie watchlist, `useState` for things one component owns.

## Movie app key (one time)

1. Get a free key at https://www.omdbapi.com/apikey.aspx and click the activation link in the email.
2. Copy `.env.example` to a new file named `.env` and paste your key after `VITE_OMDB_KEY=`.
3. Restart `npm run dev` (Vite only reads `.env` when it starts).

## Getting started

```
npm install
npm run dev
```

Hosting needs a "send every address to index.html" rule because the app
uses real URLs. `public/_redirects` does this for Netlify.
=======
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
>>>>>>> 4d9729251176607ff507a67f06a6704be63d7c05
