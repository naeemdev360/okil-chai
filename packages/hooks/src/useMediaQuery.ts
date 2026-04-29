import { useEffect, useState } from 'react';

// Breakpoints align with DESIGN.md grid: Mobile 375px, Tablet 768px, Laptop 1024px, Desktop 1280px
export const BREAKPOINTS = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  laptop: '(min-width: 1024px) and (max-width: 1279px)',
  desktop: '(min-width: 1280px)',
  tabletUp: '(min-width: 768px)',
  laptopUp: '(min-width: 1024px)',
} as const satisfies Record<string, string>;

export type Breakpoint = keyof typeof BREAKPOINTS;

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

export function useBreakpoint(breakpoint: Breakpoint): boolean {
  return useMediaQuery(BREAKPOINTS[breakpoint]);
}
