import { type RefObject, useEffect, useRef } from 'react';

export function useClickOutside<TElement extends HTMLElement>(
  handler: () => void,
): RefObject<TElement | null> {
  const ref = useRef<TElement | null>(null);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (ref.current === null || ref.current.contains(event.target as Node)) return;
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]);

  return ref;
}
