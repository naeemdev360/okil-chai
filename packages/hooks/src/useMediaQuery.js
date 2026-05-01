import { useEffect, useState } from 'react';
// Breakpoints align with DESIGN.md grid: Mobile 375px, Tablet 768px, Laptop 1024px, Desktop 1280px
export const BREAKPOINTS = {
    mobile: '(max-width: 767px)',
    tablet: '(min-width: 768px) and (max-width: 1023px)',
    laptop: '(min-width: 1024px) and (max-width: 1279px)',
    desktop: '(min-width: 1280px)',
    tabletUp: '(min-width: 768px)',
    laptopUp: '(min-width: 1024px)',
};
export function useMediaQuery(query) {
    const [matches, setMatches] = useState(() => {
        if (typeof window === 'undefined')
            return false;
        return window.matchMedia(query).matches;
    });
    useEffect(() => {
        const mediaQueryList = window.matchMedia(query);
        setMatches(mediaQueryList.matches);
        const listener = (event) => setMatches(event.matches);
        mediaQueryList.addEventListener('change', listener);
        return () => mediaQueryList.removeEventListener('change', listener);
    }, [query]);
    return matches;
}
export function useBreakpoint(breakpoint) {
    return useMediaQuery(BREAKPOINTS[breakpoint]);
}
