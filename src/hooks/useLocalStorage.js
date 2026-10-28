import { useState, useEffect } from "react";

<<<<<<< HEAD
// a simple hook that works just like useState, but it also
// remembers the value in localStorage so it survives a refresh
=======
>>>>>>> 4d9729251176607ff507a67f06a6704be63d7c05
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
