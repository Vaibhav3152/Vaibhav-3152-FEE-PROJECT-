# Nebula OS

A small browser based desktop, built with React and plain CSS. Phase 2 adds React Router
and Zustand, still no keyboard shortcuts — everything is done with mouse
clicks, just like a very simple operating system running inside a browser
tab.

## Apps

- **Notes** — write and save notes, stored in `localStorage`
- **Settings** — switch between light/dark theme and pick a wallpaper color
- **Terminal** — a small pretend command line (`help`, `date`, `whoami`, `echo`, `open <app name>`, `clear`)
- **Calculator** — basic add/subtract/multiply/divide calculator
- **Help** — a short guide to using Nebula OS

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
