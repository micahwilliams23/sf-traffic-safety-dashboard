import { useEffect, useState } from "react";

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

type Breakpoint = keyof typeof breakpoints;

/**
 * Hook to check if the viewport matches a given breakpoint (min-width).
 * @param breakpoint - The breakpoint to check against
 * @returns boolean indicating if the viewport is at or above the breakpoint
 */
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= breakpoints[breakpoint];
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(min-width: ${breakpoints[breakpoint]}px)`,
    );

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [breakpoint]);

  return matches;
}
