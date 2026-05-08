import { useEffect, useRef, useState } from 'react';
export function useIntersectionObserver(options = {}) {
    const { threshold = 0, rootMargin = '0px', triggerOnce = false } = options;
    const ref = useRef(null);
    const [isIntersecting, setIsIntersecting] = useState(false);
    useEffect(() => {
        const element = ref.current;
        if (element === null)
            return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry === undefined)
                return;
            const intersecting = entry.isIntersecting;
            setIsIntersecting(intersecting);
            if (intersecting && triggerOnce) {
                observer.unobserve(element);
            }
        }, { threshold: threshold, rootMargin });
        observer.observe(element);
        return () => observer.unobserve(element);
    }, [threshold, rootMargin, triggerOnce]);
    return [ref, isIntersecting];
}
