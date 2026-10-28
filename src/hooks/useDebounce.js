import { useState, useEffect } from "react";

// DEBOUNCE: returns the value only after the user stopped changing it
// for `delay` milliseconds. Used so we don't call the API on every key press.
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedValue(value), delay);

    // if value changes again before the timer ends, cancel the old timer
    return () => clearTimeout(timerId);
  }, [value, delay]);

  return debouncedValue;
}
