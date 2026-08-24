import { useState, useEffect } from "react";

export function useLocalStorage(key, startingValue) {
  const [value, setValue] = useState(() => {
    const saved = window.localStorage.getItem(key);

    if (saved === null) {
      return startingValue;
    }

    try {
      return JSON.parse(saved);
    } catch {
      return startingValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
