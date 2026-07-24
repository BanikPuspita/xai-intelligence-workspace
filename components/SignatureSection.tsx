'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SignatureCanvas from './SignatureCanvas';

const META = [
  { value: '1,200+', label: 'signals per node' },
  { value: '0.4s', label: 'avg. convergence' },
  { value: '92%', label: 'avg. confidence' },
];

export default function SignatureSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { amount: 0.25 });
  const progressTarget = useRef(0);

  useEffect(() => {
    progressTarget.current = inView ? 1 : 0;
  }, [inView]);

  return (
    <section ref={sectionRef} className="relative flex min-h-screen items-center overflow-hidden">
      <SignatureCanvas progressTarget={progressTarget} />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="relative z-[2] ml-[8%] max-w-[480px] px-6 md:px-10"
      >
        <div className="mb-3.5 font-mono text-[11.5px] tracking-wide text-accent">HOW IT REASONS</div>
        <h2 className="mb-5 font-display text-[30px] font-semibold tracking-tight md:text-[44px]">
          Unstructured, until it isn&apos;t.
        </h2>
        <p className="mb-7 text-[15.5px] leading-relaxed text-muted">
          Every signal Xai ingests starts as noise, scattered across sources with no shared
          shape. The model&apos;s job is to find the structure hiding in it: this is that
          process, made visible.
        </p>
        <div className="flex gap-7 font-mono text-[11.5px] text-dim">
          {META.map((m) => (
            <div key={m.label}>
              <b className="mb-1 block font-display text-[15px] text-ink">{m.value}</b>
              {m.label}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
