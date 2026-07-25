# Xai — Intelligence Workspace

A single-page, high-fidelity interactive prototype built for the Xai frontend
challenge. It walks the visitor through the product's core narrative — raw
data → structured intelligence → actionable insight → automations — using
motion and geometry rather than marketing copy to carry the story.

## Live Demo

🔗 https://xai-intelligence-workspace-nu.vercel.app

## Design

Figma:
https://www.figma.com/design/VvOBhx0NFvfiMOjdmarVLE/Xai-%E2%80%94-Intelligence-Workspace?node-id=0-1&p=f&t=9NvMiBfQxgxqOaTk-0

## Product Documentation

https://docs.google.com/document/d/1XeDOkK7pEfz7-gX-ItX2NCiXIMj8ozK10uECGPFDIi0/edit?tab=t.0#heading=h.9jt82jp0ikf

## A short explanation of key animation and interaction decisions

https://drive.google.com/drive/folders/1H8AH5GckuYvG1UppAPEyR7UazdtQ2X_C

## Tech stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** for layout/utility styling, extended with the project's design tokens
- **Framer Motion** for UI choreography — staggered reveals, `whileInView` triggers, tab/nav transitions
- **GSAP + ScrollTrigger** for the scroll-synced Insight Flow stage activation
- **React Three Fiber (Three.js)** for both 3D moments: the hero particle field and the signature "Intelligence Core"
- **Recharts** for the dashboard's insight-volume chart

## Project structure

```
xai-intelligence-workspace/
├── app/
│   ├── layout.tsx        # fonts (next/font), metadata, root shell
│   ├── page.tsx           # assembles the page from section components
│   └── globals.css        # Tailwind entry + base resets + reduced-motion rules
├── components/
│   ├── Nav.tsx             # sticky nav, fade-in on load
│   ├── Hero.tsx            # hero copy + CTA, staggered Framer Motion reveal
│   ├── HeroCanvas.tsx       # R3F: particle scatter → grid, scroll + cursor driven
│   ├── InsightFlow.tsx      # 3-stage pipeline, GSAP ScrollTrigger activates each stage
│   ├── DashboardPreview.tsx # mock product UI: sidebar, stat cards, chart, insight list
│   ├── SignatureSection.tsx # signature section copy/layout + scroll-in trigger
│   ├── SignatureCanvas.tsx  # R3F: node cluster that reorganizes into a bound core
│   └── Footer.tsx
├── lib/
│   └── useScrollProgress.ts # shared scroll-position → 0-1 progress hook (hero canvas)
├── tailwind.config.ts        # design tokens: colors, font families
└── app/globals.css
```

## Design system

| Token | Value | Role |
|---|---|---|
| `bg` | `#0A0D13` | Base background — graphite, not pure black |
| `panel` / `panel-alt` | `#11151F` / `#161B27` | Card and dashboard surfaces |
| `accent` | `#4CD9C0` | Structure / data — primary interactive color |
| `amber` | `#F2A93B` | Insight — reserved for the "this is the finding" moment |
| Display type | Space Grotesk | Headlines only, used with restraint |
| Body type | Inter | All running copy |
| Mono type | JetBrains Mono | Labels, stats, kickers — anything that reads as data |

Dark, graphite UI was a deliberate choice for a data-intelligence product
aimed at decision-makers (in the spirit of Datadog/Linear/Palantir-style
tooling), not a default. Two accent colors are used for two different jobs —
teal for structure, amber for "this is the insight" — rather than one mood
color doing everything.


## Performance

- Built with Next.js App Router
- Optimized using React Three Fiber
- Static mock data (no backend)
- Smooth GPU-accelerated animations

## Animation & interaction decisions

- **Hero**: the particle field is not decorative — it *is* the thesis. Points
  start scattered in 3D space and interpolate into a grid as the section
  scrolls into view, with cursor position adding subtle parallax rotation.
  This replaces the more common "big headline + gradient blob" hero.
- **Insight Flow**: `ScrollTrigger` fires once per card as it crosses 75% of
  the viewport, permanently activating that stage (and the ones before it),
  so scrolling back up doesn't undo progress — it should read like a
  process you've moved through, not a toggle.
- **Dashboard**: stat cards stagger in with Framer Motion's `whileInView`
  rather than animating on load, so the moment lands when the user actually
  reaches the section. Tab state is local React state — no animation library
  needed for something that simple.
- **Signature (Intelligence Core)**: node positions interpolate from a noisy
  spherical scatter to icosahedron vertices, driven by an `IntersectionObserver`-style
  `useInView` progress target rather than continuous scroll, so the effect
  reads as "resolving," not "attached to your scrollbar."
- Reduced motion: `globals.css` collapses all animation/transition durations
  under `prefers-reduced-motion: reduce`.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deployment

Deploy directly to Vercel:

```bash
npm i -g vercel
vercel
```

No environment variables or backend are required — all data in the
dashboard preview is static/mock, per the assignment spec.
