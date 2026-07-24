'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Activity } from 'lucide-react';
import HeroCanvas from './HeroCanvas';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] } },
};

export default function Hero() {
  return (
    <section className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden px-6 py-10 md:px-10">
      <HeroCanvas />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-[2] mx-auto max-w-[720px] text-center"
      >
        <motion.div
          variants={item}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-accent/25
                     bg-accent-dim px-3 py-1.5 font-mono text-[11.5px] tracking-wide text-accent"
        >
          <Activity size={12} /> INTELLIGENCE WORKSPACE
        </motion.div>

        <motion.h1
          variants={item}
          className="mb-5 font-display text-[38px] font-semibold leading-[1.04] tracking-tight
                     md:text-[68px]"
        >
          Raw data,
          <br />
          <span className="text-dim">structured</span> into decisions.
        </motion.h1>

        <motion.p variants={item} className="mx-auto mb-9 max-w-[520px] text-[17px] leading-relaxed text-muted">
          Xai turns disconnected data into ranked, explainable insight, then automates the
          follow-through. Built for teams who act on evidence, not dashboards.
        </motion.p>

        <motion.div variants={item} className="flex justify-center gap-3.5">
          <button
            className="flex items-center gap-1.5 rounded-lg bg-accent px-5 py-3 text-sm font-semibold
                       text-[#06120F] transition-transform hover:-translate-y-px
                       hover:shadow-[0_10px_26px_rgba(76,217,192,0.22)]"
          >
            Open workspace <ChevronRight size={15} />
          </button>
          <button
            className="rounded-lg border border-border-strong px-5 py-3 text-sm font-semibold
                       transition-colors hover:border-ink/35 hover:bg-white/[0.03]"
          >
            Watch 2-min overview
          </button>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-7 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2
                      font-mono text-[10.5px] tracking-wide text-dim">
        SCROLL
        <div className="scroll-cue-line h-[30px] w-px bg-gradient-to-b from-dim to-transparent" />
      </div>
    </section>
  );
}
