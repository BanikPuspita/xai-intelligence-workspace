'use client';

import { useEffect, useState, RefObject } from 'react';

/**
 * Returns a 0→1 progress value representing how far a section has
 * scrolled through the viewport. Used to drive the hero and signature
 * canvases without pulling in a full scroll-animation library for
 * something this simple.
 */
export function useScrollProgress(ref: RefObject<HTMLElement>, distance = 0.7) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const p = 1 - Math.min(Math.max(rect.top / (window.innerHeight * distance), 0), 1);
      setProgress(p);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref, distance]);

  return progress;
}
