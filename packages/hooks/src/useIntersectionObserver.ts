import { type RefObject, useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  readonly threshold?: number | readonly number[];
  readonly rootMargin?: string;
  readonly triggerOnce?: boolean;
}

export function useIntersectionObserver<TElement extends Element>(
  options: UseIntersectionObserverOptions = {},
): [RefObject<TElement | null>, boolean] {
  const { threshold = 0, rootMargin = '0px', triggerOnce = false } = options;
  const ref = useRef<TElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (element === null) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry === undefined) return;
        const intersecting = entry.isIntersecting;
        setIsIntersecting(intersecting);
        if (intersecting && triggerOnce) {
          observer.unobserve(element);
        }
      },
      { threshold: threshold as number | number[], rootMargin },
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isIntersecting];
}
