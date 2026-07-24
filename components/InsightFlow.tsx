'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Database, Cpu, Sparkles } from 'lucide-react';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const STAGES = [
  {
    num: '01',
    icon: Database,
    title: 'Ingest data',
    desc: 'Connect warehouses, event streams, and product logs. Xai normalizes schema drift automatically, no pipeline maintenance required.',
  },
  {
    num: '02',
    icon: Cpu,
    title: 'Analyze with AI',
    desc: 'Models trace correlations across every connected source, surfacing patterns a dashboard query would never think to ask for.',
  },
  {
    num: '03',
    icon: Sparkles,
    title: 'Generate insight',
    desc: 'Findings arrive as plain-language insight cards, ranked by confidence and impact, ready to act on or automate.',
  },
];

/**
 * Desktop: the section pins in place while the track of stage cards
 * scrolls horizontally underneath a vertical scroll — the "advanced
 * scroll-linked timeline" the brief calls out explicitly for this
 * section. Mobile: a plain vertical stack, since pinned horizontal
 * scroll on a touch viewport fights the browser's native gesture.
 * Reduced motion: cards are simply all visible, no pin, no scrub.
 */
export default function InsightFlow() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        const track = trackRef.current;
        const pin = pinRef.current;
        if (!track || !pin) return;

        const scrollDistance = track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: -scrollDistance,
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${scrollDistance}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const idx = Math.min(STAGES.length - 1, Math.floor(self.progress * STAGES.length));
              setActive(idx);
            },
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });
    }, pinRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="py-32 md:py-0">
      <div className="mx-auto mb-16 max-w-[620px] px-6 text-center md:px-10 md:pt-32">
        <div className="mb-3.5 font-mono text-[11.5px] tracking-wide text-amber">THE PIPELINE</div>
        <h2 className="mb-3.5 font-display text-[28px] font-semibold tracking-tight md:text-[40px]">
          Three stages. Zero busywork.
        </h2>
        <p className="text-[15.5px] leading-relaxed text-muted">
          Every insight Xai surfaces travels the same path, in order, so you always know how a
          conclusion was reached.
        </p>
      </div>

      <div
        ref={pinRef}
        className={reducedMotion ? '' : 'relative md:h-screen md:overflow-hidden'}
      >
        <div
          ref={trackRef}
          className="flex flex-col gap-7 px-6 md:h-full md:flex-row md:items-center md:gap-10
                     md:px-[8vw] md:pb-16 md:will-change-transform"
        >
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            const isActive = reducedMotion ? true : active >= i;
            return (
              <div
                key={s.num}
                className={`shrink-0 rounded-2xl border p-8 transition-all duration-500 ease-out
                  md:w-[420px]
                  ${isActive
                    ? 'border-border-strong bg-panel opacity-100'
                    : 'border-border bg-panel opacity-[0.4]'}`}
              >
                <div className={`mb-4 font-mono text-[11.5px] ${isActive ? 'text-accent' : 'text-dim'}`}>
                  {s.num} / 03
                </div>
                <div
                  className={`mb-5 flex h-11 w-11 items-center justify-center rounded-[10px] border transition-all duration-500
                    ${isActive ? 'border-accent/30 bg-accent-dim text-accent' : 'border-border bg-panel-alt text-muted'}`}
                >
                  <Icon size={19} strokeWidth={1.8} />
                </div>
                <div className="mb-2.5 font-display text-xl font-semibold">{s.title}</div>
                <div className="text-[14px] leading-relaxed text-muted">{s.desc}</div>
              </div>
            );
          })}
        </div>

        {!reducedMotion && (
          <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block">
            <div className="flex gap-2">
              {STAGES.map((s, i) => (
                <div
                  key={s.num}
                  className={`h-[3px] w-8 rounded-full transition-colors duration-300 ${
                    active >= i ? 'bg-accent' : 'bg-border-strong'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
