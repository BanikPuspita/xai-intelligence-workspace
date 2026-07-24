'use client';

import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import {
  LayoutGrid, GitBranch, Boxes, Settings, Sparkles, TrendingUp,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'pipelines', label: 'Pipelines', icon: GitBranch },
  { id: 'models', label: 'Models', icon: Boxes },
  { id: 'insights', label: 'Insights', icon: Sparkles },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const STATS = [
  { label: 'ACTIVE SOURCES', value: '18', delta: '+3' },
  { label: 'INSIGHTS / WK', value: '118', delta: '+12%' },
  { label: 'AUTOMATIONS', value: '24', delta: '+2' },
  { label: 'CONFIDENCE AVG', value: '92%', delta: '+1.4' },
];

const CHART_DATA = [
  { d: 'Mon', v: 14 }, { d: 'Tue', v: 19 }, { d: 'Wed', v: 16 },
  { d: 'Thu', v: 27 }, { d: 'Fri', v: 22 }, { d: 'Sat', v: 11 }, { d: 'Sun', v: 9 },
];

const RECENT_INSIGHTS = [
  { label: 'Checkout drop-off, mobile Safari', score: '92%' },
  { label: 'Churn risk cluster, EU accounts', score: '88%' },
  { label: 'Support volume spike, billing', score: '95%' },
  { label: 'Upsell window, tier-2 accounts', score: '81%' },
];

export default function DashboardPreview() {
  const [tab, setTab] = useState('overview');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="px-6 pb-32 pt-4 md:px-10 md:pb-36">
      <div className="mx-auto mb-16 max-w-[620px] text-center">
        <div className="mb-3.5 font-mono text-[11.5px] tracking-wide text-amber">THE WORKSPACE</div>
        <h2 className="mb-3.5 font-display text-[28px] font-semibold tracking-tight md:text-[40px]">
          One surface, every signal
        </h2>
        <p className="text-[15.5px] leading-relaxed text-muted">
          A working view of the product, not a marketing render. This is what your team opens
          every morning.
        </p>
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
        className="mx-auto grid max-w-[1180px] grid-cols-1 overflow-hidden rounded-2xl
                   border border-border-strong bg-panel shadow-[0_40px_90px_-30px_rgba(0,0,0,0.6)]
                   md:grid-cols-[220px_1fr]"
      >
        {/* Sidebar */}
        <div className="hidden flex-col gap-0.5 border-r border-border bg-panel-alt p-3.5 md:flex">
          <div className="mb-5 flex items-center gap-2 px-2.5 py-1.5 font-display text-sm font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Xai Workspace
          </div>
          {NAV_ITEMS.map((n) => {
            const Icon = n.icon;
            const isActive = tab === n.id;
            return (
              <div
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2.5 text-[13px]
                  transition-colors ${isActive ? 'bg-accent-dim text-accent' : 'text-muted hover:bg-white/[0.04] hover:text-ink'}`}
              >
                <Icon size={15} strokeWidth={1.8} /> {n.label}
              </div>
            );
          })}
        </div>

        {/* Main panel */}
        <div className="p-6 md:p-7">
          <div className="mb-6 flex items-center justify-between">
            <div className="font-display text-[17px] font-semibold">
              {NAV_ITEMS.find((n) => n.id === tab)?.label}
            </div>
            <div className="rounded-full border border-accent/25 bg-accent-dim px-2.5 py-1 font-mono text-[10.5px] text-accent">
              ● Live
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3.5 md:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-[10px] border border-border bg-panel-alt p-4"
              >
                <div className="mb-2 font-mono text-[11px] text-dim">{s.label}</div>
                <div className="font-display text-[21px] font-semibold">{s.value}</div>
                <div className="mt-1.5 flex items-center gap-1 text-[11.5px] text-accent">
                  <TrendingUp size={12} /> {s.delta} this week
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.4fr_1fr]">
            <div className="rounded-[10px] border border-border bg-panel-alt p-4.5">
              <div className="mb-3.5 font-mono text-[12.5px] text-muted">
                INSIGHTS GENERATED — LAST 7 DAYS
              </div>
              <div className="h-[150px] w-full">
                <ResponsiveContainer>
                  <BarChart data={CHART_DATA}>
                    <XAxis
                      dataKey="d"
                      tick={{ fill: '#565D6E', fontSize: 11, fontFamily: 'var(--font-jetbrains-mono)' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Bar dataKey="v" radius={[4, 4, 0, 0]}>
                      {CHART_DATA.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry.v === 27 ? '#F2A93B' : '#4CD9C0'}
                          fillOpacity={entry.v === 27 ? 1 : 0.55}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-[10px] border border-border bg-panel-alt p-4.5">
              <div className="mb-3.5 font-mono text-[12.5px] text-muted">RECENT INSIGHTS</div>
              {RECENT_INSIGHTS.map((item, i) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between py-2.5 text-[13px] ${
                    i < RECENT_INSIGHTS.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="rounded-md bg-amber-dim px-1.5 py-0.5 font-mono text-[10px] text-amber">
                    {item.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
