'use client';

import { useEffect, useState } from 'react';

/**
 * Three.js scenes run their own render loop outside the DOM, so the
 * `prefers-reduced-motion` CSS media query in globals.css can't reach them.
 * This hook lets the two canvases opt into a static/minimal-motion render
 * path for users who've asked the OS to reduce motion.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
