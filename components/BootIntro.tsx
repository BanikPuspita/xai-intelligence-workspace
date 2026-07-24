'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';

/**
 * A ~0.9s boot moment before the hero settles in: a grid flashes into
 * view and resolves, echoing the "raw data → structure" idea the hero
 * canvas carries through the rest of the page. Skipped entirely for
 * users who prefer reduced motion, and skipped on repeat visits within
 * the same tab session so it doesn't get old on a second look.
 */
export default function BootIntro({ children }: { children: React.ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    if (reducedMotion) {
      setBooting(false);
      return;
    }
    if (sessionStorage.getItem('xai-booted')) {
      setBooting(false);
      return;
    }
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      setBooting(false);
      sessionStorage.setItem('xai-booted', '1');
      document.body.style.overflow = '';
    }, 900);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <>
      <AnimatePresence>
        {booting && (
          <motion.div
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] } }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-bg"
          >
            <motion.div
              initial={{ backgroundSize: '8px 8px' }}
              animate={{ backgroundSize: '34px 34px' }}
              transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
              className="absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(76,217,192,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(76,217,192,0.18) 1px, transparent 1px)',
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, letterSpacing: '0.3em' }}
              animate={{ opacity: 1, scale: 1, letterSpacing: '0em' }}
              transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1], delay: 0.15 }}
              className="relative z-10 flex items-center gap-2.5 font-display text-2xl font-semibold text-ink"
            >
              <motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.6, repeat: 1, ease: 'easeInOut' }}
                className="h-2 w-2 rounded-full bg-accent shadow-[0_0_16px_#4CD9C0]"
              />
              Xai
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
