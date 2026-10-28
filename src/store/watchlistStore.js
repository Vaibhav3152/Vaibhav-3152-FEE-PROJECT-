import { create } from "zustand";
import { persist } from "zustand/middleware";

// Zustand store #3: the movie watchlist (saved in localStorage)
export const useWatchlistStore = create(
  persist(
    (set) => ({
      movies: [],

      // add the movie if it is not saved yet, remove it if it is
      toggleMovie: (movie) =>
        set((state) => {
          const isSaved = state.movies.some((m) => m.imdbID === movie.imdbID);
          return {
            movies: isSaved
              ? state.movies.filter((m) => m.imdbID !== movie.imdbID)
              : [...state.movies, movie],
          };
        }),
    }),
    { name: "nebula-watchlist" }
  )
);
