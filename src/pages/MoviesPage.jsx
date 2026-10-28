import { useState, useEffect, useMemo, useRef } from "react";
import { fetchWithRetry, getFriendlyError } from "../utils/api.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll.js";
import { useWatchlistStore } from "../store/watchlistStore.js";
import { useToast } from "../context/ToastContext.jsx";
import Field from "../components/ui/Field.jsx";
import Dropdown from "../components/ui/Dropdown.jsx";
import Modal from "../components/ui/Modal.jsx";
import { LoadingMessage, ErrorMessage, EmptyMessage } from "../components/ui/StatusMessage.jsx";

// MOVIE SEARCH with the OMDb API (a third-party REST API).
// You need a free key from https://www.omdbapi.com/apikey.aspx and you put it
// in a file called .env:   VITE_OMDB_KEY=your_key_here
const API_KEY = import.meta.env.VITE_OMDB_KEY;
const API_URL = "https://www.omdbapi.com/";

const typeOptions = [
  { value: "movie", label: "Movies" },
  { value: "series", label: "TV series" },
];
const sortLabels = { match: "Best match", newest: "Newest first", title: "Title A-Z" };

// asks OMDb for one page (10 results) of search results
async function searchOmdb(term, type, page) {
  let url = API_URL + "?apikey=" + API_KEY + "&s=" + encodeURIComponent(term) + "&page=" + page;
  if (type) url += "&type=" + type;

  const data = await fetchWithRetry(url);

  // OMDb answers 200 OK even for errors, the real status is in data.Response
  if (data.Response === "False") {
    if (data.Error === "Movie not found!") return { movies: [], total: 0 };
    throw new Error(data.Error);
  }

  return { movies: data.Search, total: Number(data.totalResults) };
}

function Poster({ movie }) {
  if (movie.Poster === "N/A") {
    return <div className="card__image card__image--tall card__image--empty">&#127916;</div>;
  }
  return <img src={movie.Poster} alt={"Poster of " + movie.Title} loading="lazy" className="card__image card__image--tall" />;
}

export default function MoviesPage() {
  const [searchText, setSearchText] = useState("");
  const [type, setType] = useState("movie");
  const [sortBy, setSortBy] = useState("match");
  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsError, setDetailsError] = useState("");
  const [showWatchlist, setShowWatchlist] = useState(false);

  const { movies: watchlist, toggleMovie } = useWatchlistStore();
  const { showToast } = useToast();

  // DEBOUNCE: only search after the user stopped typing for 0.5 seconds
  const term = useDebounce(searchText.trim(), 500);

  // remembers what we are currently showing, so a slow answer for an
  // OLD search can be ignored
  const currentSearch = useRef("");

  // NEW SEARCH: runs when the text, the type or the retry button changes
  useEffect(() => {
    currentSearch.current = term + "|" + type;
    setPage(1);

    if (term === "" || !API_KEY) {
      setMovies([]);
      setTotalResults(0);
      setError("");
      return;
    }

    let ignore = false;

    async function runSearch() {
      setLoading(true);
      setError("");

      try {
        const result = await searchOmdb(term, type, 1);
        if (!ignore) {
          setMovies(result.movies);
          setTotalResults(result.total);
        }
      } catch (err) {
        if (!ignore) setError(getFriendlyError(err));
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    runSearch();
    return () => {
      ignore = true;
    };
  }, [term, type, retryCount]);

  // INFINITE SCROLL: when the bottom of the list shows, ask for the next page
  const loadMore = async () => {
    const search = currentSearch.current;
    const nextPage = page + 1;

    setLoadingMore(true);
    try {
      const result = await searchOmdb(term, type, nextPage);
      if (search !== currentSearch.current) return;

      // OMDb sometimes repeats a movie on two pages, so skip ones we already have
      setMovies((old) => [...old, ...result.movies.filter((m) => !old.some((o) => o.imdbID === m.imdbID))]);
      setPage(nextPage);
    } catch (err) {
      if (search === currentSearch.current) setError(getFriendlyError(err));
    } finally {
      setLoadingMore(false);
    }
  };

  const hasMore = movies.length > 0 && page * 10 < totalResults;
  const canLoadMore = hasMore && !loading && !loadingMore && error === "";
  const sentinelRef = useInfiniteScroll(loadMore, canLoadMore);

  // DETAILS: a second request (by imdbID) when a movie is opened
  useEffect(() => {
    setDetails(null);
    setDetailsError("");

    if (!selected) return;

    let ignore = false;

    async function loadDetails() {
      try {
        const data = await fetchWithRetry(API_URL + "?apikey=" + API_KEY + "&i=" + selected.imdbID + "&plot=full");
        if (!ignore) setDetails(data);
      } catch (err) {
        if (!ignore) setDetailsError(getFriendlyError(err));
      }
    }

    loadDetails();
    return () => {
      ignore = true;
    };
  }, [selected]);

  // SORT the movies we have loaded (OMDb cannot sort for us)
  const shownMovies = useMemo(() => {
    if (sortBy === "newest") return [...movies].sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
    if (sortBy === "title") return [...movies].sort((a, b) => a.Title.localeCompare(b.Title));
    return movies;
  }, [movies, sortBy]);

  const isSaved = (movie) => watchlist.some((m) => m.imdbID === movie.imdbID);

  const toggleSaved = (movie) => {
    toggleMovie({ imdbID: movie.imdbID, Title: movie.Title, Year: movie.Year, Poster: movie.Poster });
    showToast(isSaved(movie) ? "Removed from watchlist" : "Added to watchlist", "success");
  };

  const sortItems = Object.keys(sortLabels).map((key) => ({
    label: sortLabels[key],
    isActive: sortBy === key,
    onClick: () => setSortBy(key),
  }));

  // no key yet: show the setup steps instead of a broken search box
  if (!API_KEY) {
    return (
      <div className="narrow">
        <h1>Movie search</h1>
        <div className="card">
          <h2>One-time setup</h2>
          <ol>
            <li>Get a free key at omdbapi.com/apikey.aspx and click the activation link in the email.</li>
            <li>In the project folder create a file named <code>.env</code> with this line:<br /><code>VITE_OMDB_KEY=your_key_here</code></li>
            <li>Stop the dev server and run <code>npm run dev</code> again.</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="heading-row">
        <h1>Movie search</h1>
        <button type="button" className="btn" onClick={() => setShowWatchlist(true)}>
          &#9733; Watchlist ({watchlist.length})
        </button>
      </div>

      <div className="toolbar">
        <div className="toolbar__grow">
          <Field label="Search for a movie" type="search" name="search" value={searchText} placeholder="batman, love, space..." onChange={(e) => setSearchText(e.target.value)} />
        </div>
        <Field label="Show" as="select" name="type" value={type} options={typeOptions} onChange={(e) => setType(e.target.value)} />
        <Dropdown buttonText={"Sort: " + sortLabels[sortBy]} items={sortItems} align="right" />
      </div>

      {term === "" && <EmptyMessage text="Type a movie name to start searching." />}
      {loading && <LoadingMessage text="Searching..." />}
      {error && <ErrorMessage message={error} onRetry={() => setRetryCount(retryCount + 1)} />}
      {term !== "" && !loading && !error && movies.length === 0 && <EmptyMessage text="No movies found." />}
      {movies.length > 0 && <p className="hint">{totalResults} results, showing {movies.length}</p>}

      <div className="card-grid">
        {shownMovies.map((movie) => (
          <article key={movie.imdbID} className="card">
            <Poster movie={movie} />
            <h3>{movie.Title}</h3>
            <p className="hint">{movie.Year}</p>
            <div className="row">
              <button type="button" className="btn btn--sm" onClick={() => setSelected(movie)}>Details</button>
              <button type="button" className="btn btn--sm btn--primary" onClick={() => toggleSaved(movie)}>
                {isSaved(movie) ? "✓ Saved" : "+ Watchlist"}
              </button>
            </div>
          </article>
        ))}
      </div>

      {loadingMore && <LoadingMessage text="Loading more..." />}

      {/* the invisible line at the bottom that triggers the next page */}
      <div ref={sentinelRef} className="sentinel"></div>
      {hasMore && !loadingMore && (
        <button type="button" className="btn" onClick={loadMore}>Load more</button>
      )}

      <Modal title={selected ? selected.Title : ""} isOpen={selected !== null} onClose={() => setSelected(null)}>
        {detailsError && <ErrorMessage message={detailsError} />}
        {!details && !detailsError && <LoadingMessage text="Loading details..." />}
        {details && (
          <div>
            <p className="hint">
              {details.Year} &middot; {details.Rated} &middot; {details.Runtime} &middot; {details.Genre}
            </p>
            <p><strong>IMDb rating:</strong> {details.imdbRating} / 10</p>
            <p><strong>Director:</strong> {details.Director}</p>
            <p><strong>Cast:</strong> {details.Actors}</p>
            <p>{details.Plot}</p>
            <button type="button" className="btn btn--primary" onClick={() => toggleSaved(selected)}>
              {isSaved(selected) ? "Remove from watchlist" : "Add to watchlist"}
            </button>
          </div>
        )}
      </Modal>

      <Modal title="My watchlist" isOpen={showWatchlist} onClose={() => setShowWatchlist(false)}>
        {watchlist.length === 0 && <EmptyMessage text="Nothing saved yet." />}
        <ul className="list-plain">
          {watchlist.map((movie) => (
            <li key={movie.imdbID} className="row">
              <span className="cart-item__info">{movie.Title} ({movie.Year})</span>
              <button type="button" className="btn btn--sm btn--danger" onClick={() => toggleMovie(movie)}>Remove</button>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}
