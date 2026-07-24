'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const LINKS = ['Product', 'Workspace', 'Automations', 'Docs'];

export default function Nav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-5 md:px-10
                 backdrop-blur-md bg-bg/70 border-b border-border"
    >
      <div className="flex items-center gap-2 font-display font-semibold text-lg tracking-tight">
        <span className="h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_12px_#4CD9C0]" />
        Xai
      </div>

      <div className="hidden md:flex gap-8 text-[13.5px] text-muted">
        {LINKS.map((l) => (
          <span key={l} className="cursor-default transition-colors hover:text-ink">
            {l}
          </span>
        ))}
      </div>

      <button
        className="flex items-center gap-1.5 rounded-md bg-ink px-4 py-2.5 text-[13px] font-semibold
                   text-bg transition-transform hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(76,217,192,0.18)]"
      >
        Request access <ArrowRight size={13} />
      </button>
    </motion.nav>
  );
}
