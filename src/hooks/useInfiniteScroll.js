import { useRef, useEffect } from "react";

// INFINITE SCROLL: put the returned ref on an empty <div> at the bottom
// of a list. When that div scrolls into view, onReachEnd() is called.
// canLoad should be false while loading or when there is nothing more to load.
export function useInfiniteScroll(onReachEnd, canLoad) {
  const sentinelRef = useRef(null);
  const latestCallback = useRef(onReachEnd);

  // always remember the newest function so we never call an old one
  useEffect(() => {
    latestCallback.current = onReachEnd;
  });

  useEffect(() => {
    const element = sentinelRef.current;

    if (!element || !canLoad) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        latestCallback.current();
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [canLoad]);

  return sentinelRef;
}
